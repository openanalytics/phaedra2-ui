<template>
  <q-table
           table-header-class="text-grey"
           flat square dense
           :rows="rows"
           :columns="columns"
           row-key="id"
           column-key="name"
           :pagination="{ rowsPerPage: 50 }"
           :filter="filter"
           :filter-method="filterMethod"
           :visible-columns="visibleColumns"
           :loading="loading"
  >
    <template v-slot:top-right>
      <div class="row">
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>
      </div>
    </template>
    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <q-icon v-if="props.row.status === 'ACCEPTED_DEFAULT'" name="check_circle" color="positive"/>
        <q-icon v-else name="cancel" color="negative"/>
      </q-td>
    </template>
    <template v-slot:no-data>
      <div class="full-width row text-info">
        <span>No wells to show.</span>
      </div>
    </template>
  </q-table>
  <table-config v-if="!loading" v-model:show="configdialog" v-model:visibleColumns="visibleColumns"
                v-model:columns="columns"></table-config>
</template>

<script setup>
import {ref, computed, watchEffect} from 'vue'

import WellUtils from "@/lib/WellUtils.js"
import TableConfig from "../../components/table/TableConfig";
import {useStore} from "vuex"
import FilterUtils from "../../lib/FilterUtils";

const props = defineProps({
  plate: Object
})
const store = useStore()

const loading = ref(true);

const columns = ref([
  {
    name: 'coordinate', align: 'left', label: 'Coordinate', field: 'coordinate', sortable: true,
    format: (val, well) => (well ? WellUtils.getWellCoordinate(well.row, well.column) : "")
  },
  {
    name: 'number', align: 'left', label: 'Number', field: 'number', sortable: true,
    format: (val, well) => (well ? WellUtils.getWellNr(well.row, well.column, props.plate.columns) : "")
  },
  {name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true},
  {name: 'wellType', align: 'left', label: 'Well Type', field: 'wellType', sortable: true},
  {
    name: 'substance', align: 'left', label: 'Substance', field: 'substance', sortable: true,
    format: (val, well) => (well.wellSubstance?.name ? well.wellSubstance?.name : "")
  },
  {
    name: 'concentration', align: 'left', label: 'Concentration', field: 'concentration', sortable: true,
    format: (val, well) => (well.wellSubstance?.concentration ? well.wellSubstance?.concentration.toExponential(3) : "")
  },
]);

const configdialog = ref(false)
const visibleColumns = columns.value.map(a => a.name);
const filter = ref('')
const filterMethod = FilterUtils.defaultTableFilter()

const wells = computed(() => store.getters['wells/getWells'](props.plate.id) || []);
watchEffect(() => {
  if (props?.plate?.id && !store.getters['wells/areWellsLoaded'](props.plate.id)) {
    store.dispatch('wells/fetchByPlateId', props.plate.id);
  }
})

// Rows are based on wells but will have additional 'data' columns when resultSet data comes in.
const rows = computed(() => wells.value.map(w => {
  return {...w, data: {}}
}));

const activeMeasurement = store.getters['measurements/getActivePlateMeasurement'](props.plate.id);
store.dispatch('resultdata/loadLatestPlateResult', {
  plateId: props.plate.id,
  measurementId: activeMeasurement?.measurementId
})
const resultSet = computed(() => store.getters['resultdata/getLatestPlateResult'](props.plate.id, activeMeasurement?.measurementId))

// When resultSet becomes available, add new columns to table.
watchEffect(() => {
  if (!resultSet.value || !loading.value) return;
  if (resultSet.value.length == 0) {
    loading.value = false;
    return;
  }

  store.dispatch('features/loadByProtocolId', resultSet.value[0]?.protocolId).then(() => {
    const features = store.getters['features/getByProtocolId'](resultSet.value[0].protocolId);

    resultSet.value.forEach(res => {
      const featureName = features.find(feature => feature.id === res.featureId).name;

      columns.value.push({
        name: featureName,
        align: 'left',
        label: featureName,
        field: row => row.data[featureName],
        sortable: true
      });
      visibleColumns.push(featureName);

      res.values.forEach((val, index) => {
        rows.value[index].data[featureName] = val;
      });
    })

    loading.value = false;
  })
})
</script>
