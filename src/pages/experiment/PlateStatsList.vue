<template>
  <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10, sortBy: 'barcode' }"
      :filter="filter"
      :filter-method="filterMethod"
      :loading="loading"
      :key="tableKey"
      flat square dense
  >
    <template v-slot:top-right>
      <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
        <template v-slot:append>
          <q-icon name="search"/>
        </template>
      </q-input>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-grey">
          {{ col.label }}<br/>{{ col.label2 }}
        </q-th>
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
    <template v-slot:body-cell="props">
      <q-td :props="props">
        <q-linear-progress rounded size="20px"
                           :value="Number.isNaN(props.row[props.col.name])? 0 : props.row[props.col.name]"
                           color="positive">
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="black" :label="props.row[props.col.name]"/>
          </div>
        </q-linear-progress>
      </q-td>
    </template>
    <template v-slot:no-data>
      <div class="full-width row text-info">
        <span>No plates to show.</span>
      </div>
    </template>
  </q-table>
</template>

<style scoped>
.tag-icon {
  margin-right: 5px;
}

.nav-link {
  color: black;
  text-decoration: none;
}
</style>

<script>
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import FilterUtils from "../../lib/FilterUtils";

export default {
  props: {
    experiment: Object
  },
  setup(props) {
    const store = useStore()
    const loading = ref(true)
    const rows = ref([])
    const tableKey = ref(0)

    const columns = [
      {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true}
    ]

    async function load() {
      const plateResults = {}

      // 1. load plates
      await store.dispatch('plates/loadByExperimentId', props.experiment.id);
      const plates = computed(() => store.getters['plates/getByExperimentId'](props.experiment.id));
      const plateIds = plates.value.map(plate => plate.id)
      
      // 2. load all PlateResults
      const calls = [];
      for (const plateId of plateIds) {
        calls.push(store.dispatch('resultdata/loadLatestPlateResult', { plateId: plateId }));
      }
      await Promise.all(calls);
      for (const plateId of plateIds) {
        const plateResult = store.getters['resultdata/getLatestPlateResult'](plateId);
        plateResults[plateId] = plateResult;
      }

      // 3. Load feature info
      const featureIds = computed(() => store.getters['resultdata/getLatestPlateResultFeatureIds'](plateIds));
      await store.dispatch('features/loadByIds', featureIds.value);
      const features = store.getters['features/getByIds'](featureIds.value);

      const statColumns = {};

      // 4. create a row for each plate
      for (let plate of plates.value) {
        let plateResult = plateResults[plate.id]
        let row = {
          id: plate.id,
          barcode: plate.barcode
        }
        if (plateResult) {
          plateResult.forEach(rs => {
            rs.plateStats.forEach(stat => {
              const key = 'stat-' + rs.featureId + '-' + stat.name;
              statColumns[key] = {
                name: key,
                label: features.find(f => f.id == rs.featureId).name,
                label2: stat.name
              }
              row[key] = stat ? Math.round(stat.value * 100) / 100 : NaN
            })
          })
        }
        rows.value.push(row)
      }

      for (const key in statColumns) {
        columns.push(statColumns[key])
      }
      
      loading.value = false
      tableKey.value++
    }

    load();

    return {
      rows,
      columns,
      tableKey,
      filter: ref(''),
      filterMethod: FilterUtils.defaultTableFilter(),
      loading
    }
  }
}
</script>
