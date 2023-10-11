<template>
    <q-page class="oa-root-div">
        <div class="q-pa-md">
            <oa-section title="Recent Projects" icon="folder" :collapsible="true">
                <RecentProjects v-if="recentProjects.length > 0" :projects="recentProjects"></RecentProjects>
            </oa-section>
        </div>

        <div class="q-pa-md">
            <oa-section title="Recent Experiments" icon="science" :collapsible="true">
                <div class="q-pa-sm">
                    <q-table :columns="columns" :rows="recentExperiments" flat square dense table-header-class="text-grey">
                        <template v-slot:body-cell-tags="props">
                            <q-td key="tags" :props="props">
                                <q-badge class="row" color="green" v-for="tag in props.row.tags" :key="tag.value">
                                    {{ tag }}
                                </q-badge>
                            </q-td>
                        </template>
                        <template v-slot:body-cell-name="props">
                            <q-td :props="props">
                                <router-link :to="'project/'+ props.row.projectId +'/experiment/' + props.row.id" class="nav-link">
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
            </oa-section>
        </div>

        <div class="q-pa-md">
            <oa-section title="Recent Calculations" icon="calculate" :collapsible="true">
                <RecentCalculations/>
            </oa-section>
        </div>
    </q-page>
</template>

<style>
.layout {
    display: flex;
}

.pane {
    flex: 1;
}
</style>

<script setup>
import {onMounted, ref} from "vue";
import RecentCalculations from "@/components/dashboard/RecentCalculations"
import RecentProjects from "@/components/dashboard/RecentProjects"
import UserChip from "@/components/widgets/UserChip"
import FormatUtils from "@/lib/FormatUtils.js"
import OaSection from "@/components/widgets/OaSection"
import projectsGraphQlAPI from "@/api/graphql/projects"
import experimentsGraphQlAPI from "@/api/graphql/experiments"

const recentProjects = ref([])
const recentExperiments = ref([])
const recentExperimentSummaries = ref([])

onMounted(() => {
  fetchNRecentProject(3)
  fetchNRecentExperiments(10)
  fetchExperimentSummaries()
})

const columns = [
    {name: 'name', label: 'Name', align: 'left', field: 'name'},
    {name: 'tags', label: 'Tags', align: 'left', field: 'tags'},
    {name: 'description', label: 'Description', align: 'left', field: 'description'},
    {name: 'nrOfPlates', label: '#P', align: 'left', field: 'nrOfPlates'},
    {name: 'nrOfPlatesCalculated', label: '#PC', align: 'left', field: 'nrOfPlatesCalculated'},
    {name: 'nrOfPlatesValidated', label: '#PV', align: 'left', field: 'nrOfPlatesValidated'},
    {name: 'nrOfPlatesApproved', label: '#PA', align: 'left', field: 'nrOfPlatesApproved'},
    {name: 'createdOn', label: 'Created On', align: 'left', field: 'createdOn', format: FormatUtils.formatDate},
    {name: 'createdBy', label: 'Created By', align: 'left', field: 'createdBy'},
    {name: 'project', label: 'Project', align: 'left', field: 'projectId'}
]

const fetchNRecentProject = (n) => {
  const {onResult, onError} = projectsGraphQlAPI.nMostRecentlyUpdatedProjects(n)
  onResult(({data}) => recentProjects.value = data.projects)
}

const fetchNRecentExperiments = (n) => {
  const {onResult, onError} = experimentsGraphQlAPI.nMostRecentExperiments(n)
  onResult(({data}) => recentExperiments.value = data.experiments)
}

const fetchExperimentSummaries = () => {
  const {onResult, onError} = experimentsGraphQlAPI.experimentSummaries()
  onResult(({data}) => recentExperimentSummaries.value = data.experimentSummaries)
}

const getProjectName = (projectId) => {
    const project = recentProjects.value?.filter(project => Number.parseInt(project.id) === projectId)[0] ?? null
    if (project) {
        return project.name
    } else
      return 'NOT_IN_DB'
}
</script>
