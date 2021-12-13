<template>
  <q-table
      table-header-class="text-dark"
      flat square
      :rows="plate.wells"
      :columns="getColumns()"
      row-key="id"
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
  <table-config v-model:show="configdialog" v-model:visibleColumns="visibleColumns"
                v-model:columnsList="columnsList" v-model:columnOrder="columnOrder"></table-config>
</template>

<script>
import {ref} from 'vue'

import WellUtils from "@/lib/WellUtils.js"
import TableConfig from "../../components/table/TableConfig";

const filterMethod = function (rows, term) {
  return rows.filter(row => {
    return (row.id == term
        || row.nr == term
        || row.wellType.toLowerCase().includes(term)
    )
  })
}

export default {
  components: {TableConfig},
  props: {
    plate: Object
  },
  setup(props) {

    const columns = {
      coordinate: {
        name: 'coordinate', align: 'left', label: 'Coordinate', field: 'coordinate', sortable: true,
        format: (val, well) => (well ? WellUtils.getWellCoordinate(well.row, well.column) : "")
      },
      number: {
        name: 'number', align: 'left', label: 'Number', field: 'number', sortable: true,
        format: (val, well) => (well ? WellUtils.getWellNr(well.row, well.column, props.plate.columns) : "")
      },
      status: {name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true},
      wellType: {name: 'wellType', align: 'left', label: 'Well Type', field: 'welltype', sortable: true},
      substance: {
        name: 'substance', align: 'left', label: 'Substance', field: 'substance', sortable: true,
        format: (val, well) => (well.substance?.name ? well.substance?.name : "")
      },
      concentration:{
        name: 'concentration', align: 'left', label: 'Concentration', field: 'concentration', sortable: true,
        format: (val, well) => (well.substance?.concentration ? well.substance?.concentration.toExponential(3) : "")
      },
    }
    let columnOrder = ['coordinate','number','status','wellType','substance','concentration']
    //Load columnList for config in setup
    let columnsList = []
    columnOrder.forEach(function (col) {
      columnsList.push({column: col})
    })
    columnsList.forEach(function (col) {
      //Dummy data
      col.dataType = (Math.random() + 1).toString(36).substring(7)
      col.description = (Math.random() + 1).toString(36).substring(2)
    })

    return {
      columns,
      filter: ref(''),
      filterMethod,
      WellUtils,
      visibleColumns: ['coordinate','number','status','wellType','substance','concentration'],
      columnsList,
      configdialog: ref(false),
      columnOrder
    }
  },
  methods: {
    getColumns(){
      let newOrder = []
      let tempList = this.columnOrder.slice()
      while (tempList.length>0){
        const shift = tempList.shift()
        newOrder.push(this.columns[shift])
      }
      return newOrder
    }
  }
}

</script>
