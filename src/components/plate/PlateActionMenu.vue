<template>
  <q-menu>
    <q-list dense>
      <q-item dense clickable @click="browseWells">
        <q-item-section avatar>
          <q-icon name="table_rows"/>
        </q-item-section>
        <q-item-section>Browse Wells</q-item-section>
      </q-item>

      <q-item dense clickable @click="browseDoseResponseCurves">
        <q-item-section avatar>
          <q-icon name="show_chart"/>
        </q-item-section>
        <q-item-section>Browse Dose-Response Curves</q-item-section>
      </q-item>

      <q-separator/>

      <q-item dense clickable @click="clonePlates" v-close-popup>
        <q-item-section avatar>
          <q-icon name="content_copy"/>
        </q-item-section>
        <q-item-section>Clone Plate(s)</q-item-section>
      </q-item>

      <q-item dense clickable @click="movePlates">
        <q-item-section avatar >
          <q-icon name="drive_file_move"/>
        </q-item-section>
        <q-item-section>Move Plate(s)</q-item-section>
      </q-item>

      <div v-if="props.plate.approvalStatus === 'APPROVAL_NOT_SET' && experimentStore.isOpen">
        <q-separator/>
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
              <q-item clickable v-if="props.plate.validationStatus === 'VALIDATION_NOT_SET'" @click="validate()">
                <q-item-section avatar>
                  <q-icon color="positive" name="check_circle"/>
                </q-item-section>
                <q-item-section>Validate Plate</q-item-section>
              </q-item>
              <q-item clickable v-if="props.plate.validationStatus !== 'VALIDATION_NOT_SET'" @click="resetValidation()">
                <q-item-section avatar>
                  <q-icon name="remove_circle_outline"/>
                </q-item-section>
                <q-item-section>Reset Validation</q-item-section>
              </q-item>
              <q-item clickable v-if="props.plate.validationStatus === 'VALIDATION_NOT_SET'" @click="invalidate()">
                <q-item-section avatar>
                  <q-icon color="negative" name="cancel"/>
                </q-item-section>
                <q-item-section>Invalidate Plate</q-item-section>
              </q-item>
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
              <q-item clickable @click="approve()">
                <q-item-section avatar>
                  <q-icon color="positive" name="check_circle"/>
                </q-item-section>
                <q-item-section>Approve Plate</q-item-section>
              </q-item>
              <q-item clickable v-if="props.plate.validationStatus !== 'VALIDATION_NOT_SET'" @click="resetValidation()">
                <q-item-section avatar>
                  <q-icon name="remove_circle_outline"/>
                </q-item-section>
                <q-item-section>Reset Approval</q-item-section>
              </q-item>
              <q-item clickable @click="disapprove()">
                <q-item-section avatar>
                  <q-icon color="negative" name="cancel"/>
                </q-item-section>
                <q-item-section>Disapprove Plate</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>

        <q-separator/>

        <q-item clickable @click="setPlateLayout()" >
          <q-item-section avatar>
            <q-icon name="playlist_add"/>
          </q-item-section>
          <q-item-section>Set Plate Layout</q-item-section>
        </q-item>

        <q-item clickable @click="calculatePlate()">
          <q-item-section avatar>
            <q-icon name="calculate"/>
          </q-item-section>
          <q-item-section>(Re)Calculate Plate</q-item-section>
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
            <q-item dense clickable @click="addScatterPlot(props.plate.id)" v-close-popup>
              <q-item-section avatar>
                <q-icon name="scatter_plot"/>
              </q-item-section>
              <q-item-section>Scatterplot 2D</q-item-section>
            </q-item>
            <q-item dense clickable @click="addBoxPlot(props.plate.id)" v-close-popup>
              <q-item-section avatar>
                <q-icon name="candlestick_chart"/>
              </q-item-section>
              <q-item-section>Boxplot</q-item-section>
            </q-item>
            <q-item dense clickable @click="addHistogram(props.plate.id)" v-close-popup>
              <q-item-section avatar>
                <q-icon name="bar_chart"/>
              </q-item-section>
              <q-item-section>1D Histogram</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>

      <div v-if="props.plate.approvalStatus === 'APPROVAL_NOT_SET' && experimentStore.isOpen">
        <q-separator/>
        <q-item clickable @click="deletePlate()">
          <q-item-section avatar>
            <q-icon name="delete"/>
          </q-item-section>
          <q-item-section>Delete Plate</q-item-section>
        </q-item>
      </div>
    </q-list>

    <invalidate-dialog v-model:show="showInvalidateDialog" :plate="props.plate" @onInvalidate="onInvalidatePlate"/>
    <approve-dialog v-model:show="showApproveDialog" :plate="props.plate" @onApprove="onApprovePlate"/>
    <disapprove-dialog v-model:show="showDisapproveDialog" :plate="props.plate" @onDisapprove="onDisapprovePlate"/>
    <calculate-plate-dialog v-model:show="showCalculateDialog" :plate="props.plate" />
    <link-plate-dialog v-model:show="showLinkDialog" :plate="props.plate"/>
    <delete-dialog v-model:show="showDeleteDialog" :id="props.plate.id" :name="props.plate.barcode" :objectClass="'plate'" @onDeleted="onDeletePlate"/>
    <move-plate-dialog v-model:show="showMovePlatesDialog" :plates="[props.plate]" :experiment="experimentStore.experiment" :experiments="projectStore.experiments" @movePlates="onMovePlates"/>
  </q-menu>
