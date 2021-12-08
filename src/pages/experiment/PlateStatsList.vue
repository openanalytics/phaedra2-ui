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
import {ref} from 'vue'
// import {useStore} from 'vuex'

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
    // const store = useStore()
    const loading = ref(true)
    const rows = ref([])
    const tableKey = ref(0)

    const columns = [
      {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true}
    ]

    props.experiment ? loading.value = false : console('Experiment is undefined.')

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
