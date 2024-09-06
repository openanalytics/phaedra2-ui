<template>
  <q-menu context-menu v-if="project" auto-close>
    <q-list>
      <q-item dense clickable @click="deleteProject">
        <q-item-section avatar>
          <q-icon name="delete" />
        </q-item-section>
        <q-item-section>Delete Project </q-item-section>
      </q-item>
      <!-- v-if="router.currentRoute.name == 'workbench'" -->
      <q-item dense clickable @click="openProjectDetails">
        <q-item-section avatar>
          <q-icon name="details" />
        </q-item-section>
        <q-item-section>Open Project Details</q-item-section>
      </q-item>
      <q-item dense clickable @click="openExperiments">
        <q-item-section avatar>
          <q-icon name="science" />
        </q-item-section>
        <q-item-section>Open Experiments</q-item-section>
      </q-item>
    </q-list>

    <DeleteDialog
      v-model:show="showDeleteDialog"
      :id="project?.id"
      :name="project?.name"
      :objectClass="'project'"
      @onDeleted="handleDeleteProject"
    />
  </q-menu>
</template>

<script setup>
import { ref } from "vue";
import DeleteDialog from "@/components/widgets/DeleteDialog.vue";
import { useProjectStore } from "@/stores/project";
import { usePanesStore } from "@/stores/panes";
import { useExperimentStore } from "@/stores/experiment";

const props = defineProps(["project"]);
const emit = defineEmits(["onDeleteProject"]);

const projectStore = useProjectStore();
const experimentStore = useExperimentStore();
const panesStore = usePanesStore();

const showDeleteDialog = ref(false);

const deleteProject = () => {
  showDeleteDialog.value = true;
};

const handleDeleteProject = () => {
  emit("onDeleteProject");
  showDeleteDialog.value = false;
};

const fetchProjectData = () => {
  experimentStore.reset();
  projectStore.loadProject(props.project.id);
};

const openProjectDetails = () => {
  fetchProjectData();
  panesStore.addItem("project-details-pane", "project-list-pane", "right");
};

const openExperiments = () => {
  // fetchProjectData();
  panesStore.addItem("experiment-list-pane", "project-list-pane", "right");
};
</script>

<style scoped></style>
