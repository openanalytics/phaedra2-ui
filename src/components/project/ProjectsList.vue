<template>
  <oa-table
    :columns="columns"
    :rows="projects"
    @row-dblclick="gotoProjectView"
    @row-click="selectProject"
    selection="multiple"
    v-model:selected="selectedProjects"
  >
    <template v-slot:top-left>
      <router-link :to="{ name: 'newProject' }" class="nav-link">
        <q-btn size="sm" icon="add" class="oa-button" label="New Project" />
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
  <ProjectActionMenu :project="selectedProjects[0]" />
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import FormatUtils from "@/lib/FormatUtils.js";
import projectsGraphQlAPI from "@/api/graphql/projects";

import OaTable from "@/components/table/OaTable.vue";
import ProjectActionMenu from "@/components/project/ProjectActionMenu";
import { useRouter } from "vue-router";
import { useSelectionStore } from "@/stores/selection";

const loading = ref(true);
const projects = ref([]);

const visibleColumns = ref([]);
const selectedProjects = ref([]);
const selectionStore = useSelectionStore();

onMounted(() => {
  fetchAllProjects();
});

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

const fetchAllProjects = () => {
  const { onResult, onError } = projectsGraphQlAPI.projects();
  onResult(({ data }) => {
    projects.value = data.projects;
    loading.value = false;
  });
  //TODO: implement onError event!
};

const router = useRouter();
const gotoProjectView = (event, row) => {
  router.push({ name: "project", params: { id: row.id } });
};

function selectProject(event, row) {
  selectedProjects.value = [row];
}

watch(projects, () => {
  visibleColumns.value = [...columns.value.map((a) => a.name)];
  loading.value = false;
});

watch(selectedProjects, (newVal, oldVal) => {
  const projectsId = newVal.map((item) => item.id);
  selectionStore.loadProjects(projectsId);
});
</script>
