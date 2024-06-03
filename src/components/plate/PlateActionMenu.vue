<template>
  <q-menu>
    <q-list dense>
      <menu-item icon="table_rows" label="Browse Wells" @click="browseWells"/>
      <menu-item icon="show_chart" label="Browse Dose-Response Curves" @click="browseDoseResponseCurves"/>

      <q-separator/>

      <menu-item icon="content_copy" label="Clone Plate(s)"
                 @click="clonePlates" v-close-popup="hideMenu"/>
      <menu-item icon="drive_file_move" label="Move Plate(s)"
                 @click="movePlates" v-close-popup="hideMenu"/>

      <q-separator/>

      <menu-item icon="text_snippet" label="Link Measurement"
                 @click="linkMeasurement" v-close-popup="hideMenu"/>
      <menu-item icon="playlist_add" label="Set Plate Layout"
                 @click="setPlateLayout" v-close-popup="hideMenu"/>
      <menu-item icon="calculate" label="(Re)Calculate Plate"
                 @click="calculatePlate" v-close-popup="hideMenu"/>

      <q-separator/>

      <div v-if="props.plate.approvalStatus === 'APPROVAL_NOT_SET' && experimentStore.isOpen">
        <!-- Validation Menu -->
        <q-item dense clickable v-if="props.plate.approvalStatus === 'APPROVAL_NOT_SET'">
          <q-item-section avatar>
            <q-icon name="outlined_flag"/>
          </q-item-section>
          <q-item-section>Validation</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right"/>
          </q-item-section>

          <q-menu anchor="top end" self="top start">
            <q-list dense>
              <menu-item v-if="props.plate.validationStatus === 'VALIDATION_NOT_SET'"
                         icon="check_circle" color="positive" label="Validate Plate"
                         @click="validate" v-close-popup/>
              <menu-item v-if="props.plate.validationStatus !== 'VALIDATION_NOT_SET'"
                         icon="remove_circle_outline" label="Reset Validation"
                         @click="resetValidation" v-close-popup/>
              <menu-item v-if="props.plate.validationStatus === 'VALIDATION_NOT_SET'"
                         icon="cancel" color="negative" label="Invalidate Plate"
                         @click="invalidate" v-close-popup="hideMenu"/>
            </q-list>
          </q-menu>
        </q-item>

        <!-- Approval Menu -->
        <q-item clickable
                v-if="props.plate.approvalStatus === 'APPROVAL_NOT_SET' && props.plate.validationStatus === 'VALIDATED'">
          <q-item-section avatar>
            <q-icon name="outlined_flag"/>
          </q-item-section>
          <q-item-section>Approval</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right"/>
          </q-item-section>

          <q-menu anchor="top end" self="top start">
            <q-list dense>
              <menu-item icon="check_circle" color="positive" label="Approve Plate"
                         @click="approve" v-close-popup="hideMenu"/>
              <menu-item v-if="props.plate.approvalStatus !== 'APPROVAL_NOT_SET'"
                         icon="remove_circle_outline" label="Reset Approval"
                         @click="resetValidation"/>
              <menu-item icon="cancel" color="negative" label="Disapprove Plate"
                         @click="disapprove" v-close-popup="hideMenu"/>
            </q-list>
          </q-menu>
        </q-item>
      </div>

      <q-separator/>

      <!-- Charts -->
      <q-item dense clickable>
        <q-item-section avatar>
          <q-icon name="insert_chart"/>
        </q-item-section>
        <q-item-section>Charts</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right"/>
        </q-item-section>
        <q-menu>
          <q-list>
            <menu-item icon="scatter_plot" label="Scatterplot 2D"
                       @click="addScatterPlot(props.plate.id)" v-close-popup="hideMenu"/>
            <menu-item icon="candlestick_chart" label="Boxplot"
                       @click="addBoxPlot(props.plate.id)" v-close-popup="hideMenu"/>
            <menu-item icon="bar_chart" label="1D Histogram"
                       @click="addHistogram(props.plate.id)" v-close-popup="hideMenu"/>
          </q-list>
        </q-menu>
      </q-item>

      <div v-if="props.plate.approvalStatus === 'APPROVAL_NOT_SET' && experimentStore.isOpen">
        <q-separator/>
        <menu-item icon="delete" color="negative" label="Delete Plate(s)"
                   @click="deletePlate" v-close-popup="hideMenu"/>
      </div>
    </q-list>

    <invalidate-dialog v-model:show="showInvalidateDialog" :plates="uiStore.selectedPlates" @onInvalidate="onInvalidatePlate"/>
    <approve-dialog v-model:show="showApproveDialog" :plates="uiStore.selectedPlates" @onApprove="onApprovePlate"/>
    <disapprove-dialog v-model:show="showDisapproveDialog" :plates="uiStore.selectedPlates" @onDisapprove="onDisapprovePlate"/>
    <calculate-plate-dialog v-model:show="showCalculateDialog" :plates="uiStore.selectedPlates" />
    <link-plate-layout-dialog v-model:show="showLinkDialog" :plates="uiStore.selectedPlates"/>
    <delete-dialog v-model:show="showDeleteDialog" :id="props.plate.id" :name="props.plate.barcode" :objectClass="'plate'" @onDeleted="onDeletePlate"/>
    <move-plate-dialog v-model:show="showMovePlatesDialog" :plates="uiStore.selectedPlates" :experiment="experimentStore.experiment"
                       :experiments="projectStore.experiments" @movePlates="onMovePlates"/>
    <link-measurement-dialog v-model:show="showLinkMeasDialog" :plates="uiStore.selectedPlates" />
  </q-menu>
