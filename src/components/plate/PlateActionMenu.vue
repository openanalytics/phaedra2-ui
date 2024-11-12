<template>
  <q-menu context-menu v-if="plates.length > 0">
    <menu-item
      v-show="route.name == 'workbench'"
      icon="info"
      color="primary"
      label="Plate Details"
      @click="openPlateDetails"
    />

    <q-list dense>
      <menu-item icon="table_rows" label="Browse Wells" @click="browseWells" />
      <menu-item
        v-if="route.name != 'workbench'"
        icon="show_chart"
        label="Browse Dose-Response Curves"
        @click="browseDoseResponseCurves"
      />

      <q-separator v-if="route.name != 'workbench'" />

      <menu-item
        v-if="route.name != 'workbench'"
        icon="content_copy"
        label="Clone Plate(s)"
        @click="clonePlates"
        v-close-popup
      />
      <menu-item
        v-if="route.name != 'workbench'"
        icon="drive_file_move"
        label="Move Plate(s)"
        @click="movePlates"
        v-close-popup
      />

      <q-separator v-if="route.name != 'workbench'" />

      <menu-item
        v-if="route.name != 'workbench'"
        icon="text_snippet"
        label="Link Measurement"
        @click="linkMeasurement"
      />
      <menu-item
        v-if="route.name != 'workbench'"
        icon="playlist_add"
        label="Set Plate Layout"
        @click="setPlateLayout"
      />
      <menu-item
        v-if="route.name != 'workbench'"
        icon="calculate"
        label="(Re)Calculate Plate"
        @click="calculatePlate"
      />

      <q-separator />

      <div
        v-if="
          props.plate.approvalStatus === 'APPROVAL_NOT_SET' &&
          experimentStore.isOpen
        "
      >
        <!-- Validation Menu -->
        <q-item
          dense
          clickable
          v-if="props.plate.approvalStatus === 'APPROVAL_NOT_SET'"
        >
          <q-item-section avatar>
            <q-icon name="outlined_flag" />
          </q-item-section>
          <q-item-section>Validation</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>

          <q-menu anchor="top end" self="top start">
            <q-list dense>
              <menu-item
                v-if="props.plate.validationStatus === 'VALIDATION_NOT_SET'"
                icon="check_circle"
                color="positive"
                label="Validate Plate"
                @click="validate"
                v-close-popup
              />
              <menu-item
                v-if="props.plate.validationStatus !== 'VALIDATION_NOT_SET'"
                icon="remove_circle_outline"
                label="Reset Validation"
                @click="resetValidation"
                v-close-popup
              />
              <menu-item
                v-if="props.plate.validationStatus === 'VALIDATION_NOT_SET'"
                icon="cancel"
                color="negative"
                label="Invalidate Plate"
                @click="invalidate"
                v-close-popup
              />
            </q-list>
          </q-menu>
        </q-item>

        <!-- Approval Menu -->
        <q-item
          clickable
          v-if="
            props.plate.approvalStatus === 'APPROVAL_NOT_SET' &&
            props.plate.validationStatus === 'VALIDATED'
          "
        >
          <q-item-section avatar>
            <q-icon name="outlined_flag" />
          </q-item-section>
          <q-item-section>Approval</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>

          <q-menu anchor="top end" self="top start">
            <q-list dense>
              <menu-item
                icon="check_circle"
                color="positive"
                label="Approve Plate"
                @click="approve"
                v-close-popup
              />
              <menu-item
                v-if="props.plate.approvalStatus !== 'APPROVAL_NOT_SET'"
                icon="remove_circle_outline"
                label="Reset Approval"
                @click="resetValidation"
              />
              <menu-item
                icon="cancel"
                color="negative"
                label="Disapprove Plate"
                @click="disapprove"
                v-close-popup
              />
            </q-list>
          </q-menu>
        </q-item>
      </div>

      <q-separator />

      <!-- Charts -->
      <q-item dense clickable>
        <q-item-section avatar>
          <q-icon name="insert_chart" />
        </q-item-section>
        <q-item-section>Charts</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right" />
        </q-item-section>
        <q-menu anchor="top right">
          <q-list>
            <menu-item
              icon="timeline"
              label="Plate Trend"
              @click="addExperimentPlateTrendChart"
              v-close-popup
            />
            <menu-item
              icon="scatter_plot"
              label="Scatterplot 2D"
              @click="addScatterPlot(props.plate.id)"
              v-close-popup
            />
            <menu-item
              icon="candlestick_chart"
              label="Boxplot"
              @click="addBoxPlot(props.plate.id)"
              v-close-popup
            />
            <menu-item
              icon="bar_chart"
              label="1D Histogram"
              @click="addHistogram(props.plate.id)"
              v-close-popup
            />
          </q-list>
        </q-menu>
      </q-item>

      <q-separator />

      <!-- Details -->
      <q-item v-if="route.name == 'workbench'" dense clickable>
        <q-item-section avatar>
          <q-icon name="details" />
        </q-item-section>
        <q-item-section>Browse details</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right" />
        </q-item-section>
        <q-menu anchor="top right">
          <q-list>
            <menu-item
              icon="view_module"
              label="Heatmap"
              @click="addHeatmap"
              v-close-popup
            />
          </q-list>
        </q-menu>
      </q-item>

      <div
        v-if="
          props.plate.approvalStatus === 'APPROVAL_NOT_SET' &&
          experimentStore.isOpen
        "
      >
        <q-separator />
        <menu-item
          icon="delete"
          color="negative"
          label="Delete Plate(s)"
          @click="deletePlate"
          v-close-popup
        />
      </div>
    </q-list>
  </q-menu>

  <invalidate-dialog
    v-model:show="showInvalidateDialog"
    :plates="uiStore.selectedPlates"
    @onInvalidate="onInvalidatePlate"
  />
  <approve-dialog
    v-model:show="showApproveDialog"
    :plates="uiStore.selectedPlates"
    @onApprove="onApprovePlate"
  />
  <disapprove-dialog
    v-model:show="showDisapproveDialog"
    :plates="uiStore.selectedPlates"
    @onDisapprove="onDisapprovePlate"
  />
  <calculate-plate-dialog
    v-model:show="showCalculateDialog"
    :plates="uiStore.selectedPlates"
  />
  <link-plate-layout-dialog
    v-model:show="showLinkDialog"
    :plates="uiStore.selectedPlates"
    @onLinkPlate="handleSetPlateLayout"
  />
  <delete-dialog
    v-model:show="showDeleteDialog"
    :objectClass="'plate'"
    :items="plates"
    @onDeleted="onDeletePlate"
  />
  <move-plate-dialog
    v-model:show="showMovePlatesDialog"
    :plates="uiStore.selectedPlates"
    :experiment="experimentStore.experiment"
    :experiments="projectStore.experiments"
    @movePlates="onMovePlates"
  />
  <link-measurement-dialog
    v-model:show="showLinkMeasDialog"
    :plates="uiStore.selectedPlates"
  />
