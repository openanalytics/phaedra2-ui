<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="experimentStore.experiment">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard' }" />
    <q-breadcrumbs-el :label="'Projects'" icon="list" :to="'/projects'" />
    <q-breadcrumbs-el
      :label="projectStore.project.name"
      icon="folder"
      :to="{ name: 'project', params: { id: projectStore.project.id } }"
    />
    <q-breadcrumbs-el :label="experimentStore.experiment.name" icon="science" />
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-sm">
      <oa-section
        v-if="!experimentStore.experiment"
        title="Loading experiment..."
        icon="science"
      />
      <oa-section
        v-else
        :title="experimentStore.experiment.name"
        icon="science"
        :collapsible="true"
      >
        <div class="row q-pa-md">
          <div class="col-3">
            <q-field label="ID" stack-label dense borderless>
              <template v-slot:control>
                {{ experimentStore.experiment.id }}
              </template>
            </q-field>
            <q-field label="Description" stack-label dense borderless>
              <template v-slot:control>
                <EditableField
                  :object="experimentStore.experiment"
                  fieldName="description"
                  @valueChanged="onDescriptionChanged"
                  :read-only="experimentStore.isClosed"
                />
              </template>
            </q-field>
            <q-field label="Tags" stack-label dense borderless>
              <template v-slot:control>
                <tag-list
                  :tags="experimentStore.experiment.tags"
                  :read-only="experimentStore.isClosed"
                  @addTag="onAddTag"
                  @removeTag="onRemoveTag"
                  class="q-pt-xs"
                />
              </template>
            </q-field>
          </div>

          <div class="col-3">
            <q-field label="Created On" stack-label dense borderless>
              <template v-slot:control>
                {{
                  FormatUtils.formatDate(experimentStore.experiment.createdOn)
                }}
              </template>
            </q-field>
            <q-field label="Created By" stack-label dense borderless>
              <template v-slot:control>
                <UserChip :id="experimentStore.experiment.createdBy" />
              </template>
            </q-field>
          </div>

          <div class="col-4">
            <PropertyTable
              :objectInfo="experimentStore.experiment"
              :objectClass="'EXPERIMENT'"
              :properties="experimentStore.experiment.properties"
              :read-only="experimentStore.isClosed"
              @addProperty="onAddProperty"
              @removeProperty="onRemoveProperty"
            />
          </div>

          <div class="col-2">
            <div class="row justify-end">
              <q-btn
                v-if="experimentStore.isOpen"
                size="sm"
                icon="lock"
                class="oa-action-button"
                label="Close"
                @click="handleCloseExperiment"
              />
              <q-btn
                v-if="experimentStore.isClosed"
                size="sm"
                icon="lock_open"
                class="oa-action-button"
                label="Open"
                @click="handleOpenExperiment"
              />
            </div>
            <div v-if="experimentStore.isOpen">
              <div class="row justify-end">
                <q-btn
                  size="sm"
                  icon="edit"
                  label="Rename"
                  class="oa-action-button"
                  @click="showRenameDialog = true"
                />
              </div>
              <div class="row justify-end">
                <q-btn
                  size="sm"
                  icon="delete"
                  class="oa-action-button"
                  label="Delete"
                  @click="showDeleteDialog = true"
                />
              </div>
            </div>
          </div>
        </div>
      </oa-section>
    </div>

    <splitpanes class="default-theme" :horizontal="horizontal">
      <pane
        class="q-pa-sm"
        v-if="experimentStore.experiment"
        style="background-color: #e6e6e6"
      >
        <q-tabs
          v-model="activeTab"
          inline-label
          dense
          no-caps
          align="left"
          class="oa-section-title"
        >
          <q-tab name="overview" icon="table_rows" label="Overview" />
          <q-tab name="statistics" icon="functions" label="Statistics" />
          <q-tab name="heatmaps" icon="view_module" label="Heatmaps" />
        </q-tabs>
        <div class="row oa-section-body">
          <q-tab-panels v-model="activeTab" animated class="full-width">
            <q-tab-panel name="overview" class="q-pa-none">
              <PlateList
                :experiments="[experimentStore.experiment]"
                :plates="experimentStore.plates"
                v-model:newPlateTab="showNewPlateDialog"
                v-model:newPlateFromMeasurements="showNewPlateFromMeasDialog"
                @selection="handlePlateSelection"
                @open="handleOpen"
              />
            </q-tab-panel>
            <q-tab-panel name="statistics" class="q-pa-none">
              <PlateStatsList
                :experiment="experimentStore.experiment"
                :plates="experimentStore.plates"
              />
            </q-tab-panel>
            <q-tab-panel name="heatmaps" class="q-pa-none">
              <PlateGrid
                :experiment="experimentStore.experiment"
                :plates="experimentStore.plates"
              />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </pane>
      <pane
        class="q-pa-sm"
        v-if="uiStore.showChartViewer"
        style="background-color: #e6e6e6"
        ref="chartViewerPane"
      >
        <ChartViewer
          :update="Date.now()"
          @changeOrientation="horizontal = !horizontal"
        />
      </pane>
    </splitpanes>

    <div v-if="experimentStore.isOpen">
      <rename-dialog
        v-model:show="showRenameDialog"
        objectClass="experiment"
        :object="experimentStore.experiment"
        @valueChanged="onNameChanged"
      />
      <delete-dialog
        v-model:show="showDeleteDialog"
        :id="experimentStore.experiment?.id"
        :name="experimentStore.experiment?.name"
        :objectClass="'experiment'"
        @onDeleted="onDeleteExperiment"
      />
      <new-plate-dialog v-model:show="showNewPlateDialog" />
      <new-plate-from-measurement-dialog
        v-model:show="showNewPlateFromMeasDialog"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import TagList from "@/components/tag/TagList";
