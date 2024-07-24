<template>
  <generic-table :columns="columns" :rows="wells"
                 selection="multiple"
                 v-model:selected="uiStore.selectedWells"
                 @row-click="selectWell">
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
  </generic-table>
  <WellActionMenu touch-position context-menu @rejectWells="handleRejectWells" @acceptWells="handleAcceptWells"/>
</template>

<style scoped>
</style>

<script setup>
import {ref, computed, watch, reactive} from 'vue'
import WellUtils from "@/lib/WellUtils.js"
import FilterUtils from "@/lib/FilterUtils"
import ColorUtils from "@/lib/ColorUtils";
import FormatUtils from "@/lib/FormatUtils";
import resultDataGraphQlAPI from "@/api/graphql/resultdata"
import {useExportTableData} from "@/composable/exportTableData";
import ColumnFilter from "@/components/table/ColumnFilter";
import WellActionMenu from "@/components/well/WellActionMenu.vue";
import {usePlateStore} from "@/stores/plate"
import {useUIStore} from "@/stores/ui";
import GenericTable from "@/components/table/GenericTable.vue";

const props = defineProps(['plate', 'wells']);
const emits = defineEmits(['wellStatusChanged'])

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
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
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
    concentration: FormatUtils.formatToScientificNotation(well.wellSubstance?.concentration)
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
}, {deep: true})

const exportToCSV = () => {
  exportTableData.exportToCSV(filterMethod(wells.value, filter.value), props.plate.barcode)
}
const exportToXLSX = () => {
  exportTableData.exportToXLSX(filterMethod(wells.value, filter.value), props.plate.barcode)
}

const selectedWell = ref(null)
const isSelected = (row) => uiStore.selectedWells.findIndex(w => w.id === row.id) > -1
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
    plateStore.rejectWells(uiStore.selectedWells, 'REJECTED_PHAEDRA', 'Test well rejection').then(() => {
      emits('wellStatusChanged')
    })
  }
}

const handleAcceptWells = () => {
  if (uiStore.selectedWells.length > 0) {
    plateStore.acceptWells(uiStore.selectedWells).then(() => {
      emits('wellStatusChanged')
    })
  }
}

const updateTable = () => {
  columns.value = [...baseColumns];

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
    columns.value = [...columns.value, ...featureCols.value];

    featureCols.value.forEach(fCol => {
      const featValues = resultData.value.filter(rd => rd.featureId === fCol.featureId)[0]?.values ?? []
      fCol.lut = ColorUtils.createLUT(featValues, ColorUtils.defaultHeatmapGradients)
      wells.value.forEach((row, index) => {
        row[fCol.field] = featValues[index]
      })
    })
  }

  filter = FilterUtils.makeFilter(columns.value);
  visibleColumns.value = [...columns.value.map(a => a.name)];
}
</script>

