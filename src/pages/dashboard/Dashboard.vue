<template>
  <q-page class="oa-root-div">
    <RecentProjects :projects="recentProjects"></RecentProjects>
    <div class="q-pa-md">
      <oa-section-header :title="'Recent Experiments'" :icon="'science'"/>
      <q-table :columns="columns" :rows="recentExperiments" square table-header-class="text-grey">
        <template v-slot:body-cell-tags="props">
          <q-td key="tags" :props="props">
            <q-badge class="row" color="green" v-for="tag in props.row.tags" :key="tag.value">
              {{ tag }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <router-link :to="'/experiment/' + props.row.id" class="nav-link">
              <div class="row items-center cursor-pointer">
                <q-icon name="science" class="icon q-pr-sm"/>
                {{ props.row.name }}
              </div>
            </router-link>
          </q-td>
        </template>
        <template v-slot:body-cell-project="props">
          <q-td :props="props">
            <router-link :to="{ name: 'project', params: { id: props.row.projectId } }" class="nav-link">
              {{ getProjectName(props.row.projectId) }}
            </router-link>
          </q-td>
        </template>
        <template v-slot:body-cell-createdBy="props">
          <q-td :props="props">
            <UserChip :id="props.row.createdBy"/>
          </q-td>
        </template>
        <template v-slot:body-cell-nrOfPlates="props">
          <q-td :props="props">
            {{ recentExperimentSummaries.find(sum => sum.experimentId === props.row.id)?.nrPlates.toString() || "-" }}
          </q-td>
        </template>
        <template v-slot:body-cell-nrOfPlatesCalculated="props">
          <q-td :props="props">
            {{ recentExperimentSummaries.find(sum => sum.experimentId === props.row.id)?.nrPlatesCalculated.toString() || "-" }}
          </q-td>
        </template>
        <template v-slot:body-cell-nrOfPlatesValidated="props">
          <q-td :props="props">
            {{ recentExperimentSummaries.find(sum => sum.experimentId === props.row.id)?.nrPlatesValidated.toString() || "-" }}
          </q-td>
        </template>
        <template v-slot:body-cell-nrOfPlatesApproved="props">
          <q-td :props="props">
            {{ recentExperimentSummaries.find(sum => sum.experimentId === props.row.id)?.nrPlatesApproved.toString() || "-" }}
          </q-td>
        </template>
      </q-table>
    </div>
    <RecentCalculations></RecentCalculations>
    <div class="kafka-consumer">
      {{ }}
    </div>
  </q-page>
</template>

<script setup>
import {computed} from "vue";
import {useStore} from "vuex";
import RecentProjects from "@/components/dashboard/RecentProjects";
import RecentCalculations from "../../components/dashboard/RecentCalculations";
import UserChip from "@/components/widgets/UserChip";
import FormatUtils from "@/lib/FormatUtils.js";
import OaSectionHeader from "../../components/widgets/OaSectionHeader";

const store = useStore();
const nrOfExperiments = 10
store.dispatch('projects/loadRecentProjects');
store.dispatch('experiments/loadRecentExperiments', nrOfExperiments);

const recentProjects = computed(() => store.getters['projects/getNRecentProjects'](3));
const recentExperiments = computed(() => store.getters['experiments/getRecentExperiments']());
const recentExperimentSummaries = computed(() => store.getters['experiments/getRecentExperimentSummaries']())
const projects = computed(() => store.getters['projects/getAll']())
const platesInExperiments = computed(() => store.getters['plates/getPlatesInExperiment']())

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
  {name: 'createdOn', label: 'Created On', align: 'left', field: 'createdOn', format: FormatUtils.formatDate},
  {name: 'createdBy', label: 'Created By', align: 'left', field: 'createdBy'},
  {name: 'project', label: 'Project', align: 'left', field: 'projectId'}
]

const getProjectName = (projectId) => {
  const project = projects.value?.find(project => {
    return project.id === projectId
  })
  if (project) {
    return project.name
  } else return 'NOT_IN_DB'
}
</script>

<style>
.layout {
  display: flex;
}

.pane {
  flex: 1;
}
</style>