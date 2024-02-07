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
            separator="cell"
            flat square dense
        >
          <template v-slot:top-left>
            <router-link :to="{ name: 'newProject' }" class="nav-link">
              <q-btn size="sm" icon="add" class="oa-button" label="New Project" />
            </router-link>
          </template>
          <template v-slot:header="props">
            <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :name="col.name" :props="props">
                  {{col.label}}
                </q-th>
            </q-tr>
            <q-tr :props="props">
              <column-filter v-for="col in props.cols" :key="col.name" v-model="filter[col.name]"/>
            </q-tr>
          </template>
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <router-link :to="'/project/' + props.row.id" class="nav-link">
                <div class="row items-center cursor-pointer">
                  {{ props.row.name }}
                </div>
              </router-link>
            </q-td>
          </template>
          <template v-slot:body-cell-tags="props">
            <q-td :props="props">
              <q-badge v-for="tag in props.row.tags" :key="tag" color="green">{{tag}}</q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-createdBy="props">
          <q-td :props="props">
            <UserChip :id="props.row.createdBy" />
          </q-td>
        </template>
          <template v-slot:body-cell-menu="props">
            <q-td :props="props">
              <div class="row items-center cursor-pointer">
                <q-btn flat round icon="more_horiz" size="sm" >
                  <ProjectActionMenu :project="props.row" @onDeleteProject="handleDeleteProject(props.row)"/>
                </q-btn>
              </div>
            </q-td>
          </template>
      </q-table>
    </oa-section>
  </q-page>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import FormatUtils from "@/lib/FormatUtils.js"
import FilterUtils from "@/lib/FilterUtils.js"
import projectsGraphQlAPI from "@/api/graphql/projects"

import UserChip from "@/components/widgets/UserChip";
import OaSection from "@/components/widgets/OaSection";
import ColumnFilter from "@/components/table/ColumnFilter";
import ProjectActionMenu from "@/components/project/ProjectActionMenu";
import projectAPI from "@/api/projects";

const loading = ref(true);
const projects = ref([])

const visibleColumns = ref([])

onMounted(() => {
  fetchAllProjects()
})

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true},
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
  {name: 'menu', align: 'left', field: 'menu', sortable: false}
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

watch(projects, () => {
  visibleColumns.value = [...columns.value.map(a => a.name)];
  loading.value = false;
});

</script>
