<template>
  <q-table
      class="full-width"
      table-header-class="text-grey"
      :rows="wells"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="id"
      column-key="name"
      :filter="filter"
      :filter-method="filterMethod"
      :pagination="{ rowsPerPage: plate.columns, sortBy: 'number' }"
      :loading="loading"
      @row-click="selectWell"
      selection="multiple"
      v-model:selected="uiStore.selectedWells"
      separator="cell"
      virtual-scroll
      flat square dense
  >
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
<!--        <q-btn size="sm" flat round color="primary" icon="settings" style="border-radius: 50%;" @click="showConfigDialog=true"/>-->
      </div>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width/>
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{col.label}}
        </q-th>
      </q-tr>
      <q-tr :props="props">
        <q-th auto-width>
          <q-checkbox v-model="props.selected" dense />
        </q-th>
        <column-filter v-for="col in props.cols" :key="col.name" v-model="filter[col.name]"/>
      </q-tr>
    </template>
    <template v-slot:body-cell="props">
      <q-td v-if="props.col.isFeature" :props="props" :style="'background-color:' + props.col.lut.getColor(props.value)">
        <div v-if="props.col.isFeature">{{props.value}}</div>
      </q-td>
      <q-td v-else :props="props">
        {{props.value}}
      </q-td>
    </template>
    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <q-icon v-if="!WellUtils.isRejected(props.row)" name="check_circle" color="positive"/>
        <q-icon v-else name="cancel" color="negative"/>
      </q-td>
    </template>
    <template v-slot:no-data>
      <div class="full-width row text-info">
        <span>No wells to show.</span>
      </div>
    </template>
  </q-table>
<!--  <table-config v-model:show="showConfigDialog" :columns="columns" @update:visibleColumns="updateVisibleColumns"/>-->
  <WellActionMenu touch-position context-menu @rejectWells="handleRejectWells" @acceptWells="handleAcceptWells"/>
</template>

<style scoped>
</style>

<script setup>
import {ref, computed, watch, reactive} from 'vue'
import WellUtils from "@/lib/WellUtils.js"
import FilterUtils from "@/lib/FilterUtils"
import ColumnFilter from "@/components/table/ColumnFilter";
import {usePlateStore} from "@/stores/plate"
import resultDataGraphQlAPI from "@/api/graphql/resultdata"
import ColorUtils from "@/lib/ColorUtils";
import {useExportTableData} from "@/composable/exportTableData";
import WellActionMenu from "@/components/well/WellActionMenu.vue";
import {useUIStore} from "@/stores/ui";

const props = defineProps(['plate', 'wells']);

const plateStore = usePlateStore()
const uiStore = useUIStore()

const loading = ref(true);
const features = ref([])
const resultData = ref([])

const resultSet = plateStore.activeResultSet
features.value = plateStore.featuresByProtocolId(resultSet?.protocolId)

const {onResult, onError} = resultDataGraphQlAPI.resultDataByResultSetId(resultSet?.id)
onResult(({data}) => resultData.value = data.resultData)

const baseColumns = [
  {name: 'id', align: 'left', label: 'Well ID', field: 'id', sortable: true},
  {name: 'coordinate', align: 'left', label: 'Coordinate', field: 'coordinate', sortable: true},
  {name: 'number', align: 'left', label: 'Number', field: 'number', sortable: true},
  {name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true},
  {name: 'wellType', align: 'left', label: 'Well Type', field: 'wellType', sortable: true},
  {name: 'substance', align: 'left', label: 'Substance', field: 'substance', sortable: true},
  {name: 'concentration', align: 'left', label: 'Concentration', field: 'concentration', sortable: true},
]
const columns = ref([])
const wells = computed(() => props.wells.map(well => {
  return {
    id: well.id,
    coordinate: WellUtils.getWellCoordinate(well?.row, well?.column) ?? "",
    number: WellUtils.getWellNr(well?.row, well?.column, props.plate.columns) ?? "",
    status: well.status,
    wellType: well.wellType,
    substance: well.wellSubstance?.name ?? "",
    concentration: well.wellSubstance?.concentration?.toExponential(3) ?? ""
  }
}))

const visibleColumns = ref([])

let filter = FilterUtils.makeFilter(columns.value)
const filterMethod = FilterUtils.defaultFilterMethod();

let exportTableData = null
watch([features, resultData, wells], () => {
  updateTable()
  loading.value = false
  exportTableData = useExportTableData(columns.value)
})

const exportToCSV = () => {
  exportTableData.exportToCSV(filterMethod(wells.value, filter.value), props.plate.barcode)
}
const exportToXLSX = () => {
  exportTableData.exportToXLSX(filterMethod(wells.value, filter.value), props.plate.barcode)
}

const selectedWell = ref(null)
const isSelected = (row) => uiStore.selectedWells.includes(row)
const updateSelectedWells = (condition, row) => condition ? uiStore.selectedWells.filter(well => well.id !== row.id) : [row]
const selectWell = (event, row) => {
  selectedWell.value = row

  if (event && (event.ctrlKey || event.metaKey)) {
    if (isSelected(row)) {
      uiStore.selectedWells = updateSelectedWells(true, row)
    } else {
      uiStore.selectedWells.push(row)
    }
  } else {
    uiStore.selectedWells = updateSelectedWells(isSelected(row), row)
  }
}

const handleRejectWells = () => {
  if (uiStore.selectedWells.length > 0) {
    plateStore.rejectWells(uiStore.selectedWells, 'REJECTED_PHAEDRA', 'Test well rejection')
  }
}

const handleAcceptWells = () => {
  if (uiStore.selectedWells.length > 0) {
    plateStore.acceptWells(uiStore.selectedWells)
  }
}

const updateTable = () => {
  if (features.value && resultData.value) {
    const featureCols = computed(() => (features.value ?? []).map(f => {
      return {
        name: f.name,
        align: 'left',
        label: f.name,
        field: f.name,
        sortable: true,
        'featureId': f.id,
        isFeature: true,
        lut: null
      }
    }))
    columns.value = [...baseColumns, ...featureCols.value]
    filter = FilterUtils.makeFilter(columns.value)

    featureCols.value.forEach(fCol => {
      const featValues = resultData.value.filter(rd => rd.featureId === fCol.featureId)[0]?.values ?? []
      fCol.lut = ColorUtils.createLUT(featValues, ColorUtils.defaultHeatmapGradients)
      wells.value.forEach((row, index) => {
        row[fCol.field] = featValues[index]
      })
    })
  }
  visibleColumns.value = [...columns.value.map(a => a.name)];
}
</script>

