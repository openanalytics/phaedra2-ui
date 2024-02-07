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
            :rows="measurements"
            :columns="columns"
            :visible-columns="visibleColumns"
            :filter="filter"
            :filter-method="filterMethod"
            row-key="id"
            column-key="name"
            :pagination="{ rowsPerPage: 20, sortBy: 'createdOn', descending: true}"
            @row-click="(e, row) => router.push('/datacapture/meas/' + row.id)"
            :loading="loading"
            separator="cell"
            flat dense square
        >
          <template v-slot:top-right>
            <div class="row">
              <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>
            </div>
          </template>
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
            <q-tr :props="props">
              <column-filter v-for="col in props.cols" :key="col.name" v-model="filter[col.name]"/>
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
    <table-config v-model:show="configdialog" v-model:visibleColumns="visibleColumns"
                  v-model:columns="columns"></table-config>
  </q-page>
</template>

<script setup>
import {computed, ref, watch} from 'vue'
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import FormatUtils from "@/lib/FormatUtils";
import FilterUtils from "@/lib/FilterUtils.js";
import TableConfig from "@/components/table/TableConfig";
import OaSection from "@/components/widgets/OaSection";
import UserChip from "@/components/widgets/UserChip";
import ColumnFilter from "@/components/table/ColumnFilter";

const router = useRouter()
const loading = ref(true);
const store = useStore()

const measurements = computed(() => store.getters['measurements/getAll']() || [])
store.dispatch('measurements/loadAll').then(() => loading.value = false);

const visibleColumns = ref([])

const columns = ref([
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

const filter = FilterUtils.makeFilter(columns.value);
const filterMethod = FilterUtils.defaultFilterMethod();

const configdialog = ref(false)

const updateVisibleColumns = (columns) => {
  visibleColumns.value = [...columns]
}

watch(measurements, () => {
  visibleColumns.value = [...columns.value.map(a => a.name)];
})
</script>
