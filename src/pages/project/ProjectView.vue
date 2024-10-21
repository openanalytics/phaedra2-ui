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
        <ProjectDetails :project="projectStore.project" />
      </oa-section>
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
    <rename-dialog
      v-model:show="showRenameDialog"
      objectClass="project"
      :object="projectStore.project"
      @valueChanged="onNameChanged"
    />
    <delete-dialog
      v-model:show="showDeleteDialog"
      :id="projectStore.project?.id"
      :name="projectStore.project?.name"
      :objectClass="'project'"
      @onDeleted="onDeleted"
    />
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
  await projectStore.addExperiment(newExperiment);
};

const onDeleted = async () => {
  await projectStore.deleteProject();
  await router.push({ name: "browseProjects" });
};

const onAddAccess = async (newAccess) => {
  await projectStore.createProjectAccess(newAccess);
};

const onRemoveAccess = async (access) => {
  await projectStore.deleteProjectAccess(access);
};

const onAddTag = async (newTag) => {
  await projectStore.handleAddTag(newTag);
};

const onRemoveTag = async (tag) => {
  await projectStore.handleDeleteTag(tag);
};

const onAddProperty = async (newProperty) => {
  await projectStore.handleAddProperty(newProperty);
};

const onRemoveProperty = async (property) => {
  await projectStore.handleDeleteProperty(property);
};

const openDeleteDialog = () => {
  showDeleteDialog.value = true;
};

const handleSelection = (experiments) => {
  uiStore.selectedExperiments = experiments;
};

const handleOpen = async (resource) => {
  switch (resource.resource) {
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