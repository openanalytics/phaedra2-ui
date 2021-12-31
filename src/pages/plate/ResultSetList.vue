<template>
  <q-table
      table-header-class="text-dark"
      flat square
      :title="'Result Sets'"
      :rows="resultSets"
      :columns="resultSetsColumns"
      row-key="id"
      :pagination="{ rowsPerPage: 5 }"
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
    <template v-slot:body-cell-resultSetId="props">
      <q-td :props="props" >
        <div class="row items-center cursor-pointer" @click="showResultSet(props.row.resultSetId)">
        {{props.row.resultSetId}}
        </div>
      </q-td>
    </template>
  </q-table>
  <ResultSetTable v-if="resultSetShow" :resultSet="resultSet"/>
</template>

<script>
import {ref, computed} from 'vue'
import {useStore} from 'vuex'
import FormatUtils from "../../lib/FormatUtils";
import ResultSetTable from "../../components/plate/ResultSetTable";

let resultSetsColumns = ref([
  {name: 'resultSetId', align: 'left', label: 'Id', field: 'resultSetId', sortable: true},
  {name: 'protocolId', align: 'left', label: 'Protocol', field: 'protocolId', sortable: true},
  {name: 'createdTimestamp', align: 'left', label: 'Created On', field: 'createdTimestamp', sortable: true, format: FormatUtils.formatDate},
  {name: 'measId', align: 'left', label: 'Measurement', field: 'measId', sortable: true}])

let resultSetColumns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'resultSetId', align: 'left', label: 'resultSetId', field: 'resultSetId', sortable: true},
  {name: 'featureId', align: 'left', label: 'featureId', field: 'featureId', sortable: true},
  {name: 'protocolId', align: 'left', label: 'protocolId', field: 'protocolId', sortable: true},
  {name: 'createdTimestamp', align: 'left', label: 'Created On', field: 'createdTimestamp', sortable: true, format: val => val !== undefined ? `${val.toLocaleString()}` : ''},
  {name: 'measId', align: 'left', label: 'measId', field: 'measId', sortable: true}])

export default {
  name: 'ResultSetList',
  props: {
    plate: Object
  },
  components: {ResultSetTable},
  setup(props) {
    const store = useStore()
    const resultSetTable = ref(false)
    const resultSets = computed(() => [...new Map(store.getters['resultdata/getPlateResults'](props.plate.id)?.map(item => [item.resultSetId, item])).values()])
    const resultData = computed(() => store.getters['resultdata/getPlateResults'](props.plate.id));
    store.dispatch('resultdata/loadPlateResults',{plateId: props.plate.id});
    store.dispatch('measurements/loadAll');
    let resultSet = ref([])
    let resultSetShow = ref(false)
    return {
      resultData,
      resultSetTable,
      resultSetsColumns,
      resultSets,
      resultSetColumns,
      resultSet,
      resultSetShow
    }
  },
  methods: {
    showResultSet(resultSetId){
      this.resultSet = this.resultData.filter(a => a.resultSetId === resultSetId)
      this.resultSetShow = true
    }
  }
}

</script>