</template>

<script setup>
import InvalidateDialog from "@/components/plate/InvalidateDialog";
import DisapproveDialog from "@/components/plate/DisapproveDialog";
import ApproveDialog from "@/components/plate/ApproveDialog";
import CalculatePlateDialog from "@/components/plate/CalculatePlateDialog";
import LinkPlateLayoutDialog from "@/components/plate/LinkPlateLayoutDialog.vue";
import DeleteDialog from "@/components/widgets/DeleteDialog";

import { ref } from "vue";
import { useExperimentStore } from "@/stores/experiment";
import { useRoute, useRouter } from "vue-router";
import { useUIStore } from "@/stores/ui";
import MovePlateDialog from "@/components/plate/MovePlateDialog.vue";
import { useProjectStore } from "@/stores/project";
import LinkMeasurementDialog from "@/components/measurement/LinkMeasurementDialog.vue";
import MenuItem from "@/components/widgets/MenuItem.vue";
import { useLoadingHandler } from "@/composable/loadingHandler";
import { useNotification } from "@/composable/notification";
import { usePanesStore } from "@/stores/panes";

const props = defineProps(["plate", "plates"]);
const emit = defineEmits(["onDeletePlates", "open"]);

const uiStore = useUIStore();
const router = useRouter();
const route = useRoute();
const experimentStore = useExperimentStore();
const projectStore = useProjectStore();
const loadingHandler = useLoadingHandler();
const panesStore = usePanesStore();

const hideMenu = ref(false);

const browseWells = () => {
  emit("open", "wells-list-pane");
};

const browseDoseResponseCurves = () => {
  handlePlateSelection(() => {
    router.push({
      name: "plate",
      params: { plateId: props.plate.id },
      query: { activeTab: "curves" },
    });
  }, "No plate(s) have been selected!");
};

