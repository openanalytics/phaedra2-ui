<script setup>
import {computed, ref, watch} from 'vue'
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import FormatUtils from "@/lib/FormatUtils";
// import TableConfig from "@/components/table/TableConfig";
import OaSection from "@/components/widgets/OaSection";
import UserChip from "@/components/widgets/UserChip";

const router = useRouter()
const loading = ref(true);
const store = useStore()

const measurements = computed(() => store.getters['measurements/getAll']() || [])
store.dispatch('measurements/loadAll').then(() => loading.value = false);

const filteredMeasurements = ref([])
const columnFilters = ref({})
const visibleColumns = ref([])

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
  {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'layout', align: 'left', label: 'Dimensions', field: 'layout', sortable: true, format: (val, row) => row.rows + " x " + row.columns},
  {name: 'wellColumns', align: 'left', label: 'WellData Columns', field: row => (row?.wellColumns?.length || 0), sortable: true},
  {name: 'subWellColumns', align: 'left', label: 'SubwellData Columns', field: row => (row?.subWellColumns?.length || 0), sortable: true},
  {name: 'imageChannels', align: 'left', label: 'Image Channels', field: row => (row?.imageChannels?.length || 0), sortable: true},
])

const configdialog = ref(false)

const updateVisibleColumns = (columns) => {
  visibleColumns.value = [...columns]
}

const handleColumnFilter = (columnName) => {
  filteredMeasurements.value = measurements.value.filter(row => String(row[columnName]).includes(columnFilters.value[columnName]))
}

watch(measurements, () => {
  visibleColumns.value = [...columns.value.map(a => a.name)];
  filteredMeasurements.value = [...measurements.value.map(r => r)]

  columns.value.forEach(col => {
    columnFilters.value[col.name] = ref(null)
  })
})
</script>

<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Measurements'" icon="list"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="Captured Measurements" icon="text_snippet">
        <q-table
            table-header-class="text-grey"
            class="full-width"
            :rows="filteredMeasurements"
            :columns="columns"
            :visible-columns="visibleColumns"
            row-key="id"
            column-key="name"
            :pagination="{ rowsPerPage: 20, sortBy: 'createdOn', descending: true}"
            @row-click="(e, row) => router.push('/datacapture/meas/' + row.id)"
            :loading="loading"
            separator="cell"
            flat dense square
        >
<!--          <template v-slot:top-right>-->
<!--            <div class="row">-->
<!--              <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>-->
<!--            </div>-->
<!--          </template>-->
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name">
                <q-input v-if="col.name != 'menu'" v-model="columnFilters[col.name]"
                         @update:model-value="handleColumnFilter(col.name)"
                         dense class="filterColumn">
                  <template v-slot:append>
                    <q-icon size="xs" name="search"/>
                  </template>
                </q-input>
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body-cell-createdBy="props">
            <q-td :props="props">
              <UserChip :id="props.row.createdBy"/>
            </q-td>
          </template>
        </q-table>
      </oa-section>
    </div>
<!--    <TableConfig v-model:show="configdialog" v-model:visibleColumns="visibleColumns" v-model:columns="columns"/>-->
  </q-page>
</template>

<style scoped>
:deep(.filterColumn .q-field__control),
:deep(.filterColumn .q-field__append){
  font-size: 12px;
  height: 25px;
}
</style>
