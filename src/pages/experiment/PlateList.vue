<template>
  <q-table
      class="full-width"
      table-header-class="text-grey"
      :rows="plates"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="id"
      column-key="name"
      :filter="filter"
      :filter-method="filterMethod"
      :pagination="{ rowsPerPage: 10, sortBy: 'barcode' }"
      :loading="loading"
      @row-contextmenu="selectPlate"
      separator="cell"
      virtual-scroll
      style="max-height: 600px"
      flat square dense
  >
    <template v-slot:top-left>
        <q-btn size="sm" icon="add" label="New Plate" @click="openNewPlateTab" class="oa-button"/>
    </template>
    <template v-slot:top-right>
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
<!--      <div class="row">-->
<!--        <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>-->
<!--      </div>-->
    </template>
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{col.label}}
        </q-th>
      </q-tr>
      <q-tr :props="props">
        <column-filter v-for="col in props.cols" :key="col.name" v-model="filter[col.name]"/>
      </q-tr>
    </template>
    <template v-slot:body-cell-barcode="props">
      <q-td :props="props">
        <router-link :to="'/plate/' + props.row.id" class="nav-link">
          <div class="row items-center cursor-pointer">
            <q-icon name="view_module" class="icon q-pr-sm"/>
            {{ props.row.barcode }}
          </div>
        </router-link>
      </q-td>
    </template>
    <template v-slot:body-cell-link-status="props">
      <q-td :props="props">
        <q-tooltip transition-show="flip-right" transition-hide="flip-left">
          {{'Linked with: ' + props.row.linkSource}}
        </q-tooltip>
        <StatusFlag :object="props.row" :statusField="'linkStatus'" />
      </q-td>
    </template>
    <template v-slot:body-cell-status-calculation="props">
      <q-td :props="props">
        <q-tooltip transition-show="flip-right" transition-hide="flip-left">
          {{'Calculated on: ' + FormatUtils.formatDate(props.row.calculatedOn)}}
        </q-tooltip>
        <StatusFlag :object="props.row" :statusField="'calculationStatus'" />
      </q-td>
    </template>
    <template v-slot:body-cell-status-validated="props">
      <q-td :props="props">
        <StatusFlag :object="props.row" :statusField="'validationStatus'" />
      </q-td>
    </template>
    <template v-slot:body-cell-status-approved="props">
      <q-td :props="props">
        <StatusFlag :object="props.row" :statusField="'approvalStatus'" />
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
    <template v-slot:body-cell-menu="props">
      <q-td :props="props">
        <div class="row items-center cursor-pointer">
          <q-btn flat round icon="more_horiz" size="sm" >
            <PlateActionMenu :plate="props.row" @showPlateInspector="openPlateInspector(props.row)" />
          </q-btn>
        </div>
      </q-td>
    </template>
    <template v-slot:no-data>
      <div class="full-width row text-info">
        <span>No plates to show.</span>
      </div>
    </template>
  </q-table>

<!--  <TableConfig v-model:show="configdialog" v-model:visibleColumns="visibleColumns" v-model:columns="columns"/>-->
  <PlateActionMenu v-show="showPlateContextMenu" :plate="selectedPlate" touch-position context-menu />
</template>

<style scoped>
.nav-link {
  color: black;
  text-decoration: none;
}
</style>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";

import UserChip from "@/components/widgets/UserChip";
// import TableConfig from "@/components/table/TableConfig";
import ColumnFilter from "@/components/table/ColumnFilter";
import PlateActionMenu from "@/components/plate/PlateActionMenu";
import StatusFlag from "@/components/widgets/StatusFlag";
import TagList from "@/components/tag/TagList";
import FormatUtils from "@/lib/FormatUtils";
import FilterUtils from "@/lib/FilterUtils.js"
import {useExperimentStore} from "@/stores/experiment";
import {useExportTableData} from "@/composable/exportTableData";

const props = defineProps(['plates', 'experiment', 'newPlateTab'])
const emit = defineEmits(['update:newPlateTab', 'showPlateInspector'])

const route = useRoute()
const experimentStore = useExperimentStore()

const loading = ref()
const plates = computed( () => experimentStore.plates)

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'link-status', align: 'center', label: 'L', field: 'linkStatus'},
  {name: 'status-calculation', align: 'center', label: 'C', field: 'calculationStatus'},
  {name: 'status-validated', align: 'center', label: 'V', field: 'validationStatus'},
  {name: 'status-approved', align: 'center', label: 'A', field: 'approvalStatus'},
  {name: 'dimensions', align: 'left', label: 'Dimensions', field: row => row.rows + " x " + row.columns, sortable: true},
  {name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true},
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
  {name: 'menu', align: 'left', sortable: false}
])

const filter = FilterUtils.makeFilter(columns.value);
const filterMethod = FilterUtils.defaultFilterMethod();

const selectedPlate = ref({});
const showPlateContextMenu = ref(false);
const selectPlate = (event, row) => {
  selectedPlate.value = row;
  showPlateContextMenu.value = true;
}

const configdialog = ref(false)
const showConfigDialog = ref(false)

const openNewPlateTab = () => {
  emit('update:newPlateTab', true)
}

const openPlateInspector = (plate) => {
  emit('showPlateInspector', plate)
}

const visibleColumns = ref([])
onMounted(() => {
  visibleColumns.value = [...columns.value.map(a => a.name)];
  loading.value = false
})

watch(plates, () => {
  visibleColumns.value = [...columns.value.map(a => a.name)];
  loading.value = false
})

const exportTableData = useExportTableData(columns.value)

const exportToCSV = () => {
  exportTableData.exportToCSV(filterMethod(plates.value, filter.value), props.experiment.name)
}
const exportToXLSX = () => {
  exportTableData.exportToXLSX(filterMethod(plates.value, filter.value), props.experiment.name)
}
</script>
