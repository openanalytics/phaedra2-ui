<template>
  <q-table v-if="!loading"
           table-header-class="text-dark"
           flat square
           :rows="wells.list"
           :columns="columns"
           row-key="id"
           column-key="name"
           :pagination="{ rowsPerPage: 50 }"
           :filter="filter"
           :filter-method="filterMethod"
           :visible-columns="visibleColumns"
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

<script>
import {ref, computed, reactive, watch} from 'vue'

import WellUtils from "@/lib/WellUtils.js"
import TableConfig from "../../components/table/TableConfig";
import {useStore} from "vuex"
import FilterUtils from "../../lib/FilterUtils";


export default {
  components: {TableConfig},
  props: {
    plate: Object
  },
  setup(props) {
    const store = useStore()

    let wells = reactive({list: props.plate.wells})
    //Watch for plate change to update list
    watch(props.plate, (cols) => {
      wells.list = cols.wells
    })

    const activeMeasurement = store.getters['measurements/getActivePlateMeasurement'](props.plate.id);
    store.dispatch('resultdata/loadLatestPlateResult', {
      plateId: props.plate.id,
      measurementId: activeMeasurement[0].measurementId
    })
    const resultSet = computed(() => store.getters['resultdata/getLatestPlateResult'](props.plate.id, activeMeasurement[0].measurementId))

    let columns = ref([
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
        format: (val, well) => (well.substance?.name ? well.substance?.name : "")
      },
      {
        name: 'concentration', align: 'left', label: 'Concentration', field: 'concentration', sortable: true,
        format: (val, well) => (well.substance?.concentration ? well.substance?.concentration.toExponential(3) : "")
      },
    ])

    return {
      columns,
      filter: ref(''),
      filterMethod: FilterUtils.defaultTableFilter(),
      WellUtils,
      visibleColumns: columns.value.map(a => a.name),
      configdialog: ref(false),
      resultSet,
      loading: ref(true),
      wells
    }
  },
  //Watch for resultSet to arrive to add columns and row data
  watch: {
    resultSet(newResult) {
      if (newResult.length > 0) {
        this.$store.dispatch('features/loadByProtocolId', newResult[0]?.protocolId).then(() => {
          const features = this.$store.getters['features/getByProtocolId'](newResult[0].protocolId);
          let tempList = JSON.parse(JSON.stringify(this.wells.list));
          newResult.forEach(res => {
            const featureNameFull = features.find(feature => feature.id === res.featureId).name
            const featureName = featureNameFull.split("_feature")[0]
            this.columns.push({
              name: featureName,
              align: 'left',
              label: featureName,
              field: featureName,
              sortable: true
            })
            this.visibleColumns.push(featureName)
            res.values.forEach((val, index) => {
              tempList[index][featureName] = val
            })
          })
          this.wells.list = tempList
        })
      }
      this.loading = false
    }
  }
}

</script>
