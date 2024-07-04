<template>
  <q-table
      :rows="plateStatRows"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10, sortBy: 'barcode' }"
      :filter="filter"
      :filter-method="filterMethod"
      :loading="loading"
      dense flat square>
    <template v-slot:top-right>
      <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
        <template v-slot:append>
          <q-icon name="search"/>
        </template>
      </q-input>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th style="text-align: left" class="text-grey">Barcode</q-th>
        <q-th colspan="7" v-for="feature in features" :key="feature.id" class="text-grey" style="text-align: left">
          {{ feature.name }}
        </q-th>
      </q-tr>
      <q-tr :props="props">
        <q-th/>
        <q-th v-for="col in props.cols.filter(c => c.type === 'stat')" :key="col.name" class="text-grey" style="text-align: left">
          {{ col.label }}
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
        <div v-if="props.col.name.endsWith('-zprime')">
          <q-linear-progress rounded size="20px"
                             :value="Number.isNaN(props.row[props.col.name])? 0 : props.row[props.col.name]"
                             color="positive">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="black" :label="props.row[props.col.name]"/>
            </div>
          </q-linear-progress>
        </div>
        <div v-else>
          {{ props.row[props.col.name] }}
        </div>
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

<script setup>
    import {computed, ref, watch} from 'vue'
    import FilterUtils from "@/lib/FilterUtils";
    import resultDataGraphQlAPI from "@/api/graphql/resultdata";

    const statsToShow = ['zprime', 'cv', 'stdev', 'min', 'mean', 'median', 'max'];

    const props = defineProps(['plates', 'experiment']);

    const loading = ref(false);
    const filter = ref('');
    const filterMethod = FilterUtils.defaultFilterMethod();

    const columns = ref([
        {name: 'barcode', align: 'center', label: 'Barcode', field: 'barcode', sortable: true}
    ]);

    const plates = computed( () => (props.plates || []))
    const plateStatRows = ref([])

    // Phase 1: fetch protocol and feature info

    const protocols = ref([])
    const features = ref([])

    const fetchProtocols = () => {
      const {onResult, onError} = resultDataGraphQlAPI.protocolsByExperimentId(props.experiment.id)
      onResult(({data}) => {
        protocols.value = data.protocols
        features.value = protocols.value.flatMap(protocol => protocol.features)
        features.value.forEach(feature => {
          for (let i in statsToShow) {
            const stat = statsToShow[i]
            columns.value.push({ name: `stat-${feature.id}-${stat}`, type: 'stat', label: stat, align: 'left', field: `stat-${feature.id}-${stat}`, sortable: true });
          }
        })
        fetchResultSets()
      })
    }

    // Phase 2: fetch plate stats
    const fetchResultSets = () => {
      const plateIds = plates.value.map(plate => plate.id)

      const {onResult, onError} = resultDataGraphQlAPI.latestResultSetsByPlateIds(plateIds)
      onResult(({data}) => {
        for (let i in data.resultSets) {
          const plateStatRow = {
            'id': data.resultSets[i].plateId,
            'barcode': plates.value.find(plate => plate.id === data.resultSets[i].plateId).barcode
          }

          // TODO: implement onError
          const {onResult, onError} = resultDataGraphQlAPI.resultSetFeatureStats(data.resultSets[i].id)
          onResult(({data}) => {
            features.value.forEach(feature => {
              statsToShow.forEach(stat => {
                const rsStat = data.rsFeatureStats.find(rss => rss.statisticName === stat && rss.featureId === feature.id)
                if (rsStat)
                plateStatRow[`stat-${rsStat.featureId}-${rsStat.statisticName}`] = Math.round(rsStat.value * 100) / 100
                else
                plateStatRow[`stat-${feature.id}-${stat}`] = NaN
              })
            })

            plateStatRows.value.push(plateStatRow)
          })
        }
      })
    }

    fetchProtocols()
</script>
