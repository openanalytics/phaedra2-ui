<template>
  <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
      :filter="filter"
      :filter-method="filterMethod"
      :loading="loading"
      :key="tableKey"
      flat square
  >
    <template v-slot:top-right>
      <q-input outlined rounded dense debounce="300" v-model="filter" placeholder="Search">
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

const filterMethod = function (rows, term) {
  return rows.filter(row => {
    return (row.id == term
        || row.barcode.toLowerCase().includes(term)
        || row.description.toLowerCase().includes(term)
        || (row.tags && row.tags.some(tag => tag.toLowerCase().includes(term))))
  })
}

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

    let getZPrimeValue = function (resultData) {
      if (resultData.resultFeatureStats == null) {
        // calculation still in progress? TODO only show success
        return NaN
      }
      let stat = resultData.resultFeatureStats.find(it => it.statisticName === "zprime");
      if (!stat) {
        return NaN
      }
      return Math.round(stat.value * 100) / 100
    }

    async function load() {
      const plateResults = {}

      // 1. load plates
      await store.dispatch('plates/loadByExperimentId', props.experiment.id);
      const plates = computed(() => store.getters['plates/getByExperimentId'](props.experiment.id));
      const plateIds = plates.value.map(plate => plate.id)

      // 2. load all PlateResults
      // const reqs = [];
      for (const plateId of plateIds) {
        store.dispatch('resultdata/loadLatestPlateResult', {plateId});
        const plateResult = store.getters['resultdata/getLatestPlateResult'](plateId);
        plateResults[plateId] = plateResult;
      }
      //   const plateResult = computed(() => store.getters['resultdata/getLatestPlateResult'](plateId))
      //   plateResults[plateId] = plateResult.value;
      //   for (const protocol of Object.values((plateResult?.value.protocols))) {
      //     // note: we assume that only one measurement is loaded for each plate
      //     if (Object.values(protocol.measurements).length === 0) {
      //       continue
      //     }
      //     // get first measurement and first resultSet (only the latest ResultSet is returned)
      //     const measurement = Object.values(protocol.measurements)[0][0];
      //     for (let resultData of measurement.resultData) {
      //       featureIds.add(resultData.featureId);
      //     }
      //   }
      // }
      const featureIds = computed(() => store.getters['resultdata/getLatestPlateResultFeatureIds'](plateIds));
      // 3. wait for all PlateResults to be loaded
      // await Promise.all(reqs);

      // 4. create a column for each feature
      await store.dispatch('features/loadByIds', featureIds.value);
      const features = store.getters['features/getByIds'](featureIds.value);
      for (const feature of features) {
        columns.push({
          name: 'feature' + feature.id,
          label: feature.name,
          label2: 'Z-Prime'
        });
      }

      // 5. create a row for each plate
      for (let plate of plates.value) {
        let plateResult = plateResults[plate.id]
        let row = {
          id: plate.id,
          barcode: plate.barcode
        }

        for (let protocol of Object.values(plateResult.protocols)) {
          // note: we assume that only one measurement is loaded for each plate
          const measurement = Object.values(protocol.measurements)[0][0];
          for (let resultData of measurement.resultData) {
            row['feature' + resultData.featureId] = getZPrimeValue(resultData)
          }
        }
        rows.value.push(row)
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
      filterMethod,
      loading
    }
  }
}
</script>
