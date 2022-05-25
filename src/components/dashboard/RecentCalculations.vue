<template>
  <div class="q-pa-md">
    <oa-section-header :title="'Recent Plate Calculations'" :icon="'calculate'"/>
    <q-table :columns="columns" :rows="calculations" square table-header-class="text-grey">
      <template v-slot:body-cell-protocolId="props">
        <q-td :props="props">
          <router-link :to="'/protocol/' + props.row.protocolId" class="nav-link">
            <div class="row items-center cursor-pointer">
              {{ props.row.protocolId }}
            </div>
          </router-link>
        </q-td>
      </template>
      <template v-slot:body-cell-plateId="props">
        <q-td :props="props">
          <router-link :to="'/plate/' + props.row.plateId" class="nav-link">
            <div class="row items-center cursor-pointer">
              {{ props.row.plateId }}
            </div>
          </router-link>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import {computed} from "vue";
import {useStore} from "vuex";
import FormatUtils from "../../lib/FormatUtils";
import OaSectionHeader from "../widgets/OaSectionHeader";

const store = useStore();

const nrOfCalculations = 10
store.dispatch('resultdata/loadRecentCalculations', nrOfCalculations);
const calculations = computed(() => store.getters['resultdata/getRecentCalculations']())

store.dispatch('protocols/loadByIds', calculations.value.map(p => p.protocolD))
const protocols = computed( () => store.getters['protocols/getAll']())

store.dispatch('plates/loadByIds', calculations.value.map( p => p.plateId))
const plates = computed(() => store.getters['plates/getAllPlates']())

const columns = [
  {name: 'id', label: 'Id', align: 'left', field: 'id'},
  {name: 'protocolId', label: 'Protocol', align: 'left', field: 'protocolId'},
  {name: 'plateId', label: 'Plate', align: 'left', field: 'plateId'},
  {name: 'measId', label: 'Measurement', align: 'left', field: 'measId'},
  {
    name: 'executionStartTimeStamp',
    label: 'Start time',
    align: 'left',
    field: 'executionStartTimeStamp',
    format: FormatUtils.formatDate
  },
  {
    name: 'executionEndTimeStamp',
    label: 'Finish time',
    align: 'left',
    field: 'executionEndTimeStamp',
    format: FormatUtils.formatDate
  },
  {name: 'outcome', label: 'Outcome', align: 'left', field: 'outcome'},
]

// const getProjectName = (projectId) => {
//   const project = this.projects.find(project => {
//     return project.id === projectId
//   })
//   if (project) {
//     return project.name
//   } else return 'NOT_IN_DB'
// }
</script>
