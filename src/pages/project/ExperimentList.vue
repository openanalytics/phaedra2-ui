<template>
  <oa-section title="Experiments" icon="science">
    <q-table
        class="full-width"
        table-header-class="text-grey"
        :rows="experiments"
        :columns="columns"
        :visible-columns="visibleColumns"
        row-key="id"
        column-key="name"
        :filter="filter"
        :filter-method="filterMethod"
        :pagination="{ rowsPerPage: 10, sortBy: 'name' }"
        :loading="loading"
        @row-click="selectExperiment"
        @row-dblclick="gotoExperimentView"
        @row-contextmenu="experimentContextMenu"
        selection="multiple"
        v-model:selected="uiStore.selectedExperiments"
        separator="cell"
        flat dense square
    >
      <template v-slot:top-left>
        <div class="row action-button on-left">
          <q-btn size="sm" icon="add" class="oa-button" label="New Experiment" @click="showNewExperimentDialog = true"/>
        </div>
      </template>
      <template v-slot:top-right>
        <div class="row action-button">
          <q-btn-dropdown size="sm" class="oa-button q-mr-md" label="Export">
            <q-list dense >
              <q-item clickable v-close-popup @click="exportToCSV">
                <q-item-section>
                  <q-item-label>Export to CSV</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="exportToXLSX">
                <q-item-section>
                  <q-item-label>Export to Excel</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
<!--          <q-btn size="sm" icon="settings" color="primary" @click="showConfigDialog=true">-->
<!--            <q-tooltip>Configure Table Columns</q-tooltip>-->
<!--          </q-btn>-->
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width/>
          <q-th v-for="col in props.cols" :key="col.name" :props="props" auto-width>
            {{col.label}}
            <q-tooltip>
              {{ col.description }}
            </q-tooltip>
          </q-th>
        </q-tr>
        <q-tr :props="props">
          <q-th auto-width>
            <q-checkbox v-model="props.selected" dense />
          </q-th>
          <column-filter v-for="col in props.cols" :key="col.name" v-model="filter[col.name]"/>
        </q-tr>
      </template>
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
            <div class="row items-center cursor-pointer">
              <q-icon name="science" size="xs" class="icon q-pr-sm"/>
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
      <template v-slot:body-cell-nrPlatesLinkedLayout="props">
        <q-td :props="props">
          <ProgressBarField :actualValue="props.row.summary?.nrPlatesLinkedLayout" :maxValue="props.row.summary?.nrPlates" />
        </q-td>
      </template>
      <template v-slot:body-cell-nrPlatesCalculated="props">
        <q-td :props="props">
          <ProgressBarField :actualValue="props.row.summary?.nrPlatesCalculated" :maxValue="props.row.summary?.nrPlates" />
        </q-td>
      </template>
      <template v-slot:body-cell-nrPlatesValidated="props">
        <q-td :props="props">
          <ProgressBarField :actualValue="props.row.summary?.nrPlatesValidated" :maxValue="props.row.summary?.nrPlates" />
        </q-td>
      </template>
      <template v-slot:body-cell-nrPlatesApproved="props">
        <q-td :props="props">
          <ProgressBarField :actualValue="props.row.summary?.nrPlatesApproved" :maxValue="props.row.summary?.nrPlates" />
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div class="row" style="justify-content: center">
            <q-icon name="lock" v-if="props.row.status === 'CLOSED'">
              <template v-slot:default>
                <q-tooltip>CLOSED</q-tooltip>
              </template>
            </q-icon>
            <q-icon name="lock_open" v-if="props.row.status === 'OPEN'">
              <template v-slot:default>
                <q-tooltip>OPEN</q-tooltip>
              </template>
            </q-icon>
          </div>
        </q-td>
      </template>
      <template v-slot:no-data>
        <div class="full-width row text-info">
          <span>No experiments to show.</span>
        </div>
      </template>
    </q-table>

    <ExperimentMenu v-show="showExperimentContextMenu" :experiment="selectedExperiment" touch-position context-menu />
  </oa-section>

  <q-dialog v-model="showNewExperimentDialog">
    <q-card style="min-width: 30vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        Create New Experiment
      </q-card-section>
      <q-card-section>
        <div class="row">
            <div class="col-2 row items-center">
              <q-avatar icon="edit" color="primary" text-color="white" />
            </div>
            <div class="col-10">
              <span>New Experiment Name:</span><br/>
              <q-input dense v-model="newExperimentName" autofocus />
            </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn label="Create" color="primary" v-close-popup @click="doCreateNewExperiment"/>
      </q-card-actions>
    </q-card>
  </q-dialog>

