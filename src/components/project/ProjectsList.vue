<template>
  <oa-table
    :columns="columns"
    :rows="projects"
    @row-dblclick="gotoProjectView"
    @row-click="selectProject"
    selection="multiple"
    v-model:selected="selectedProjects"
    @update:selected="(newVal) => emits('selected', newVal)"
  >
    <template v-slot:top-right>
      <router-link :to="{ name: 'newProject' }" class="nav-link">
        <q-btn
          round
          size="sm"
          color="primary"
          icon="add"
          @click="showNewExperimentDialog = true"
          ><q-tooltip>Create New Project</q-tooltip></q-btn
        >
      </router-link>
    </template>
    <template v-slot:body-cell-name="props">
      <q-td :props="props">
        <div class="row items-center cursor-pointer">
          {{ props.row.name }}
        </div>
      </q-td>
    </template>
  </oa-table>
  <ProjectActionMenu
    :projects="selectedProjects"
    @open="open"
    @onDeleteProject="deleteProjects"
    @addTag="doAddTag"
  />
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";
import FormatUtils from "@/lib/FormatUtils.js";

import OaTable from "@/components/table/OaTable.vue";
import ProjectActionMenu from "@/components/project/ProjectActionMenu";
import { useRoute, useRouter } from "vue-router";
import { useProjectStore } from "@/stores/project";
import { useLoadingHandler } from "@/composable/loadingHandler";

const props = defineProps({
  projects: [Object],
  selected: [Object],
});
const emits = defineEmits(["selection", "updated", "open"]);

const loading = ref(true);

const visibleColumns = ref([]);
const selectedProjects = ref([]);

const columns = ref([
  { name: "id", align: "left", label: "ID", field: "id", sortable: true },
  { name: "name", align: "left", label: "Name", field: "name", sortable: true },
  {
    name: "description",
    align: "left",
    label: "Description",
    field: "description",
    sortable: true,
  },
  { name: "tags", align: "left", label: "Tags", field: "tags", sortable: true },
  {
    name: "createdOn",
    align: "left",
    label: "Created On",
    field: "createdOn",
    sortable: true,
    format: FormatUtils.formatDate,
  },
  {
    name: "createdBy",
    align: "left",
    label: "Created By",
    field: "createdBy",
    sortable: true,
  },
]);

const router = useRouter();
const route = useRoute();
const gotoProjectView = (event, row) => {
  if (router.currentRoute.value.name != "workbench") {
    router.push({ name: "project", params: { id: row.id } });
  }
};

function selectProject(event, row) {
  selectedProjects.value = [row];
}

const projectStore = useProjectStore();
const loadingHandler = useLoadingHandler();

async function deleteProjects() {
  await loadingHandler.handleLoadingDuring(
    projectStore
      .deleteProjects(selectedProjects.value.map((project) => project.id))
      .then(() => {
        emits("updated");
        selectedProjects.value = [];
      })
  );
}

watch(props.projects, () => {
  visibleColumns.value = [...columns.value.map((a) => a.name)];
  loading.value = false;
});

watch(selectedProjects, (newVal, oldVal) => {
  emits("selection", newVal);
});

onBeforeMount(() => {
  if (route.name == "workbench") {
    selectedProjects.value = props.selected;
  }
});

const open = (resource) => {
  emits("open", resource);
};
</script>