</template>

<script setup>
import InvalidateDialog from "@/components/plate/InvalidateDialog";
import DisapproveDialog from "@/components/plate/DisapproveDialog";
import ApproveDialog from "@/components/plate/ApproveDialog";
import CalculatePlateDialog from "@/components/plate/CalculatePlateDialog";
import LinkPlateLayoutDialog from "@/components/plate/LinkPlateLayoutDialog.vue";
import DeleteDialog from "@/components/widgets/DeleteDialog";

import {ref} from "vue";
import {useStore} from 'vuex'
import {useExperimentStore} from "@/stores/experiment";
import {useRouter} from "vue-router";
import {useUIStore} from "@/stores/ui";
import MovePlateDialog from "@/components/plate/MovePlateDialog.vue";
import {useProjectStore} from "@/stores/project";
import LinkMeasurementDialog from "@/components/measurement/LinkMeasurementDialog.vue";
import { useQuasar } from 'quasar'
import MenuItem from "@/components/widgets/MenuItem.vue";

const props = defineProps(['plate', 'plates']);
const $q = useQuasar()

const store = useStore()
const uiStore = useUIStore()
const router = useRouter()
const experimentStore = useExperimentStore()
const projectStore = useProjectStore()

const hideMenu = ref(false)

const browseWells = () => {
  handlePlateSelection(() => {
    router.push({name: "plate", params: {plateId: props.plate.id}, query: {activeTab: "wells"}});
  }, 'No plate(s) have been selected!');
}

const browseDoseResponseCurves = () => {
  handlePlateSelection(() => {
    router.push({name: "plate", params: {plateId: props.plate.id}, query: {activeTab: "curves"}});
  }, 'No plate(s) have been selected!');
}

const clonePlates = () => {
  handlePlateSelection(() => {
    $q.loading.show()
    experimentStore.clonePlates(uiStore.selectedPlates).then(() => $q.loading.hide());
    hideMenu.value = true
  }, 'No plate(s) have been selected!');
}

const showMovePlatesDialog = ref(false)
const movePlates = () => {
  handlePlateSelection(() => {
    showMovePlatesDialog.value = true;
  }, 'No plate(s) have been selected!');
}
const onMovePlates = (toExperiment) => {
  console.log("Move plate(s) " + [props.plate.barcode] + " to experiment " + toExperiment.name)
  $q.loading.show()
  experimentStore.movePlates(uiStore.selectedPlates, toExperiment.id).then(() => $q.loading.hide())
}