const clonePlates = async () => {
  handlePlateSelection(async () => {
    await loadingHandler.handleLoadingDuring(
      experimentStore.clonePlates(uiStore.selectedPlates)
    );
    hideMenu.value = true;
  }, "No plate(s) have been selected!");
};

const showMovePlatesDialog = ref(false);
const movePlates = () => {
  handlePlateSelection(() => {
    showMovePlatesDialog.value = true;
  }, "No plate(s) have been selected!");
};
const onMovePlates = async (toExperiment) => {
  console.log(
    "Move plate(s) " +
      [props.plate.barcode] +
      " to experiment " +
      toExperiment.name
  );
  await loadingHandler.handleLoadingDuring(
    experimentStore.movePlates(uiStore.selectedPlates, toExperiment.id)
  );
};

const showLinkMeasDialog = ref(false);
const linkMeasurement = () => {
  handlePlateSelection(() => {
    showLinkMeasDialog.value = true;
  }, "No plate(s) have been selected!");
};

const showLinkDialog = ref(false);
const setPlateLayout = () => {
  handlePlateSelection(() => {
    showLinkDialog.value = true;
  }, "No plate(s) have been selected!");
};

const showCalculateDialog = ref(false);
const calculatePlate = () => {
  handlePlateSelection(() => {
    showCalculateDialog.value = true;
  }, "No plate(s) have been selected!");
};

const validate = async () => {
  handlePlateSelection(async () => {
    await loadingHandler.handleLoadingDuring(
      experimentStore.validatePlates(uiStore.selectedPlates)
    );
  }, "No plate(s) have been selected!");
};

const showInvalidateDialog = ref(false);
const invalidate = () => {
  handlePlateSelection(() => {
    showInvalidateDialog.value = true;
  }, "No plate(s) have been selected!");
};
const onInvalidatePlate = async (reason) => {
  await loadingHandler.handleLoadingDuring(
    experimentStore.invalidatePlates(uiStore.selectedPlates, reason.value)
  );
  showInvalidateDialog.value = false;
};

const resetValidation = async () => {
  handlePlateSelection(async () => {
    await loadingHandler.handleLoadingDuring(
      experimentStore.resetPlateValidations(uiStore.selectedPlates)
    );
  }, "No plate(s) have been selected!");
};

const showApproveDialog = ref(false);
const approve = () => {
  handlePlateSelection(() => {
    showApproveDialog.value = true;
  }, "No plate(s) have been selected!");
};
const onApprovePlate = async () => {
  await loadingHandler.handleLoadingDuring(
    experimentStore.approvePlates(uiStore.selectedPlates)
  );
  showApproveDialog.value = false;
};

const showDisapproveDialog = ref(false);
const disapprove = () => {
  handlePlateSelection(() => {
    showDisapproveDialog.value = true;
  }, "No plate(s) have been selected!");
};
const onDisapprovePlate = async (reason) => {
  await loadingHandler.handleLoadingDuring(
    experimentStore.disapprovePlates(uiStore.selectedPlates, reason.value)
  );
  showDisapproveDialog.value = false;
};

const addScatterPlot = async () => {
  emit("open", "scatterplot-chart-pane");
  hideMenu.value = true;
};

const addBoxPlot = async () => {
  emit("open", "boxplot-chart-pane");
  hideMenu.value = true;
};

const addHistogram = async () => {
  emit("open", "histogram-chart-pane");
  hideMenu.value = true;
};

const addHeatmap = () => {
  emit("open", "heatmap-chart-pane");
};

const addExperimentPlateTrendChart = () => {
  emit("open", "experiment-chart-pane");
};

const showDeleteDialog = ref(null);
const deletePlate = () => {
  handlePlateSelection(
    () => (showDeleteDialog.value = true),
    "No plate(s) have been selected!"
  );
};
const onDeletePlate = async () => {
  // await loadingHandler.handleLoadingDuring(
  // );
  emit("onDeletePlates");
  showDeleteDialog.value = false;
};

const notify = useNotification();
const handlePlateSelection = (action, onFailureMessage) => {
  if (!props.plates.length > 0) {
    notify.showWarning(onFailureMessage);
  } else {
    action();
  }
};
const handleSetPlateLayout = () => {
  notify.showInfo(
    "The plate layout has been updated! ",
    () => {
      showCalculateDialog.value = true;
    },
    () => {}
  );
};

const openPlateDetails = () => {
  emit("open", "plate-details-pane");
};
</script>
