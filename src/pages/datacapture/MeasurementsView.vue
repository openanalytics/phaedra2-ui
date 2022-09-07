<template>
  <q-page class="oa-root-div">
    <div class="q-pa-md">
      <oa-section-header :title="'Captured Measurements'" :icon="'text_snippet'"/>
      <div class="row q-pa-lg oa-section-body">
        <q-table
          table-header-class="text-grey"
          flat dense
          :rows="measurements"
          :columns="columns"
          row-key="id"
          class="full-width"
          :pagination="{ rowsPerPage: 20, sortBy: 'createdOn', descending: true}"
          :filter="filterValue"
          :filter-method="filterMethod"
          @row-click="(e, row) => router.push('/datacapture/meas/' + row.id)"
          >
          <template v-slot:top-right>
            <div class="row">
              <q-input outlined dense debounce="300" v-model="filterValue" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search"/>
                </template>
              </q-input>
              <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>
            </div>
          </template>
          <template v-slot:body-cell-createdBy="props">
            <q-td :props="props">
              <UserChip :id="props.row.createdBy" />
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
import {useRouter} from "vue-router";
import FormatUtils from "@/lib/FormatUtils";
import FilterUtils from "@/lib/FilterUtils";
import TableConfig from "@/components/table/TableConfig";
import OaSectionHeader from "@/components/widgets/OaSectionHeader";
import UserChip from "@/components/widgets/UserChip";

export default {
  name: 'CapturedMeasurementsView',
  components: { TableConfig, OaSectionHeader, UserChip },
  setup() {
    const exported = {}

    exported.router = useRouter()
    const store = useStore()
    if (!store.getters["measurements/isLoaded"]()){
      store.dispatch('measurements/loadAll')
    }
    exported.measurements = computed(() => store.getters['measurements/getAll']())

    exported.columns = ref([
      {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
      {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
      {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
      {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
      {name: 'wellColumns', align: 'left', label: 'WellData Columns', field: row => (row?.wellColumns?.length || 0), sortable: true },
      {name: 'subWellColumns', align: 'left', label: 'SubwellData Columns', field: row => (row?.subWellColumns?.length || 0), sortable: true },
      {name: 'imageChannels', align: 'left', label: 'Image Channels', field: row => (row?.imageChannels?.length || 0), sortable: true },
      {name: 'layout', align: 'left', label: 'Dimensions', field: 'layout', sortable: true, format: (val, row) => row.rows + " x " + row.columns },
      {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
      {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
    ])
    exported.visibleColumns = exported.columns.value.map(a => a.name)
    exported.configdialog = ref(false)
    exported.filterMethod = FilterUtils.defaultTableFilter()
    exported.filterValue = ref('')

    return exported
  }
}
</script>