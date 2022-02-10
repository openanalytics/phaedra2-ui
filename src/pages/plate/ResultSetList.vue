<template>
  <q-table v-if="!resultSetShow"
      table-header-class="text-dark"
      flat square
      :title="'Result Sets'"
      :rows="resultSets"
      :columns="resultSetsColumns"
      row-key="id"
      :pagination="{ rowsPerPage: 5 }"
      :filter="filter"
      :filter-method="filterMethod"
      :visible-columns="visibleColumns"
      no-data-label="No results associated with this plate"
  >
    <template v-slot:top-right>
      <div class="row">
        <q-input outlined rounded dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>
      </div>
    </template>
    <template v-slot:body-cell-Protocol="props">
      <q-td :props="props">
        <router-link :to="'/protocol/' + props.row.protocolId" class="nav-link">
          <div class="row items-center cursor-pointer">
            {{ ($store.state.protocols.protocols.length>0)?$store.state.protocols.protocols.find(protocol => protocol.id == props.row.protocolId).name:"" }}
          </div>
        </router-link>
      </q-td>
    </template>
    <template v-slot:body-cell-Measurement="props">
      <q-td :props="props">
          <div class="row items-center">
            {{ (currentPlate.measurements.length>0)?currentPlate.measurements.find(meas => meas.measurementId == props.row.measId).name:"" }}
          </div>
      </q-td>
    </template>
    <template v-slot:body-cell-Id="props">
      <q-td :props="props" >
        <div class="row items-center cursor-pointer" @click="showResultSet(props.row.resultSetId)">
          <q-icon name="assignment_turned_in" class="icon q-pr-sm"/>
        {{props.row.resultSetId}}
        </div>
      </q-td>
    </template>
  </q-table>
  <ResultSetTable v-if="resultSetShow" v-model:resultSet="resultSet" v-model:resultSetShow="resultSetShow"/>
  <table-config v-model:show="configdialog" v-model:visibleColumns="visibleColumns" v-model:columns="resultSetsColumns"></table-config>
</template>

<script>
import {ref, computed} from 'vue'
import {useStore} from 'vuex'
import FormatUtils from "../../lib/FormatUtils";
import ResultSetTable from "../../components/plate/ResultSetTable";
import TableConfig from "../../components/table/TableConfig";

let resultSetsColumns = ref([
  {name: 'Id', align: 'left', label: 'Id', field: 'resultSetId', sortable: true},
  {name: 'Protocol', align: 'left', label: 'Protocol', field: 'protocolId', sortable: true},
  {name: 'Created On', align: 'left', label: 'Created On', field: 'createdTimestamp', sortable: true, format: FormatUtils.formatDate},
  {name: 'Measurement', align: 'left', label: 'Measurement', field: 'measId', sortable: true}])

export default {
  name: 'ResultSetList',
  props: {
    plate: Object
  },
  components: {ResultSetTable, TableConfig},
  setup(props) {
    const store = useStore()
    const resultSetTable = ref(false)
    const activeMeasurement = store.getters['plates/getActiveMeasurement']();
    const resultSets = activeMeasurement ? computed(() => [...new Map(store.getters['resultdata/getPlateResults'](props.plate.id, activeMeasurement.measurementId)?.map(item => [item.resultSetId, item])).values()]) : [];
    const resultData = activeMeasurement ? computed(() => store.getters['resultdata/getPlateResults'](props.plate.id, activeMeasurement.measurementId)) : [];
    let resultSet = ref([])
    return {
      currentPlate: props.plate,
      resultData,
      resultSetTable,
      resultSetsColumns,
      resultSets,
      resultSet,
      filter: ref(''),
      visibleColumns: resultSetsColumns.value.map(a => a.name),
      configdialog: ref(false),
      resultSetShow: ref(false)
  }
  },
  methods: {
    showResultSet(resultSetId){
      this.resultSet = this.resultData.filter(a => a.resultSetId === resultSetId)
      this.resultSetShow = true
    },
    filterMethod(rows,term){
      return rows.filter(row => {
        return ((row.resultSetId+' ').includes(term.toString())
            || this.$store.getters['protocols/getAll']().find(protocol => protocol.id == row.protocolId).name.toLowerCase().includes(term)
            || this.$store.getters['measurements/getAll']().find(meas => meas.id == row.measId).name.toLowerCase().includes(term))
      })
    },

  }
}

</script>