<!--  <TableConfig v-model:show="showConfigDialog" v-model:columns="columns" v-model:visibleColumns="visibleColumns"></TableConfig>-->
</template>

<script setup>
import {ref, computed, watch} from 'vue'

// import TableConfig from "@/components/table/TableConfig";
import ProgressBarField from "@/components/widgets/ProgressBarField";
import UserChip from "@/components/widgets/UserChip";
import ExperimentMenu from "@/components/experiment/ExperimentMenu";
import OaSection from "@/components/widgets/OaSection";
import ColumnFilter from "@/components/table/ColumnFilter";
import TagList from "@/components/tag/TagList";

import FormatUtils from "@/lib/FormatUtils.js"
import FilterUtils from "@/lib/FilterUtils";
import {useExportTableData} from "@/composable/exportTableData";
import {useRouter} from "vue-router";
import {useUIStore} from "@/stores/ui";

const props = defineProps({
  experiments: [Object],
  project: Object
})
const emits = defineEmits(['createNewExperiment'])

const router = useRouter()
const uiStore = useUIStore()

const loading = ref()

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true, description: 'The experiment id'},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true, description: 'The experiment name'},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true, description: 'The experiment description'},
  {name: 'nrPlates', align: 'left', label: 'Plates', field: row => row.summary?.nrPlates ?? 0, sortable: true, description: 'Total nr of plates'},
  {name: 'nrPlatesLinkedLayout', align: 'left', label: 'Linked', field: row => row.summary?.nrPlatesLinkedLayout ?? 0, sortable: true, description: 'Nr of plates with layout'},
  {name: 'nrPlatesCalculated', align: 'left', label: 'Calculated', field: row => row.summary?.nrPlatesCalculated ?? 0, sortable: true, description: 'Nr of calculated plates'},
  {name: 'nrPlatesValidated', align: 'left', label: 'Validated', field: row => row.summary?.nrPlatesValidated ?? 0, sortable: true, description: 'Nr of validated plates'},
  {name: 'nrPlatesApproved', align: 'left', label: 'Approved', field: row => row.summary?.nrPlatesApproved ?? 0, sortable: true, description: 'Nr of approved plates'},
  {name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true, description: 'The experiment tags'},
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate, description: 'Created on date'},
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true, description: 'Created by user'},
  {name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true, description: 'Open or closed'}
])

const experiments = computed( () => props.experiments ? props.experiments : [])

const filter = FilterUtils.makeFilter(columns.value);
const filterMethod = FilterUtils.defaultFilterMethod();

const selectedExperiment = ref({})
const showExperimentContextMenu = ref(false)
const experimentContextMenu = (event, row) => {
  selectExperiment(event, row)
  showExperimentContextMenu.value = true;
}

const gotoExperimentView = (event, row) => {
  selectedExperiment.value = row;
  router.push({name: "experiment", params: { experimentId: row.id }});
}

const isSelected = (row) => uiStore.selectedExperiments.includes(row)
const updateSelectedExperiments = (condition, row) => condition ? uiStore.selectedExperiments.filter(experiment => experiment.id !== row.id) : [row]
const selectExperiment = (event, row) => {
  selectedExperiment.value = row
  if (event && (event.ctrlKey || event.metaKey)) {
    if (isSelected(row)) {
      uiStore.selectedExperiments = updateSelectedExperiments(true, row)
    } else {
      uiStore.selectedExperiments.push(row)
    }
  } else {
    uiStore.selectedExperiments = updateSelectedExperiments(isSelected(row), row)
  }
}

const showNewExperimentDialog = ref(false)
const newExperimentName = ref('')

const doCreateNewExperiment = () => {
  const newExperiment = {
    projectId: props.project.id,
    name: newExperimentName.value,
    status: 'OPEN',
    createdOn: new Date()
  }
  emits('createNewExperiment', newExperiment)
}

const visibleColumns = ref([])
watch(experiments, () => {
  visibleColumns.value = [...columns.value.map(a => a.name)];
  loading.value = false
})

const showConfigDialog = ref(false)

const exportTableData = useExportTableData(columns.value)

const exportToCSV = () => {
  exportTableData.exportToCSV(filterMethod(experiments.value, filter.value), props.project.name)
}

const exportToXLSX = () => {
  exportTableData.exportToXLSX(filterMethod(experiments.value, filter.value), props.project.name)
}
</script>

<style scoped>
.nav-link {
  color: black;
  text-decoration: none;
}
</style>
