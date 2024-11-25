<template>
  <q-breadcrumbs
    class="oa-breadcrumb"
    v-if="experimentStore.experiment && experimentStore.experiment.project"
  >
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard' }" />
    <q-breadcrumbs-el :label="'Projects'" icon="list" :to="'/projects'" />
    <q-breadcrumbs-el
      :label="experimentStore.experiment.project.name"
      icon="folder"
      :to="{
        name: 'project',
        params: { id: experimentStore.experiment.project.id },
      }"
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
      <ExperimentDetails
        v-else
        :experiment="experimentStore.experiment"
        icon="science"
        @updated="handleUpdateExperimentDetails"
      />
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
                @selection="handlePlateSelection"
                @updated="handleUpdatePlateList"
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
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PlateList from "@/components/plate/PlateList";
import PlateStatsList from "@/pages/experiment/PlateStatsList";
import PlateGrid from "@/pages/experiment/PlateGrid";
import OaSection from "@/components/widgets/OaSection";
import ChartViewer from "@/components/chart/ChartViewer";
import { useExperimentStore } from "@/stores/experiment";
import { Pane, Splitpanes } from "splitpanes";
import { useUIStore } from "@/stores/ui";

import ExperimentDetails from "../../components/experiment/ExperimentDetails.vue";
import { useLoadingHandler } from "@/composable/loadingHandler";

const uiStore = useUIStore();
const experimentStore = useExperimentStore();
const route = useRoute();
const router = useRouter();
const loadingHandler = useLoadingHandler();

const activeTab = ref("overview");
const horizontal = ref(false);

const fetchExperiment = async () => {
  const experimentId = parseInt(route.params.experimentId);
  await loadingHandler.handleLoadingDuring(
    experimentStore.loadExperiment(experimentId)
  );
};
fetchExperiment();

const handlePlateSelection = async (plates) => {
  uiStore.selectedPlate = plates[0] ?? null;
  uiStore.selectedPlates = plates;
  if (uiStore.selectedPlate) uiStore.loadSelectedPlate(plates[0].id);
};

const handleOpen = async (id) => {
  switch (id) {
    case "wells-list-pane":
      router.push({
        name: "plate",
        params: { plateId: uiStore.selectedPlate.id },
        query: { activeTab: "wells" },
      });
      break;
    case "scatterplot-chart-pane":
      await loadingHandler.handleLoadingDuring(
        uiStore.loadSelectedPlate(uiStore.selectedPlate.id)
      );
      uiStore.addChartView({
        type: "scatter",
        plateId: uiStore.selectedPlate.id,
        label: "Scatter Plot",
      });
      break;
    case "boxplot-chart-pane":
      await loadingHandler.handleLoadingDuring(
        uiStore.loadSelectedPlate(uiStore.selectedPlate.id)
      );
      uiStore.addChartView({
        type: "box",
        plateId: uiStore.selectedPlate.id,
        label: "Box Plot",
      });
      break;
    case "histogram-chart-pane":
      await loadingHandler.handleLoadingDuring(
        uiStore.loadSelectedPlate(uiStore.selectedPlate.id)
      );
      uiStore.addChartView({
        type: "histogram",
        plateId: uiStore.selectedPlate.id,
        label: "Histogram",
      });
      break;
    case "experiment-chart-pane":
      if (uiStore.isExperimentSelected()) {
        uiStore.addChartView({
          type: "trend",
          experimentId: uiStore.selectedPlate.experimentId,
          label: "Experiment Trend Chart",
        });
      }
      break;
    default:
      break;
  }
};

const handleUpdatePlateList = async () => {
  await loadingHandler.handleLoadingDuring(
    experimentStore.loadExperiment(experimentStore.experiment.id)
  );
};

const handleUpdateExperimentDetails = async () => {
  await loadingHandler.handleLoadingDuring(
    experimentStore.reloadExperiment(experimentStore.experiment.id)
  );
};
</script>
