<template>
  <q-table
      table-header-class="text-dark"
      flat square
      :rows="plate.wells"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 50 }"
      :filter="filter"
      :filter-method="filterMethod"
      :visible-columns="visibleColumns"
      class="oa-section-body">
    <template v-slot:top-right>
      <div class="row action-button on-left">
        <q-btn size="sm" color="primary" icon="edit" label="Change Table Configuration" @click="configdialog=true"/>
      </div>
      <q-input outlined rounded dense debounce="300" v-model="filter" placeholder="Search">
        <template v-slot:append>
          <q-icon name="search"/>
        </template>
      </q-input>
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
                v-model:columnsList="columnsList"></table-config>
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

    const columns = [
      {
        name: 'coordinate', align: 'left', label: 'Coordinate', field: 'coordinate', sortable: true,
        format: (val, well) => (well ? WellUtils.getWellCoordinate(well.row, well.column) : "")
      },
      {
        name: 'number', align: 'left', label: 'Number', field: 'number', sortable: true,
        format: (val, well) => (well ? WellUtils.getWellNr(well.row, well.column, props.plate.columns) : "")
      },
      {name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true},
      {name: 'wellType', align: 'left', label: 'Well Type', field: 'welltype', sortable: true},
      {
        name: 'substance', align: 'left', label: 'Substance', field: 'substance', sortable: true,
        format: (val, well) => (well.substance?.name ? well.substance?.name : "")
      },
      {
        name: 'concentration', align: 'left', label: 'Concentration', field: 'concentration', sortable: true,
        format: (val, well) => (well.substance?.concentration ? well.substance?.concentration.toExponential(3) : "")
      },
    ]

    //Load columnList for config in setup
    let columnsList = []
    columns.forEach(function (col) {
      columnsList.push({column: col.name})
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
      visibleColumns: columns.map(a => a.name),
      columnsList,
      configdialog: ref(false)
    }
  },
  methods: {}
}

</script>
