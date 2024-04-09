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
        @row-contextmenu="selectExperiment"
        @rowDblclick="gotoExperimentView"
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
          <q-th v-for="col in props.cols" :key="col.name" :props="props" auto-width>
            {{col.label}}
          </q-th>
        </q-tr>
        <q-tr :props="props">
          <column-filter v-for="col in props.cols" :key="col.name" v-model="filter[col.name]"/>
        </q-tr>
      </template>
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
            <div class="row items-center cursor-pointer">
              <q-icon name="science" class="icon q-pr-sm"/>
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
      <template v-slot:body-cell-menu="props">
        <q-td :props="props">
          <div class="row items-center cursor-pointer">
            <q-btn flat round icon="more_horiz" size="sm" >
              <ExperimentMenu :experiment="props.row" />
            </q-btn>
          </div>
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


const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'nrPlates', align: 'left', label: 'Plates', field: row => row.summary?.nrPlates ?? 0, sortable: true},
  {name: 'nrPlatesCalculated', align: 'left', label: 'Calculated', field: row => row.summary?.nrPlatesCalculated ?? 0, sortable: true},
  {name: 'nrPlatesValidated', align: 'left', label: 'Validated', field: row => row.summary?.nrPlatesValidated ?? 0, sortable: true},
  {name: 'nrPlatesApproved', align: 'left', label: 'Approved', field: row => row.summary?.nrPlatesApproved ?? 0, sortable: true},
  {name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true},
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
  {name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true},
  {name: 'menu', align: 'left', sortable: false}
])

const props = defineProps({
  experiments: [Object],
  project: Object
})

const selectedExperiment = ref({});
const showExperimentContextMenu = ref(false);
const selectExperiment = (event, row) => {
  selectedExperiment.value = row;
  showExperimentContextMenu.value = true;
}

const emits = defineEmits(['createNewExperiment'])

const loading = ref()
const experiments = computed( () => props.experiments ? props.experiments : [])

const filter = FilterUtils.makeFilter(columns.value);
const filterMethod = FilterUtils.defaultFilterMethod();

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

const router = useRouter()
const gotoExperimentView = (event, row) => {
  router.push({name: "experiment", params: { experimentId: row.id }});
}
</script>

<style scoped>
.nav-link {
  color: black;
  text-decoration: none;
}
</style>
