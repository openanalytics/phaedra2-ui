<template>
  <q-table
      table-header-class="text-dark"
      flat square
      :title="'Result Set ' + props.resultSet[0].resultSetId"
      :rows="props.resultSet"
      :columns="resultSetColumns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
      no-data-label="No results associated with this plate"
  >
    <template v-slot:body-cell-protocolId="props">
      <q-td :props="props">
        <router-link :to="'/protocol/' + props.row.protocolId" class="nav-link">
          <div class="row items-center cursor-pointer">
            {{ ($store.state.protocols.protocols.length>0)?$store.state.protocols.protocols.find(protocol => protocol.id == props.row.protocolId).name:"" }}
          </div>
        </router-link>
      </q-td>
    </template>
    <template v-slot:body-cell-measId="props">
      <q-td :props="props">
        <div class="row items-center">
          {{ ($store.state.measurements.measurements.length>0)?$store.state.measurements.measurements.find(meas => meas.id == props.row.measId).name:"" }}
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-featureId="props">
      <q-td :props="props">
        <div class="row items-center">
          {{ getFeatureName(props.row.featureId)}}
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-menu="props">
      <q-td :props="props">
        <div class="row items-center cursor-pointer">
          <q-btn flat round icon="more_horiz" style="border-radius: 50%;">
            <q-menu fit>
              <q-list style="min-width: 100px">
                <q-item clickable @click="chosenId=props.row.id;showPlateStats=true">
                  <q-item-section>Show Plate Statistics</q-item-section>
                </q-item>
                <q-item clickable @click="chosenId=props.row.id;showWellTypeStats=true">
                  <q-item-section>Show Well Type Statistics</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-td>
    </template>
  </q-table>

  <q-table v-if="showPlateStats"
      table-header-class="text-dark"
      flat square
      :title="'Plate Statistics for feature ' + getFeatureNameByResultRowId(chosenId) + ' from result set '+props.resultSet[0].resultSetId"
      :rows="getPlateStats()"
      :columns="plateStatsColumns"
      :pagination="{ rowsPerPage: 10 }"
      no-data-label="No results associated with this plate"
  />
  <q-table v-if="showWellTypeStats"
           table-header-class="text-dark"
           flat square
           :title="'Well Type Statistics for feature ' + getFeatureNameByResultRowId(chosenId) + ' from result set '+props.resultSet[0].resultSetId"
           :rows="getWellTypeStats()"
           :columns="wellTypeStatsColumns"
           :pagination="{ rowsPerPage: 10 }"
           no-data-label="No results associated with this plate"
  />
</template>

<script>
import {computed, ref} from 'vue'

import FormatUtils from "../../lib/FormatUtils";
import {useStore} from "vuex";

let resultSetColumns = ref([
  {name: 'id', align: 'left', label: 'Id', field: 'id', sortable: true},
  {name: 'featureId', align: 'left', label: 'Feature', field: 'featureId', sortable: true},
  {name: 'protocolId', align: 'left', label: 'Protocol', field: 'protocolId', sortable: true},
  {name: 'measId', align: 'left', label: 'Measurement', field: 'measId', sortable: true},
  {name: 'createdTimestamp', align: 'left', label: 'Created On', field: 'createdTimestamp', sortable: true, format: FormatUtils.formatDate},
  {name: 'statusCode', align: 'left', label: 'Status', field: 'statusCode', sortable: true},
  {name: 'menu', align: 'left', field: 'menu', sortable: false}])

let plateStatsColumns = ref([
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'value', align: 'left', label: 'Value', field: 'value', sortable: true},
  ])

let wellTypeStatsColumns = ref([
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'welltype', align: 'left', label: 'Well Type', field: 'welltype', sortable: true},
  {name: 'value', align: 'left', label: 'Value', field: 'value', sortable: true},
])

export default {
  name: 'ResultSetTable',
  props: {
    resultSet: Array
  },
  setup(props) {
    const store = useStore()
    const  features = computed(() => store.getters['features/getByProtocolId'](props.resultSet[0].protocolId))
    if(!store.getters['features/isProtocolLoaded'](props.resultSet[0].protocolId)) {
      store.dispatch('features/loadByProtocolId', props.resultSet[0].protocolId)
    }
    let chosenId = ref(0)
    let showPlateStats = ref(false)
    let showWellTypeStats = ref(false)
    return {
      resultSetColumns,
      plateStatsColumns,
      wellTypeStatsColumns,
      props,
      features,
      chosenId,
      showPlateStats,
      showWellTypeStats
    }
  },
  methods: {
    getFeatureName(id){
      const feature = this.features?.find(formula => {return formula.id === id})
      if(feature){
        return feature.name.split("_feature")[0]
      }
      else return 'NOT_IN_DB'
    },
    getPlateStats(){
      const stats = this.props.resultSet.find(res => {return res.id===this.chosenId})
      console.log(this.props.resultSet)
      if(stats){
        return stats.plateStats
      }
      else return this.props.resultSet[0].plateStats
    },
    getWellTypeStats(){
      const stats = this.props.resultSet.find(res => {return res.id===this.chosenId})
      console.log(this.props.resultSet)
      if(stats){
        return stats.wellTypeStats
      }
      else return this.props.resultSet[0].plateStats
    },
    getFeatureNameByResultRowId(id) {
      const stats = this.props.resultSet.find(res => {return res.id===id})
      return this.getFeatureName(stats.featureId)
    }
  }
}

</script>