import UserChip from "@/components/widgets/UserChip";
import EditableField from "@/components/widgets/EditableField";
import PropertyTable from "@/components/property/PropertyTable";
import PlateList from "@/components/plate/PlateList";
import PlateStatsList from "@/pages/experiment/PlateStatsList";
import PlateGrid from "@/pages/experiment/PlateGrid";
import DeleteDialog from "@/components/widgets/DeleteDialog";
import RenameDialog from "@/components/widgets/RenameDialog";
import OaSection from "@/components/widgets/OaSection";
import FormatUtils from "@/lib/FormatUtils.js";

import ChartViewer from "@/components/chart/ChartViewer";
import { useExperimentStore } from "@/stores/experiment";
import { useProjectStore } from "@/stores/project";
import { Pane, Splitpanes } from "splitpanes";
import { useUIStore } from "@/stores/ui";
import NewPlateDialog from "@/pages/experiment/NewPlateDialog.vue";
import NewPlateFromMeasurementDialog from "@/pages/experiment/NewPlateFromMeasurementDialog.vue";
import { useLoadingHandler } from "@/composable/loadingHandler";

const uiStore = useUIStore();
const projectStore = useProjectStore();
const experimentStore = useExperimentStore();
const route = useRoute();
const router = useRouter();
const loadingHandler = useLoadingHandler();

const activeTab = ref("overview");
const horizontal = ref(false);

const experimentId = parseInt(route.params.experimentId);
onMounted(() => {
  experimentStore.loadExperiment(experimentId);
});

watchEffect(() => {
  if (experimentStore.isLoaded(experimentId)) {
    const projectId = experimentStore.experiment.projectId;
    if (!projectStore.isLoaded(projectId)) projectStore.loadProject(projectId);
  }
});

const showNewPlateDialog = ref(false);
const showNewPlateFromMeasDialog = ref(false);
const newPlate = ref({
  barcode: null,
  description: null,
  rows: null,
  columns: null,
  sequence: null,
  linkStatus: "NOT_LINKED",
  calculationStatus: "CALCULATION_NEEDED",
  validationStatus: "VALIDATION_NOT_SET",
  approvalStatus: "APPROVAL_NOT_SET",
});

const createNewPlate = () => {
  newPlate.value.sequence = "1";
  newPlate.value.experimentId = experimentId;
  experimentStore.addPlate(newPlate.value);
  newPlateTab.value = false;
};

const showRenameDialog = ref(false);
const onNameChanged = function (newName) {
  experimentStore.renameExperiment(newName);
};

const showDeleteDialog = ref(false);
const onDeleteExperiment = () => {
  experimentStore.deleteExperiment();
  router.push({ name: "project", params: { id: projectStore.project.id } });
};

const onDescriptionChanged = (newDescription) => {
  experimentStore.editExperimentDescription(newDescription);
};

const resizeChartView = (event) => {
  console.log("resize:" + JSON.stringify(event));
};

const handleCloseExperiment = () => {
  experimentStore.closeExperiment();
};

const handleOpenExperiment = () => {
  experimentStore.openExperiment();
};

const onAddTag = async (newTag) => {
  await experimentStore.handleAddTag(newTag);
};

const onRemoveTag = async (tag) => {
  await experimentStore.handleDeleteTag(tag);
};

const onAddProperty = async (newProperty) => {
  await experimentStore.handleAddProperty(newProperty);
};

const onRemoveProperty = async (property) => {
  await experimentStore.handleDeleteProperty(property);
};

const handlePlateSelection = async (plates) => {
  uiStore.selectedPlate = plates[0] ?? null;
  uiStore.selectedPlates = plates;
  if (uiStore.selectedPlate) await uiStore.loadSelectedPlate(plates[0].id);
};

const handleOpen = async (resource) => {
  switch (resource.resource) {
    case 'wells':
      router.push({
        name: "plate",
        params: { plateId: resource.parentId },
        query: { activeTab: "wells" },
      })
      break
    case 'scatterplot':
      await loadingHandler.handleLoadingDuring(
        uiStore.loadSelectedPlate(resource.parentId)
      );
      uiStore.addChartView({
        type: "scatter",
        plateId: resource.parentId,
        label: "Scatter Plot",
      });
      break
    case 'boxplot':
      await loadingHandler.handleLoadingDuring(
        uiStore.loadSelectedPlate(resource.parentId)
      );
      uiStore.addChartView({
        type: "box",
        plateId: resource.parentId,
        label: "Box Plot",
      });
      break
    case 'histogram':
      await loadingHandler.handleLoadingDuring(
        uiStore.loadSelectedPlate(resource.parentId)
      );
      uiStore.addChartView({
        type: "histogram",
        plateId: resource.parentId,
        label: "Histogram",
      });
      break
    case 'experiment':
      if (uiStore.isExperimentSelected()) {
        uiStore.addChartView({
          type: "trend",
          experimentId: resource.parentId,
          label: "Experiment Trend Chart",
        });
      }
      break
    default:
      break
  }
}
</script>