</template>

<script setup>
import InvalidateDialog from "@/components/plate/InvalidateDialog";
import DisapproveDialog from "@/components/plate/DisapproveDialog";
import ApproveDialog from "@/components/plate/ApproveDialog";
import CalculatePlateDialog from "@/components/plate/CalculatePlateDialog";
import LinkPlateDialog from "@/components/plate/LinkPlateDialog";
import DeleteDialog from "@/components/widgets/DeleteDialog";

import {ref} from "vue";
import {useStore} from 'vuex'
import {useExperimentStore} from "@/stores/experiment";
import {useRouter} from "vue-router";
import {useUIStore} from "@/stores/ui";
import projectsGraphQlAPI from "@/api/graphql/projects";
import resultDataGraphQlAPI from "@/api/graphql/resultdata";
import {usePlateStore} from "@/stores/plate";
import MovePlateDialog from "@/components/plate/MovePlateDialog.vue";
import {useProjectStore} from "@/stores/project";

const props = defineProps(['plate', 'plates']);

const store = useStore()
const uiStore = useUIStore()
const plateStore = usePlateStore()
const router = useRouter()
const experimentStore = useExperimentStore()
const projectStore = useProjectStore()

const showInvalidateDialog = ref(false);
const showApproveDialog = ref(false);
const showDisapproveDialog = ref(false);
const showCalculateDialog = ref(false);
const showLinkDialog = ref(false);
const showDeleteDialog = ref(null);
const showMovePlatesDialog = ref(false)

const validate = () => {
  experimentStore.validatePlate(props.plate.id)
}

const invalidate = () => {
  showInvalidateDialog.value = true;
}

const resetValidation = () => {
  experimentStore.resetPlateValidation(props.plate.id)
}

const approve = () => {
  showApproveDialog.value = true;
}

const disapprove = () => {
  showDisapproveDialog.value = true;
}

const calculatePlate = () => {
  showCalculateDialog.value = true;
}

const browseWells = () => {
  router.push({name: "plate", params: { plateId: props.plate.id }, query: { activeTab: "wells" }});
}

const browseDoseResponseCurves = () => {
  router.push({name: "plate", params: { plateId: props.plate.id }, query: { activeTab: "curves" }});
}

const fitCurves = () => {
  store.dispatch()
}

const setPlateLayout = () => {
  showLinkDialog.value = true;
}

const deletePlate = () => {
  showDeleteDialog.value = true;
}

const onInvalidatePlate = (reason) => {
  experimentStore.invalidatePlate(props.plate.id, reason.value)
  showInvalidateDialog.value = true;
}

const onApprovePlate = () => {
  experimentStore.approvePlate(props.plate.id)
  showApproveDialog.value = true
}

const onDisapprovePlate = (reason) => {
  experimentStore.disapprovePlate(props.plate.id, reason.value)
  showDisapproveDialog.value = true;
}

const onDeletePlate = () => {
  experimentStore.deletePlate(props.plate.id)
  showDeleteDialog.value = true;
}

const addScatterPlot = (plateId) => {
  uiStore.addChartView({type: 'scatter', plateId: plateId, label: 'Scatter Plot'})
}

const addBoxPlot = (plateId) => {
  uiStore.addChartView({type: 'box', plateId: plateId, label: 'Box Plot'})
}

const addHistogram = (plateId) => {
  uiStore.addChartView({type: 'histogram', plateId: plateId, label: 'Histogram'})
}

const clonePlates = () => {
  experimentStore.clonePlates([props.plate])
}

const movePlates = () => {
  showMovePlatesDialog.value = true;
}

const onMovePlates = (toExperiment) => {
  console.log("Move plate(s) " + [props.plate.barcode] + " to experiment " + toExperiment.name)
  experimentStore.movePlates([props.plate], toExperiment.id)
}
</script>
