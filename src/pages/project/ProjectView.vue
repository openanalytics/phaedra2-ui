<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="projectStore.project">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard' }" />
    <q-breadcrumbs-el :label="'Projects'" icon="list" :to="'/projects'" />
    <q-breadcrumbs-el :label="projectStore.project.name" icon="folder" />
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-sm">
      <oa-section
        v-if="!projectStore.project"
        title="Loading project..."
        icon="folder"
      />
      <ProjectDetails
        v-else
        :project="projectStore.project"
        @updated="projectStore.reloadProject(projectStore.project.id)"
      />
    </div>

    <splitpanes class="default-theme" :horizontal="horizontal">
      <pane
        class="q-pa-sm"
        v-if="projectStore.project"
        style="background-color: #e6e6e6"
      >
        <div class="row oa-section-body">
          <oa-section title="Experiments" icon="science">
            <ExperimentList
              :experiments="projectStore.experiments"
              :projects="[projectStore.project]"
              @createNewExperiment="onCreateNewExperiment"
              @selection="handleSelection"
              @open="handleOpen"
              @updated="projectStore.reloadProject(projectStore.project.id)"
            />
          </oa-section>
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

<style scoped lang="scss">
.action-button {
  margin: 3px;
}
</style>

<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import ExperimentList from "@/components/experiment/ExperimentList.vue";
import OaSection from "@/components/widgets/OaSection";

import { useProjectStore } from "@/stores/project";
import { Pane, Splitpanes } from "splitpanes";
import ChartViewer from "@/components/chart/ChartViewer.vue";
import { useUIStore } from "@/stores/ui";
import { useExperimentStore } from "@/stores/experiment";
import ProjectDetails from "@/components/project/ProjectDetails.vue";

const uiStore = useUIStore();
const projectStore = useProjectStore();
const route = useRoute();

const horizontal = ref(false);

onBeforeMount(() => {
  const experimentStore = useExperimentStore();
  experimentStore.reset();
});

onMounted(() => {
  projectStore.loadProject(route.params.id);
});

const onCreateNewExperiment = async (newExperiment) => {
  await projectStore.addExperiment(newExperiment).then(() => {
    projectStore.reloadProject(newExperiment.projectId);
  });
};

const handleSelection = (experiments) => {
  uiStore.selectedExperiments = experiments;
};

const handleOpen = async (id) => {
  switch (id) {
    case "experiment-chart-pane":
      if (uiStore.isExperimentSelected()) {
        uiStore.addChartView({
          type: "trend",
          experimentId: uiStore.selectedExperiment.id,
          label: "Experiment Trend Chart",
        });
      }
      break;
    default:
      break;
  }
};
</script>