const showLinkMeasDialog = ref(false)
const linkMeasurement = () => {
  handlePlateSelection(() => {
    showLinkMeasDialog.value = true
  }, 'No plate(s) have been selected!')
}

const showLinkDialog = ref(false);
const setPlateLayout = () => {
  handlePlateSelection(() => {
    showLinkDialog.value = true
  }, 'No plate(s) have been selected!')
}

const showCalculateDialog = ref(false);
const calculatePlate = () => {
  handlePlateSelection(() => {
    showCalculateDialog.value = true
  }, 'No plate(s) have been selected!')
}

const validate = () => {
  handlePlateSelection(() => {
    $q.loading.show()
    experimentStore.validatePlates(uiStore.selectedPlates).then(() => $q.loading.hide())
  }, 'No plate(s) have been selected!')
}

const showInvalidateDialog = ref(false);
const invalidate = () => {
  handlePlateSelection(() => {
    showInvalidateDialog.value = true
  }, 'No plate(s) have been selected!')
}
const onInvalidatePlate = (reason) => {
  $q.loading.show()
  experimentStore.invalidatePlates(uiStore.selectedPlates, reason.value).then(() => $q.loading.hide())
  showInvalidateDialog.value = false;
}

const resetValidation = () => {
  handlePlateSelection(() => {
    $q.loading.show()
    experimentStore.resetPlateValidations(uiStore.selectedPlates).then(() => $q.loading.hide())
  }, 'No plate(s) have been selected!')
}

const showApproveDialog = ref(false);
const approve = () => {
  handlePlateSelection(() => {
    showApproveDialog.value = true;
  }, 'No plate(s) have been selected!')
}
const onApprovePlate = () => {
  $q.loading.show()
  experimentStore.approvePlates(uiStore.selectedPlates).then(() => $q.loading.hide())
  showApproveDialog.value = true
}

const showDisapproveDialog = ref(false);
const disapprove = () => {
  handlePlateSelection(() => {
    showDisapproveDialog.value = true;
  }, 'No plate(s) have been selected!')
}
const onDisapprovePlate = (reason) => {
  $q.loading.show()
  experimentStore.disapprovePlates(uiStore.selectedPlates, reason.value).then(() => $q.loading.hide())
  showDisapproveDialog.value = false
}

const addScatterPlot = (plateId) => {
  handlePlateSelection(() => {
    $q.loading.show()
    uiStore.loadSelectedPlate(plateId).then(() => {
      $q.loading.hide()
      uiStore.addChartView({type: 'scatter', plateId: plateId, label: 'Scatter Plot'})
    })
  }, 'No plate(s) have been selected!')
}

const addBoxPlot = (plateId) => {
  handlePlateSelection(() => {
    $q.loading.show()
    uiStore.loadSelectedPlate(plateId).then(() => {
      $q.loading.hide()
      uiStore.addChartView({type: 'box', plateId: plateId, label: 'Box Plot'})
    })
  }, 'No plate(s) have been selected!')
}

const addHistogram = (plateId) => {
  handlePlateSelection(() => {
    $q.loading.show()
    uiStore.loadSelectedPlate(plateId).then(() => {
      $q.loading.hide()
      uiStore.addChartView({type: 'histogram', plateId: plateId, label: 'Histogram'})
  })}, 'No plate(s) have been selected!')
}

const showDeleteDialog = ref(null);
const deletePlate = () => {
  handlePlateSelection(() => showDeleteDialog.value = true, 'No plate(s) have been selected!')
}
const onDeletePlate = () => {
  $q.loading.show()
  experimentStore.deletePlates(uiStore.selectedPlates).then(() => $q.loading.hide())
  showDeleteDialog.value = true
}

const handlePlateSelection = (action, onFailureMessage) => {
  if (!uiStore.isPlateSelected()) {
    hideMenu.value = true
    $q.notify({
      type: 'warning',
      message: onFailureMessage,
      position: "top"
    });
  } else {
    hideMenu.value = false
    action();
  }
}
</script>
-
