<template>
  <q-menu>
    <q-list dense>
      <div v-if="isOpen">
        <menu-item
          icon="playlist_add"
          label="Set Plate Layout"
          @click="openLinkPlateDialog"
        />
        <menu-item
          icon="calculate"
          label="(Re)Calculate Plate(s)"
          @click="openRecalculatePlatesDialog"
        />
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
        <q-menu>
          <q-list>
            <menu-item
              icon="timeline"
              label="Plate Trend"
              @click="addExperimentPlateTrendChart"
              v-close-popup
            />
          </q-list>
        </q-menu>
      </q-item>

      <q-separator />

      <q-item dense clickable>
        <q-item-section avatar>
          <q-icon name="save_alt" />
        </q-item-section>
        <q-item-section>Export</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right" />
        </q-item-section>
        <q-menu>
          <q-list>
            <menu-item
              icon="save_alt"
              label="Export Well Data"
              @click="exportPlateWellData"
              v-close-popup
            />
            <menu-item
              icon="save_alt"
              label="Export Sub-Well Data"
              @click="exportPlateSubWellData"
              v-close-popup
            />
          </q-list>
        </q-menu>
      </q-item>

      <q-separator />

      <menu-item
        v-if="isOpen"
        icon="lock"
        label="Close Experiment"
        @click="handleCloseExperiment"
        v-close-popup
      />
      <menu-item
        v-if="!isOpen"
        icon="lock_open"
        label="Open Experiment"
        @click="handleOpenExperiment"
        v-close-popup
      />
      <menu-item
        v-if="isOpen"
        icon="delete"
        label="Delete Experiment"
        @click="openDeleteDialog"
        v-close-popup
      />
      <menu-item
        v-if="isOpen"
        icon="details"
        label="Open Experiment Details"
        @click="openExperimentDetails"
        v-close-popup
      />
      <menu-item
        v-if="isOpen"
        icon="delete"
        label="Open Plates"
        @click="openPlates"
        v-close-popup
      />
    </q-list>

    <delete-dialog
      v-if="isOpen"
      :id="props.experiment.id"
      :name="props.experiment.name"
      :objectClass="'experiment'"
      v-model:show="showDeleteDialog"
      @onDeleted="onDeleted"
    />
    <link-plate-layout-dialog
      v-if="isOpen"
      v-model:show="showLinkPlateDialog"
      :plates="plates"
    />
    <calculate-plate-dialog
      v-if="isOpen"
      v-model:show="showCalculatePlateDialog"
      :plates="plates"
    />
  </q-menu>
</template>

<script setup>
import DeleteDialog from "@/components/widgets/DeleteDialog";
import { useProjectStore } from "@/stores/project";
import { computed, ref } from "vue";
import LinkPlateLayoutDialog from "@/components/plate/LinkPlateLayoutDialog.vue";
import MenuItem from "@/components/widgets/MenuItem.vue";
import { useQuasar } from "quasar";
import projectsGraphQlAPI from "@/api/graphql/projects";
import CalculatePlateDialog from "@/components/plate/CalculatePlateDialog.vue";
import { useUIStore } from "@/stores/ui";
import { usePanesStore } from "@/stores/panes";
import { useExperimentStore } from "@/stores/experiment";

const $q = useQuasar();
const props = defineProps(["experiment"]);
const projectStore = useProjectStore();
const panesStore = usePanesStore();
const experimentStore = useExperimentStore();

const isOpen = computed(() =>
  props.experiment.status === "OPEN" ? true : false
);
const showDeleteDialog = ref(false);
const showLinkPlateDialog = ref(false);
const showCalculatePlateDialog = ref(false);

const plates = ref([]);

const openDeleteDialog = () => {
  showDeleteDialog.value = true;
};

const getPlates = () => {
  const { onResult, onError } = projectsGraphQlAPI.experimentById(
    props.experiment.id
  );
  onResult(({ data }) => {
    plates.value = [...data.plates];
  });
  onError((error) => {
    displayErrorNotification("Error while updating plates: " + error.message);
  });
};

const openLinkPlateDialog = () => {
  getPlates();
  showLinkPlateDialog.value = true;
};

const openRecalculatePlatesDialog = () => {
  getPlates();
  showCalculatePlateDialog.value = true;
};

const handleCloseExperiment = () => {
  console.log("Close experiment " + props.experiment.name);
  projectStore.closeExperiment(props.experiment.id);
};

const handleOpenExperiment = () => {
  projectStore.openExperiment(props.experiment.id);
};

const onDeleted = () => {
  projectStore.deleteExperiment(props.experiment.id);
};

const showUnderConstructionMessage = () => {
  $q.notify({
    type: "warning",
    message: "Feature is under construction!",
    position: "top",
    actions: [{ icon: "close", color: "secondary", round: true }],
  });
};

const displayErrorNotification = (errorMessage) => {
  $q.notify({
    type: "negative",
    message: "Unable to retrieve experiment's plates!",
    position: "top",
    actions: [{ icon: "close", color: "secondary", round: true }],
  });
  console.error(errorMessage);
};

const uiStore = useUIStore();
const addExperimentPlateTrendChart = (experimentId) => {
  if (uiStore.isExperimentSelected()) {
    uiStore.addChartView({
      type: "trend",
      experimentId: experimentId,
      label: "Experiment Trend Chart",
    });
  }
};
const exportPlateWellData = showUnderConstructionMessage;
const exportPlateSubWellData = showUnderConstructionMessage;

const openExperimentDetails = () => {
  selectedExperiment.value = row;
};

const openPlates = () => {
  experimentStore.loadExperiment(props.experiment.id);
  panesStore.addItem("plates-list-pane", "experiment-list-pane", "center");
};
</script>
