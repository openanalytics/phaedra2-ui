<template>
  <q-menu context-menu v-if="project">
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
          <q-icon name="delete" />
        </q-item-section>
        <q-item-section>Open Project Details</q-item-section>
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
import { useRoute } from "vue-router";

const props = defineProps(["project"]);
const emit = defineEmits(["onDeleteProject"]);

const projectStore = useProjectStore();
const experimentStore = useExperimentStore();
const panesStore = usePanesStore();

const showDeleteDialog = ref(false);
const { route } = useRoute();

const deleteProject = () => {
  showDeleteDialog.value = true;
};

const handleDeleteProject = () => {
  emit("onDeleteProject");
  showDeleteDialog.value = false;
};

const openProjectDetails = () => {
  console.log(route);
  projectStore.loadProject(props.project.id);
  experimentStore.reset();
  panesStore.addItem("project-details-pane", "browse-projects-pane", "right");
  panesStore.addItem("experiment-list-pane", "project-details-pane", "bottom");
};
</script>

<style scoped></style>
