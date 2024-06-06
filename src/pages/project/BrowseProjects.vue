<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el label="Projects" icon="list"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
      <oa-section title="Projects" icon="folder" class="q-pa-sm">
        <q-table
            table-header-class="text-grey"
            :pagination="{ rowsPerPage: 20, sortBy: 'name' }"
            :rows="projects"
            :columns="columns"
            row-key="id"
            column-key="name"
            :filter="filter"
            :filter-method="filterMethod"
            :visible-columns=visibleColumns
            :loading="loading"
            @row-dblclick="gotoProjectView"
            @row-click="(e, row) => selectedProjects = [row]"
            separator="cell"
            selection="multiple"
            v-model:selected="selectedProjects"
            flat square dense
        >
          <template v-slot:top-left>
            <router-link :to="{ name: 'newProject' }" class="nav-link">
              <q-btn size="sm" icon="add" class="oa-button" label="New Project" />
            </router-link>
          </template>
          <template v-slot:header="props">
            <q-tr :props="props">
                <q-th auto-width/>
                <q-th v-for="col in props.cols" :key="col.name" :name="col.name" :props="props" auto-width>
                  {{col.label}}
                </q-th>
            </q-tr>
            <q-tr :props="props">
              <q-th auto-width/>
              <column-filter v-for="col in props.cols" :key="col.name" v-model="filter[col.name]"/>
            </q-tr>
          </template>
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
                <div class="row items-center cursor-pointer">
                  {{ props.row.name }}
                </div>
            </q-td>
          </template>
          <template v-slot:body-cell-tags="props">
            <q-td :props="props">
              <tag-list :tags="props.row.tags" :readOnly="true" />
          </q-td>
        </template>
        <template v-slot:body-cell-createdBy="props">
          <q-td :props="props">
            <UserChip :id="props.row.createdBy" />
          </q-td>
        </template>
      </q-table>
      <ProjectActionMenu :project="selectedProjects[0]" />
    </oa-section>
  </q-page>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import FormatUtils from "@/lib/FormatUtils.js"
import FilterUtils from "@/lib/FilterUtils.js"
import projectsGraphQlAPI from "@/api/graphql/projects"

import UserChip from "@/components/widgets/UserChip";
import TagList from "@/components/tag/TagList";
import OaSection from "@/components/widgets/OaSection";
import ColumnFilter from "@/components/table/ColumnFilter";
import ProjectActionMenu from "@/components/project/ProjectActionMenu";
import projectAPI from "@/api/projects";
import {useRouter} from "vue-router";

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

const filter = FilterUtils.makeFilter(columns.value);
const filterMethod = FilterUtils.defaultFilterMethod();

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
