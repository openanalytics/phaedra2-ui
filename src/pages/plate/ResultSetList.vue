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
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>
      </div>
    </template>
    <template v-slot:body-cell-Protocol="props">
      <q-td :props="props" >
        <router-link :to="'/protocol/' + props.row.protocolId" class="nav-link">
          <div class="row items-center cursor-pointer">
            {{ props.value }}
          </div>
        </router-link>
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

export default {
  name: 'ResultSetList',
  props: {
    plate: Object
  },
  components: {
    ResultSetTable, TableConfig
  },
  setup(props) {
    const store = useStore()

    const activeMeasurement = store.getters['measurements/getActivePlateMeasurement'](props.plate.id);

    // All known resultDatas from all resultSets
    const resultDatas = activeMeasurement ? computed(() => store.getters['resultdata/getPlateResults'](props.plate.id, activeMeasurement[0].measurementId)) : [];

    // Distinct resultSets
    const resultSets = activeMeasurement ? computed(() => [...new Map(store.getters['resultdata/getPlateResults'](props.plate.id, activeMeasurement[0].measurementId)
      ?.map(item => [item.resultSetId, item])).values()]
      .sort((r1, r2) => r2.resultSetId - r1.resultSetId)) : [];

    let protocolIds = [...new Set(resultSets.value.map(rs => rs.protocolId))];
    protocolIds.forEach(id => store.dispatch('protocols/loadById', id));

    let resultSetsColumns = ref([
      {name: 'Id', align: 'left', label: 'ID', field: 'resultSetId', sortable: true},
      {name: 'Protocol', align: 'left', label: 'Protocol', field: 'protocolId', sortable: true, format: val => (store.getters['protocols/getById'](val) || {}).name},
      {name: 'Created On', align: 'left', label: 'Created On', field: 'createdTimestamp', sortable: true, format: FormatUtils.formatDate},
      {name: 'Measurement', align: 'left', label: 'Measurement', field: 'measId', sortable: true, format: val => (activeMeasurement[0].measurementId == val || {}).name},
      {name: 'Features', align: 'left', label: 'Features', sortable: true, format: (val, row) => resultDatas.value.filter(a => a.resultSetId === row.resultSetId).length },
      {name: 'Status', align: 'left', label: 'Status', sortable: true, format:
        (val, row) => (resultDatas.value.some(a => a.resultSetId === row.resultSetId && a.statusCode != 'SUCCESS')) ? 'FAILURE' : 'SUCCESS' }
    ])

    const resultSet = ref([])
    const resultSetShow = ref(false);

    return {
      resultSetsColumns,
      resultSets,
      resultSet,
      filter: ref(''),
      visibleColumns: resultSetsColumns.value.map(a => a.name),
      configdialog: ref(false),
      resultSetShow,
      showResultSet(resultSetId){
        resultSet.value = resultDatas.value.filter(a => a.resultSetId === resultSetId)
        resultSetShow.value = true
      },
    }
  },
  methods: {
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
