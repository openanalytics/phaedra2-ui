<template>
  <q-menu>
    <q-list dense>
      <menu-item icon="table_rows" label="Browse Wells" @click="browseWells"/>
      <menu-item icon="show_chart" label="Browse Dose-Response Curves" @click="browseDoseResponseCurves"/>

      <q-separator/>

      <menu-item icon="content_copy" label="Clone Plate(s)"
                 @click="clonePlates" v-close-popup="!uiStore.isPlateSelected()"/>
      <menu-item icon="drive_file_move" label="Move Plate(s)"
                 @click="movePlates" v-close-popup="!uiStore.isPlateSelected()"/>

      <q-separator/>

      <menu-item icon="text_snippet" label="Link Measurement"
                 @click="linkMeasurement" v-close-popup="!uiStore.isPlateSelected()"/>
      <menu-item icon="playlist_add" label="Set Plate Layout"
                 @click="setPlateLayout" v-close-popup="!uiStore.isPlateSelected()"/>
      <menu-item icon="calculate" label="(Re)Calculate Plate"
                 @click="calculatePlate" v-close-popup="!uiStore.isPlateSelected()"/>

      <q-separator/>

      <div v-if="props.plate.approvalStatus === 'APPROVAL_NOT_SET' && experimentStore.isOpen">
        <!-- Validation Menu -->
        <q-item clickable v-if="props.plate.approvalStatus === 'APPROVAL_NOT_SET'">
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
                         @click="invalidate" v-close-popup="!uiStore.isPlateSelected()"/>
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
                         @click="approve" v-close-popup="!uiStore.isPlateSelected()"/>
              <menu-item v-if="props.plate.approvalStatus !== 'APPROVAL_NOT_SET'"
                         icon="remove_circle_outline" label="Reset Approval"
                         @click="resetValidation"/>
              <menu-item icon="cancel" color="negative" label="Disapprove Plate"
                         @click="disapprove" v-close-popup="!uiStore.isPlateSelected()"/>
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
                       @click="addScatterPlot(props.plate.id)" v-close-popup="!uiStore.isPlateSelected()"/>
            <menu-item icon="candlestick_chart" label="Boxplot"
                       @click="addBoxPlot(props.plate.id)" v-close-popup="!uiStore.isPlateSelected()"/>
            <menu-item icon="bar_chart" label="1D Histogram"
                       @click="addHistogram(props.plate.id)" v-close-popup="!uiStore.isPlateSelected()"/>
          </q-list>
        </q-menu>
      </q-item>

      <div v-if="props.plate.approvalStatus === 'APPROVAL_NOT_SET' && experimentStore.isOpen">
        <q-separator/>
        <menu-item icon="delete" color="negative" label="Delete Plate(s)"
                   @click="deletePlate" v-close-popup="!uiStore.isPlateSelected()"/>
      </div>
    </q-list>

    <invalidate-dialog v-model:show="showInvalidateDialog" :plate="props.plate" @onInvalidate="onInvalidatePlate"/>
    <approve-dialog v-model:show="showApproveDialog" :plate="props.plate" @onApprove="onApprovePlate"/>
    <disapprove-dialog v-model:show="showDisapproveDialog" :plate="props.plate" @onDisapprove="onDisapprovePlate"/>
    <calculate-plate-dialog v-model:show="showCalculateDialog" :plate="props.plate" />
    <link-plate-layout-dialog v-model:show="showLinkDialog" :plates="uiStore.selectedPlates"/>
    <delete-dialog v-model:show="showDeleteDialog" :id="props.plate.id" :name="props.plate.barcode" :objectClass="'plate'" @onDeleted="onDeletePlate"/>
    <move-plate-dialog v-model:show="showMovePlatesDialog" :plates="uiStore.selectedPlates" :experiment="experimentStore.experiment" :experiments="projectStore.experiments" @movePlates="onMovePlates"/>
    <link-measurement-dialog v-model:show="showLinkMeasDialog" :plates="uiStore.selectedPlates"/>
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

const browseWells = () => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    router.push({name: "plate", params: {plateId: props.plate.id}, query: {activeTab: "wells"}});
  }
}

const browseDoseResponseCurves = () => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    router.push({name: "plate", params: {plateId: props.plate.id}, query: {activeTab: "curves"}});
  }
}

const clonePlates = () => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    experimentStore.clonePlates(uiStore.selectedPlates)
  }
}

const showMovePlatesDialog = ref(false)
const movePlates = () => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    showMovePlatesDialog.value = true
  }
}
const onMovePlates = (toExperiment) => {
  console.log("Move plate(s) " + [props.plate.barcode] + " to experiment " + toExperiment.name)
  experimentStore.movePlates(uiStore.selectedPlates, toExperiment.id)
}

const showLinkMeasDialog = ref(false)
const linkMeasurement = () => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    showLinkMeasDialog.value = true
  }
}
const onLinkMeasurements = () => {

}

const showLinkDialog = ref(false);
const setPlateLayout = () => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    showLinkDialog.value = true
  }
}

const showCalculateDialog = ref(false);
const calculatePlate = () => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    showCalculateDialog.value = true
  }
}

const validate = () => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    experimentStore.validatePlate(uiStore.selectedPlate.id)
  }
}

const showInvalidateDialog = ref(false);
const invalidate = () => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    showInvalidateDialog.value = true
  }
}
const onInvalidatePlate = (reason) => {
  experimentStore.invalidatePlate(uiStore.selectedPlate.id, reason.value)
  showInvalidateDialog.value = false;
}

const resetValidation = () => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    experimentStore.resetPlateValidation(props.plate.id)
  }
}

const showApproveDialog = ref(false);
const approve = () => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    showApproveDialog.value = true;
  }
}
const onApprovePlate = () => {
  experimentStore.approvePlate(props.plate.id)
  showApproveDialog.value = true
}

const showDisapproveDialog = ref(false);
const disapprove = () => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    showDisapproveDialog.value = true;
  }
}
const onDisapprovePlate = (reason) => {
  experimentStore.disapprovePlate(props.plate.id, reason.value)
  showDisapproveDialog.value = false
}

const addScatterPlot = (plateId) => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    uiStore.loadSelectedPlate(plateId).then(() => {
      uiStore.addChartView({type: 'scatter', plateId: plateId, label: 'Scatter Plot'})
    })
  }
}

const addBoxPlot = (plateId) => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    uiStore.loadSelectedPlate(plateId).then(() => {
      uiStore.addChartView({type: 'box', plateId: plateId, label: 'Box Plot'})
    })
  }
}

const addHistogram = (plateId) => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    uiStore.loadSelectedPlate(plateId).then(() => {
      uiStore.addChartView({type: 'histogram', plateId: plateId, label: 'Histogram'})
    })
  }
}

const showDeleteDialog = ref(null);
const deletePlate = () => {
  if (!uiStore.isPlateSelected()) {
    $q.notify({
      type: 'warning',
      message: 'No plate(s) have been selected!',
      position: "top"
    })
  }
  else {
    showDeleteDialog.value = true
  }
}
const onDeletePlate = () => {
  experimentStore.deletePlate(props.plate.id)
  showDeleteDialog.value = true
}
</script>
