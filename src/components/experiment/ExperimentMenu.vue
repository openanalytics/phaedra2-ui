<template>
  <q-menu context-menu>
    <q-list dense>
      <div v-if="isOpen">
        <menu-item
          icon="playlist_add"
          label="Set Plate Layout"
          @click="setPlateLayout"
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
              label="Export Plate List"
              @click="openExportPlateListDialog"
            />
            <menu-item
              icon="save_alt"
              label="Export Well Data"
              @click="openExportWellDataDialog"
            />
            <menu-item
              icon="save_alt"
              label="Export Sub-Well Data"
              @click="exportPlateSubWellData"
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
      <!-- <menu-item
        v-if="isOpen"
        icon="details"
        label="Open Experiment Details"
        @click="openExperimentDetails"
        v-close-popup
      /> -->
      <menu-item
        v-if="isOpen && route.name == 'workbench'"
        icon="science"
        label="Open Plates"
        @click="openPlates"
        v-close-popup
      />
    </q-list>
  </q-menu>

  <delete-dialog
    v-if="isOpen"
    :id="experiment.id"
    :name="experiment.name"
    :objectClass="'experiment'"
    v-model:show="showDeleteDialog"
    @onDeleted="onDeleted"
  />
  <link-plate-layout-dialog
    v-if="isOpen"
    v-model:show="showLinkPlateDialog"
    :plates="plates"
    @onLinkPlate="handleSetPlateLayout"
  />
  <calculate-plate-dialog
    v-if="isOpen"
    v-model:show="showCalculatePlateDialog"
    :plates="plates"
  />
  <export-plate-list-dialog
    v-model:show="showExportPlateListDialog"
    :experiment="experiment"
  />
  <export-well-data-dialog
    v-model:show="showExportWellDataDialog"
    :experiment="experiment"
  />
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useNotification } from "@/composable/notification";

import { usePanesStore } from "@/stores/panes";
import { useProjectStore } from "@/stores/project";
import { useUIStore } from "@/stores/ui";

import projectsGraphQlAPI from "@/api/graphql/projects";

import DeleteDialog from "@/components/widgets/DeleteDialog";
import LinkPlateLayoutDialog from "@/components/plate/LinkPlateLayoutDialog";
import MenuItem from "@/components/widgets/MenuItem.vue";
import CalculatePlateDialog from "@/components/plate/CalculatePlateDialog";
import ExportPlateListDialog from "@/components/plate/ExportPlateListDialog";
import ExportWellDataDialog from "@/components/plate/ExportWellDataDialog";

const panesStore = usePanesStore();

const props = defineProps(["experiment"]);
const emit = defineEmits(["open"]);
const projectStore = useProjectStore();
const notify = useNotification();

const route = useRoute();
const projectId = parseInt(route.params.id);

const experiment = computed(() => props.experiment);
const isOpen = computed(() =>
  experiment.value && experiment.value.status === "OPEN" ? true : false
);
const showDeleteDialog = ref(false);
const showLinkPlateDialog = ref(false);
const showCalculatePlateDialog = ref(false);
const showExportPlateListDialog = ref(false);
const showExportWellDataDialog = ref(false);

const plates = ref([]);

const openDeleteDialog = () => {
  showDeleteDialog.value = true;
};

const getPlates = () => {
  const { onResult, onError } = projectsGraphQlAPI.experimentById(
    experiment.value.id
  );
  onResult(({ data }) => {
    plates.value = [...data.plates];
  });
  onError((error) => {
    notify.showError("Error while updating plates: " + error.message);
  });
};

const setPlateLayout = () => {
  handleExperimentSelection(() => {
    getPlates();
    showLinkPlateDialog.value = true;
  }, "No experiment is selected!");
};

const openRecalculatePlatesDialog = () => {
  getPlates();
  showCalculatePlateDialog.value = true;
};

const openExportPlateListDialog = () => {
  showExportPlateListDialog.value = true;
};

const openExportWellDataDialog = () => {
  showExportWellDataDialog.value = true;
};

const handleCloseExperiment = () => {
  projectStore.closeExperiment(experiment.value.id);
};

const handleOpenExperiment = () => {
  projectStore.openExperiment(experiment.value.id);
};

const onDeleted = () => {
  projectStore.deleteExperiment(experiment.value.id);
};

const useNotify = useNotification();
const handleSetPlateLayout = () => {
  projectStore.loadProject(projectId);
  useNotify.showInfo(
    "The plate layout has been updated! ",
    () => {
      showCalculatePlateDialog.value = true;
    },
    () => {}
  );
};

const uiStore = useUIStore();
const addExperimentPlateTrendChart = (experimentId) => {
  emit("open", {resource: 'experiment', parentId: experimentId})
};

const exportPlateList = openExportPlateListDialog;
const exportPlateWellData = openExportWellDataDialog;
const exportPlateSubWellData = () =>
  notify.showWarning("Feature is under construction!");

const handleExperimentSelection = (action, onFailureMessage) => {
  if (!uiStore.isExperimentSelected()) {
    // hideMenu.value = true
    notify.showWarning(onFailureMessage);
  } else {
    // hideMenu.value = false
    action();
  }
};

const openPlates = () => {
  emit("open", {resource: 'plates'})
};
</script>
