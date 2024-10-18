<template>
  <q-menu context-menu v-if="projects" persistent>
    <q-list>
      <q-item dense clickable @click="deleteProject">
        <q-item-section avatar>
          <q-icon name="delete" />
        </q-item-section>
        <q-item-section>Delete Project </q-item-section>
      </q-item>
      <q-item dense clickable @click="openAddTagModal(true)">
        <q-item-section avatar>
          <q-icon name="sell" />
        </q-item-section>
        <q-item-section>Add a New Tag </q-item-section>
      </q-item>
      <q-item
        v-show="route.name == 'workbench'"
        dense
        clickable
        @click="openProjectDetails"
      >
        <q-item-section avatar>
          <q-icon name="details" />
        </q-item-section>
        <q-item-section>Open Project Details</q-item-section>
      </q-item>
      <q-item
        v-show="route.name == 'workbench'"
        dense
        clickable
        @click="openExperiments"
      >
        <q-item-section avatar>
          <q-icon name="science" />
        </q-item-section>
        <q-item-section>Open Experiments</q-item-section>
      </q-item>
    </q-list>

    <AddTagModal v-model:show="addTagModal" :projects="projects" />
    <DeleteDialog
      v-model:show="showDeleteDialog"
      :projects="projects"
      objectClass="project"
      @onDeleted="handleDeleteProject"
    />
  </q-menu>
</template>

<script setup>
import { computed, ref } from "vue";
import DeleteDialog from "@/components/widgets/DeleteDialog.vue";
import { useProjectStore } from "@/stores/project";
import { usePanesStore } from "@/stores/panes";
import { useExperimentStore } from "@/stores/experiment";
import { useRoute } from "vue-router";
import AddTagModal from "../tag/AddTagModal.vue";
const props = defineProps(["projects"]);
const emit = defineEmits(["onDeleteProject"]);

const projectStore = useProjectStore();
const experimentStore = useExperimentStore();
const panesStore = usePanesStore();

const route = useRoute();

const showDeleteDialog = ref(false);

const deleteProject = () => {
  showDeleteDialog.value = true;
};

const handleDeleteProject = () => {
  emit("onDeleteProject");
  showDeleteDialog.value = false;
};

const firstProjectCondition = computed(
  () => props.projects && props.projects.length > 0
);

const fetchProjectsData = () => {
  experimentStore.reset();
  if (firstProjectCondition.value) {
    props.projects.forEach((project) => projectStore.loadProject(project.id));
  }
};

const openProjectDetails = () => {
  if (firstProjectCondition.value) {
    fetchProjectsData();
    panesStore.openTab("project-details-pane", "details", "project-list-pane");
  }
};

const openExperiments = () => {
  if (firstProjectCondition.value) {
    panesStore.openTab("experiment-list-pane", "list", "project-list-pane");
  }
};

const addTagModal = ref(false);
function openAddTagModal(val) {
  addTagModal.value = val;
}
</script>

<style scoped></style>
