<template>
  <q-page class="oa-root-div">
    <RecentProjects :projects="recentProjects"></RecentProjects>
    <div class="q-pa-md">
      <div class="q-px-sm oa-section-title">
        <div class="text-h6">Recent Experiments</div>
      </div>
      <q-table :columns="columns" :rows="recentExperiments">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="tags" :props="props">
              <q-badge class="row" color="green" v-for="tag in props.row.tags" :key="tag.value">
                {{ tag }}
              </q-badge>
            </q-td>
            <q-td key="description" :props="props">
              {{ props.row.description }}
            </q-td>
            <q-td key="nrOfPlates" :props="props">
              {{ props.row.nrOfPlates }}
            </q-td>
            <q-td key="nrOfPlatesCalculated" :props="props">
              {{ props.row.nrOfPlatesCalculated }}
            </q-td>
            <q-td key="nrOfPlatesValidated" :props="props">
              {{ props.row.nrOfPlatesValidated }}
            </q-td>
            <q-td key="nrOfPlatesApproved" :props="props">
              {{ props.row.nrOfPlatesApproved }}
            </q-td>
            <q-td key="drc" :props="props">
              {{ props.row.drc }}
            </q-td>
            <q-td key="sdp" :props="props">
              {{ props.row.sdp }}
            </q-td>
            <q-td key="createdOn" :props="props">
              {{ props.row.createdOn }}
            </q-td>
            <q-td key="createdBy" :props="props">
              {{ props.row.createdBy }}
            </q-td>
            <q-td key="project" :props="props">
              {{ props.row.project }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
const columns = [
  {name: 'name', label: 'Name', align: 'left', field: 'name'},
  {name: 'tags', label: 'Tags', align: 'left', field: 'tags'},
  {name: 'description', label: 'Description', align: 'left', field: 'description'},
  {name: 'nrOfPlates', label: '#P', align: 'left', field: 'nrOfPlates'},
  {name: 'nrOfPlatesCalculated', label: '#PC', align: 'left', field: 'nrOfPlatesCalculated'},
  {name: 'nrOfPlatesValidated', label: '#PV', align: 'left', field: 'nrOfPlatesValidated'},
  {name: 'nrOfPlatesApproved', label: '#PA', align: 'left', field: 'nrOfPlatesApproved'},
  {name: 'drc', label: '#DRC', align: 'left', field: 'drc'},
  {name: 'sdp', label: '#SDP', align: 'left', field: 'sdp'},
  {name: 'createdOn', label: 'Created On', align: 'left', field: 'createdOn'},
  {name: 'createdBy', label: 'Created By', align: 'left', field: 'createdBy'},
  {name: 'project', label: 'Project', align: 'left', field: 'project'}
]

import RecentProjects from "@/pages/dashboard/RecentProjects";
import {useStore} from "vuex";
import {computed} from "vue";

export default {
  name: 'Dashboard',
  components: {
    RecentProjects
  },
  setup() {
    const store = useStore();
    store.dispatch('projects/loadRecentProjects');
    store.dispatch('experiments/loadRecentExperiments');

    const recentProjects = computed(() => store.getters['projects/getNRecentProjects'](3));
    const recentExperiments = computed(() => store.getters['experiments/getRecentExperiments']());

    return {
      recentProjects,
      columns,
      recentExperiments
    }
  }
}
</script>

<style lang="scss">
@import 'src/css/oa.global';
</style>
