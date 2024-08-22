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
      <oa-section
        v-else
        :title="projectStore.project.name"
        icon="folder"
        :collapsible="true"
      >
        <ProjectDetails />
      </oa-section>
    </div>

    <splitpanes class="default-theme" :horizontal="horizontal">
      <pane
        class="q-pa-sm"
        v-if="projectStore.project"
        style="background-color: #e6e6e6"
      >
        <div class="row oa-section-body">
          <ExperimentList
            :experiments="projectStore.experiments"
            :project="projectStore.project"
            @createNewExperiment="onCreateNewExperiment"
          />
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
import { onBeforeMount, ref } from "vue";

import ExperimentList from "@/pages/project/ExperimentList.vue";
import OaSection from "@/components/widgets/OaSection";

import { useProjectStore } from "@/stores/project";
import { Pane, Splitpanes } from "splitpanes";
import ChartViewer from "@/components/chart/ChartViewer.vue";
import { useUIStore } from "@/stores/ui";
import { useExperimentStore } from "@/stores/experiment";
import ProjectDetails from "@/components/project/ProjectDetails.vue";

const uiStore = useUIStore();
const projectStore = useProjectStore();

const horizontal = ref(false);

onBeforeMount(() => {
  const experimentStore = useExperimentStore();
  experimentStore.reset();
});

const onCreateNewExperiment = async (newExperiment) => {
  await projectStore.addExperiment(newExperiment);
};
</script>
