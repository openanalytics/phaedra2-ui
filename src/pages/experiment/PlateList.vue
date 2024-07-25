<template>
  <oa-table :columns="columns"
                 :rows="plates"
                 :visible-columns="visibleColumns"
                 @row-click="selectPlate"
                 @row-dblclick="gotoPlateView"
                 @row-contextmenu="plateContextMenu"
                 selection="multiple"
                 v-model:selected="uiStore.selectedPlates">
    <template v-slot:top-left v-if="experimentStore.isOpen">
      <q-btn size="sm" icon="add" label="New Plate" class="oa-button">
        <q-menu>
          <q-list size="sm" dense>
            <q-item clickable v-close-popup v-ripple class="oa-button" @click="openNewPlateDialog">
              <q-item-section no-wrap>
                <div style="vertical-align: center">
                  <q-icon name="add" class="q-pr-md"/>
                  <span style="text-transform: uppercase; font-size: 12px; text-align: right">New Plate</span>
                </div>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup v-ripple class="oa-button" @click="openNewPlateFromMeasurementsDialog">
              <q-item-section no-wrap class="row">
                <div>
                  <q-icon name="add" class="q-pr-md"/>
                  <span style="text-transform: uppercase; font-size: 12px; text-align: right">New Plate(s) from Measurement(s)</span>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
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
    </template>
    <template v-slot:body-cell-link-status="props">
      <q-td :props="props">
        <q-tooltip transition-show="flip-right" transition-hide="flip-left">
          {{ 'Linked with plate template ' + props.row.linkTemplateName }}
        </q-tooltip>
        <StatusFlag :object="props.row" :statusField="'linkStatus'"/>
      </q-td>
    </template>
    <template v-slot:body-cell-status-calculation="props">
      <q-td :props="props">
        <q-tooltip transition-show="flip-right" transition-hide="flip-left">
          {{ 'Calculated on: ' + FormatUtils.formatDate(props.row.calculatedOn) }}
        </q-tooltip>
        <StatusFlag :object="props.row" :statusField="'calculationStatus'"/>
      </q-td>
    </template>
    <template v-slot:body-cell-status-validated="props">
      <q-td :props="props">
        <q-tooltip transition-show="flip-right" transition-hide="flip-left">
          {{ 'Validated on: ' + FormatUtils.formatDate(props.row.validatedOn) }}
        </q-tooltip>
        <StatusFlag :object="props.row" :statusField="'validationStatus'"/>
      </q-td>
    </template>
    <template v-slot:body-cell-status-approved="props">
      <q-td :props="props">
        <q-tooltip transition-show="flip-right" transition-hide="flip-left">
          {{ 'Approved on: ' + FormatUtils.formatDate(props.row.approvedOn) }}
        </q-tooltip>
        <StatusFlag :object="props.row" :statusField="'approvalStatus'"/>
      </q-td>
    </template>
    <template v-slot:body-cell-tags="props">
      <q-td :props="props">
        <tag-list :tags="props.row.tags" :readOnly="true"/>
      </q-td>
    </template>
    <template v-slot:body-cell-createdBy="props">
      <q-td :props="props">
        <UserChip :id="props.row.createdBy"/>
      </q-td>
    </template>
    <template v-slot:no-data>
      <div class="full-width row text-info">
        <span>No plates to show.</span>
      </div>
    </template>
  </oa-table>
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
import {useRouter} from "vue-router";

import UserChip from "@/components/widgets/UserChip";
import ColumnFilter from "@/components/table/ColumnFilter";
import PlateActionMenu from "@/components/plate/PlateActionMenu";
import StatusFlag from "@/components/widgets/StatusFlag";
import TagList from "@/components/tag/TagList";
import FormatUtils from "@/lib/FormatUtils";
import FilterUtils from "@/lib/FilterUtils.js"
import {useExperimentStore} from "@/stores/experiment";
import {useExportTableData} from "@/composable/exportTableData";
import {useUIStore} from "@/stores/ui";
import OaTable from "@/components/table/OaTable.vue";

const props = defineProps(['plates', 'experiment', 'newPlateTab', 'newPlateFromMeasurements'])
const emit = defineEmits(['update:newPlateTab', 'showPlateInspector'])

const router = useRouter()
const uiStore = useUIStore()
const experimentStore = useExperimentStore()

const loading = ref()

const columns = [
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'link-status', align: 'center', label: 'L', field: 'linkStatus'},
  {name: 'status-calculation', align: 'center', label: 'C', field: 'calculationStatus'},
  {name: 'status-validated', align: 'center', label: 'V', field: 'validationStatus'},
  {name: 'status-approved', align: 'center', label: 'A', field: 'approvalStatus'},
  {name: 'dimensions', align: 'left', label: 'Dimensions', field: t => `${t.rows} x ${t.columns}`, sortable: true},
  {name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true},
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true}
]

const plates = computed(() => experimentStore.plates)

const filter = FilterUtils.makeFilter(columns);
const filterMethod = FilterUtils.defaultFilterMethod();

const selectedPlate = ref({});
const showPlateContextMenu = ref(false);

const plateContextMenu = (event, row) => {
  selectedPlate.value = row;
  showPlateContextMenu.value = true;
}

const gotoPlateView = (event, row) => {
  selectedPlate.value = row;
  router.push({name: "plate", params: { plateId: selectedPlate.value.id }});
}

const isSelected = (row) => uiStore.selectedPlates.includes(row)
const updateSelectedPlates = (condition, row) => condition ? uiStore.selectedPlates.filter(plate => plate.id !== row.id) : [row]
const selectPlate = (event, row) => {
  selectedPlate.value = row
  uiStore.loadSelectedPlate(row.id)

  if (event && (event.ctrlKey || event.metaKey)) {
    if (isSelected(row)) {
      uiStore.selectedPlates = updateSelectedPlates(true, row)
    } else {
      uiStore.selectedPlates.push(row)
    }
  } else {
    uiStore.selectedPlates = updateSelectedPlates(isSelected(row), row)
  }
}

const openNewPlateDialog = () => {
  emit('update:newPlateTab', true)
}

const openNewPlateFromMeasurementsDialog = () => {
  emit('update:newPlateFromMeasurements', true)
}

const visibleColumns = ref([])
onMounted(() => {
  visibleColumns.value = [...columns.map(a => a.name)];
  loading.value = false
})

watch(plates, () => {
  visibleColumns.value = [...columns.map(a => a.name)];
  loading.value = false
})

const exportTableData = useExportTableData(columns)

const exportToCSV = () => {
  exportTableData.exportToCSV(filterMethod(plates.value, filter.value), props.experiment.name)
}
const exportToXLSX = () => {
  exportTableData.exportToXLSX(filterMethod(plates.value, filter.value), props.experiment.name)
}
</script>
