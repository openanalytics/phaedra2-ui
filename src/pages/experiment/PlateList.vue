<template>
  <q-table
      table-header-class="text-grey"
      :rows="plates"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
      :filter="filter"
      :filter-method="filterMethod"
      :loading="loading"
      :visible-columns="visibleColumns"
      class="full-width"
      square
  >
    <template v-slot:top-right>
      <div class="col action-button on-left">
        <q-btn size="sm" color="primary" icon="add" label="New Plate" @click="openNewPlateTab"/>
      </div>
      <div class="row">
        <q-input outlined rounded dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>
      </div>
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
    <template v-slot:body-cell-status-validated="props">
      <q-td :props="props">
        <q-icon name="check_circle" color="positive"/>
      </q-td>
    </template>
    <template v-slot:body-cell-status-approved="props">
      <q-td :props="props">
        <q-icon name="check_circle" color="positive"/>
      </q-td>
    </template>
    <template v-slot:body-cell-layout="props">
      <q-td :props="props">
        {{ props.row.rows }} x {{ props.row.columns }}
      </q-td>
    </template>
    <template v-slot:body-cell-tags="props">
      <q-td :props="props">
        <div class="tag-icon flex inline" v-for="tag in props.row.tags" :key="tag.value">
          <q-badge color="green">
            {{ tag }}
          </q-badge>
        </div>
      </q-td>
    </template>
    <template v-slot:no-data>
      <div class="full-width row text-info">
        <span>No plates to show.</span>
      </div>
    </template>
  </q-table>
  <table-config v-model:show="configdialog" v-model:visibleColumns="visibleColumns" v-model:columnsList="columnsList"></table-config>
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
import {useStore} from 'vuex'
import {computed, ref} from "vue";
import TableConfig from "../../components/table/TableConfig";

const columns = [
  {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'status-validated', align: 'left', label: 'Validated', field: 'status-validated', sortable: true},
  {name: 'status-approved', align: 'left', label: 'Approved', field: 'status-approved', sortable: true},
  {name: 'layout', align: 'left', label: 'Layout', field: 'layout', sortable: true},
  {
    name: 'createdOn',
    align: 'left',
    label: 'Created On',
    field: 'createdOn',
    sortable: true,
    format: val => val !== undefined ? `${val.toLocaleString()}` : ''
  },
  {name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true}
]

const filterMethod = function (rows, term) {
  return rows.filter(row => {
    return (row.id == term
        || row.barcode.toLowerCase().includes(term)
        || row.description.toLowerCase().includes(term)
        || (row.tags && row.tags.some(tag => tag.toLowerCase().includes(term))))
  })
}

export default {
  components: {TableConfig},

  props: {
    experiment: Object
  },
  methods: {
    openNewPlateTab(){
      this.$emit("message")
    }
  },
  setup(props) {
    const store = useStore()
    const loading = ref(true)

    const plates = computed(() => store.getters['plates/getByExperimentId'](props.experiment.id))
    store.dispatch('plates/loadByExperimentId', props.experiment.id).then(() => {
      loading.value = false
    })

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
      loading,
      plates,
      visibleColumns: columns.map(a => a.name),
      columnsList,
      configdialog: ref(false)
    }
  }
}

</script>
