<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el label="Projects" icon="list"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
      <oa-section title="Projects" icon="folder" class="q-pa-sm">
        <generic-table
            :columns="columns"
            :rows="projects"
            @row-dblclick="gotoProjectView"
            @row-click="(e, row) => selectedProjects = [row]"
            selection="multiple"
            v-model:selected="selectedProjects">
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
        </generic-table>
      <ProjectActionMenu :project="selectedProjects[0]" />
    </oa-section>
  </q-page>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import FormatUtils from "@/lib/FormatUtils.js"
import projectsGraphQlAPI from "@/api/graphql/projects"

import UserChip from "@/components/widgets/UserChip";
import TagList from "@/components/tag/TagList";
import OaSection from "@/components/widgets/OaSection";
import ProjectActionMenu from "@/components/project/ProjectActionMenu";
import projectAPI from "@/api/projects";
import {useRouter} from "vue-router";
import GenericTable from "@/components/table/GenericTable.vue";

const loading = ref(true);
const projects = ref([])

const visibleColumns = ref([])
const selectedProjects = ref([])

onMounted(() => {
  fetchAllProjects()
})

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true},
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true}
]);

const fetchAllProjects = () => {
  const {onResult, onError} = projectsGraphQlAPI.projects()
  onResult(({data}) => {
    projects.value = data.projects
    loading.value = false
  })
  //TODO: implement onError event!
}

const handleDeleteProject = async (project) => {
    await projectAPI.deleteProject(project.id)
    fetchAllProjects()
}

const router = useRouter()
const gotoProjectView = (event, row) => {
  router.push({name: "project", params: { id: row.id }});
}

watch(projects, () => {
  visibleColumns.value = [...columns.value.map(a => a.name)];
  loading.value = false;
});

</script>
