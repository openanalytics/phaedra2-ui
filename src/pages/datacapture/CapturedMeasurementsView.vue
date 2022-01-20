<template>
  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md">
      <div class="row text-h6 items-center q-px-md oa-section-title">
        <q-icon name="text_snippet" class="on-left"/>
        Captured Measurements
      </div>
      <div class="row q-pa-lg oa-section-body">
        <q-table table-header-class="text-grey" flat :rows="measurements" :columns="columns" row-key="id" class="full-width" :pagination="{ rowsPerPage: 20, sortBy: 'createdOn', descending: true}" :filter="filterValue" :filter-method="filterMethod">
          <template v-slot:top-right>
            <div class="row">
              <q-input outlined rounded dense debounce="300" v-model="filterValue" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search"/>
                </template>
              </q-input>
              <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>
            </div>
          </template>
          <template v-slot:body-cell-layout="props">
            <q-td :props="props">
              {{ props.row.rows }} x {{ props.row.columns }}
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
    <table-config v-model:show="configdialog" v-model:visibleColumns="visibleColumns" v-model:columns="columns"></table-config>
  </q-page>
</template>

<script>
import {computed, ref} from 'vue'
import {useStore} from "vuex";
import FormatUtils from "../../lib/FormatUtils";
import TableConfig from "../../components/table/TableConfig";

export default {
  name: 'CapturedMeasurementsView',
  components: {TableConfig},
  setup() {
    const exported = {}
    const store = useStore()
    if (!store.getters["measurements/isLoaded"]()){
      store.dispatch('measurements/loadAll')
    }
    exported.measurements = computed(() => store.getters['measurements/getAll']())

    exported.columns = ref([
      {name: 'id', align: 'left', label: 'Id', field: 'id', sortable: true},
      {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
      {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
      {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
      {name: 'layout', align: 'left', label: 'Layout', field: 'layout', sortable: true},
      {
        name: 'createdOn',
        align: 'left',
        label: 'Created On',
        field: 'createdOn',
        sortable: true,
        format: FormatUtils.formatDate
      },
      {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
    ])
    exported.visibleColumns = exported.columns.value.map(a => a.name)
    exported.configdialog = ref(false)
    exported.filterMethod = (rows, term) => {
      return rows.filter(row => {
        term = term.toLowerCase()
        return (row.id == term
            || row.barcode.toLowerCase().includes(term)
            || row.name.toLowerCase().includes(term)
            || row.description?.toLowerCase().includes(term))
      })
    }
    exported.filterValue = ref('')

    return exported
  }
}
</script>