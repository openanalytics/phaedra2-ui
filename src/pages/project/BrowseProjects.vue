<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el label="Projects" icon="list"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
      <oa-section title="Projects" icon="folder" class="q-pa-sm">
        <q-table
            table-header-class="text-grey"
            flat dense
            :rows="projects"
            :columns="columns"
            row-key="id"
            class="full-width"
            :pagination="{ rowsPerPage: 20, sortBy: 'name' }"
            :filter="filter"
            :filter-method="filterMethod"
            @row-click="selectProject"
        >
          <template v-slot:top-left>
            <router-link :to="{ name: 'newProject' }" class="nav-link">
              <q-btn size="sm" icon="add" class="oa-button" label="New Project" />
            </router-link>
          </template>
          <template v-slot:top-right>
            <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
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
      </q-table>
    </oa-section>
  </q-page>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import FilterUtils from "@/lib/FilterUtils.js"
import FormatUtils from "@/lib/FormatUtils.js"
import projectsGraphQlAPI from "@/api/graphql/projects"

import UserChip from "@/components/widgets/UserChip";
import OaSection from "@/components/widgets/OaSection";

const store = useStore();
const router = useRouter();

const loading = ref(true);
const projects = ref([])

onMounted(() => {
  fetchAllProjects()
})

const filter = ref('');
const filterMethod = FilterUtils.defaultTableFilter();

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true},
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
  {name: 'menu', align: 'left', field: 'menu', sortable: false}
]);

const selectProject = (event, row) => {
  router.push("/project/" + row.id);
}

const fetchAllProjects = () => {
  const {onResult, onError} = projectsGraphQlAPI.projects()
  onResult(({data}) => {
    projects.value = data.projects
    loading.value = false
  })
  //TODO: implement onError event!
}

</script>
