<template>
  <q-table v-if="!showPlateStats&&!showWellTypeStats"
           table-header-class="text-grey"
           flat square
           :title="'Result Set ' + props.resultSet[0].resultSetId"
           :rows="props.resultSet"
           :columns="resultSetColumns"
           row-key="id"
           :filter-method="filterMethod"
           :filter="filter"
           :pagination="{ rowsPerPage: 10 }"
           :visible-columns="visibleResultSetColumns"
           no-data-label="No results associated with this plate"
  >
    <template v-slot:top-right>
      <div class="col action-button on-left">
        <q-btn size="sm" color="primary" icon="arrow_back" label="Back to result sets"
               @click="$emit('update:resultSetShow',false)"/>
      </div>
      <div class="row">
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;"
               @click="configResultSetDialog=true"/>
      </div>
    </template>
    <template v-slot:body-cell-Feature="props">
      <q-td :props="props">
        <div class="row items-center">
          {{ getFeatureName(props.row.featureId) }}
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-Menu="props">
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
  <table-config v-model:show="configResultSetDialog" v-model:visibleColumns="visibleResultSetColumns"
                v-model:columns="resultSetColumns"></table-config>
  <q-table v-if="showPlateStats"
           table-header-class="text-dark"
           flat square
           :title="'Plate Statistics for feature ' + getFeatureNameByResultRowId(chosenId) + ' from result set '+props.resultSet[0].resultSetId"
           :rows="getPlateStats()"
           :columns="plateStatsColumns"
           :visible-columns="visiblePlateStatsColumns"
           :filter="filterPlateStats"
           :filter-method="filterPlateStatsMethod"
           :pagination="{ rowsPerPage: 10 }"
           no-data-label="No results associated with this plate"
  >
    <template v-slot:top-right>
      <div class="col action-button on-left">
        <q-btn size="sm" color="primary" icon="arrow_back" label="Back to result set" @click="showPlateStats=false"/>
      </div>
      <div class="row">
        <q-input outlined rounded dense debounce="300" v-model="filterPlateStats" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;"
               @click="configPlateStatsDialog=true"/>
      </div>
    </template>
  </q-table>
  <table-config v-model:show="configPlateStatsDialog" v-model:visibleColumns="visiblePlateStatsColumns"
                v-model:columns="plateStatsColumns"></table-config>
  <q-table v-if="showWellTypeStats"
           table-header-class="text-dark"
           flat square
           :title="'Well Type Statistics for feature ' + getFeatureNameByResultRowId(chosenId) + ' from result set '+props.resultSet[0].resultSetId"
           :rows="getWellTypeStats()"
           :columns="wellTypeStatsColumns"
           :visible-columns="visibleWellTypeStatsColumns"
           :filter="filterWellStats"
           :filter-method="filterWellStatsMethod"
           :pagination="{ rowsPerPage: 10 }"
           no-data-label="No results associated with this plate"
  >
    <template v-slot:top-right>
      <div class="col action-button on-left">
        <q-btn size="sm" color="primary" icon="arrow_back" label="Back to result set" @click="showWellTypeStats=false"/>
      </div>
      <div class="row">
        <q-input outlined rounded dense debounce="300" v-model="filterWellStats" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;"
               @click="configWellTypeStatsDialog=true"/>
      </div>
    </template>
  </q-table>
  <table-config v-model:show="configWellTypeStatsDialog" v-model:visibleColumns="visibleWellTypeStatsColumns"
                v-model:columns="wellTypeStatsColumns"></table-config>
</template>

<script>
import {computed, ref} from 'vue'

import {useStore} from "vuex";
import TableConfig from "../table/TableConfig";

let resultSetColumns = ref([
  {name: 'Feature', align: 'left', label: 'Feature', field: 'featureId', sortable: true},
  {name: 'Status', align: 'left', label: 'Status', field: 'statusCode', sortable: true},
  {name: 'Menu', align: 'left', field: 'menu', sortable: false}
])

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
    resultSet: Array,
    resultSetShow: Boolean
  },
  emits: ['update:resultSetShow'],
  components: {
    TableConfig
  },
  setup(props) {
    const store = useStore()

    const features = computed(() => store.getters['features/getByProtocolId'](props.resultSet[0].protocolId))
    if (!store.getters['features/isProtocolLoaded'](props.resultSet[0].protocolId)) {
      store.dispatch('features/loadByProtocolId', props.resultSet[0].protocolId)
    }

    let chosenId = ref(0)
    let showPlateStats = ref(false)
    let showWellTypeStats = ref(false)
    
    return {
      resultSetColumns,
      visibleResultSetColumns: resultSetColumns.value.map(a => a.name),
      configResultSetDialog: ref(false),
      plateStatsColumns,
      visiblePlateStatsColumns: plateStatsColumns.value.map(a => a.name),
      configPlateStatsDialog: ref(false),
      wellTypeStatsColumns,
      visibleWellTypeStatsColumns: wellTypeStatsColumns.value.map(a => a.name),
      configWellTypeStatsDialog: ref(false),
      props,
      features,
      chosenId,
      showPlateStats,
      showWellTypeStats,
      filter: ref(''),
      filterPlateStats: ref(''),
      filterWellStats: ref('')
    }
  },
  methods: {
    getFeatureName(id) {
      const feature = this.features?.find(formula => {
        return formula.id === id
      })
      if (feature) {
        return feature.name.split("_feature")[0]
      } else return 'NOT_IN_DB'
    },
    getPlateStats() {
      const stats = this.props.resultSet.find(res => {
        return res.id === this.chosenId
      })
      if (stats) {
        return stats.plateStats
      } else return this.props.resultSet[0].plateStats
    },
    getWellTypeStats() {
      const stats = this.props.resultSet.find(res => {
        return res.id === this.chosenId
      })
      if (stats) {
        return stats.wellTypeStats
      } else return this.props.resultSet[0].plateStats
    },
    getFeatureNameByResultRowId(id) {
      const stats = this.props.resultSet.find(res => {
        return res.id === id
      })
      return this.getFeatureName(stats.featureId)
    },
    filterMethod(rows, term) {
      return rows.filter(row => {
        return ((row.id + ' ').includes(term.toString().toLowerCase())
            || this.getFeatureName(row.featureId).toLowerCase().includes(term.toLowerCase())
            || this.$store.getters['protocols/getAll']().find(protocol => protocol.id == row.protocolId).name.toLowerCase().includes(term.toLowerCase())
            || this.$store.getters['measurements/getAll']().find(meas => meas.id == row.measId).name.toLowerCase().includes(term.toLowerCase())
            || row.statusCode.toLowerCase().includes(term.toLowerCase()))
      })
    },
    filterPlateStatsMethod(rows, term) {
      return rows.filter(row => {
        return row.name.toLowerCase().includes(term.toLowerCase())
            || (row.value + ' ').includes(term.toLowerCase())
      })
    },
    filterWellStatsMethod(rows, term) {
      return rows.filter(row => {
        return row.name.toLowerCase().includes(term.toLowerCase())
            || row.welltype.toLowerCase().includes(term.toLowerCase())
            || (row.value + ' ').includes(term.toLowerCase())
      })
    }
  }
}

</script>