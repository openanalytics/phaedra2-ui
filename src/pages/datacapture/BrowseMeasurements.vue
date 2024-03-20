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
            :rows="measurementStore.measurements"
            :columns="columns"
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
          <template v-slot:top-left>
            <q-btn color="primary" icon="refresh" size="sm" @click="refreshList" class="on-left"/>
          </template>
          <template v-slot:top-right>
            <date-range-selector v-model:from="fromDate" v-model:to="toDate" @rangeChanged="refreshList"/>
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
  </q-page>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useRouter} from "vue-router";
import FormatUtils from "@/lib/FormatUtils";
import FilterUtils from "@/lib/FilterUtils.js";
import OaSection from "@/components/widgets/OaSection";
import UserChip from "@/components/widgets/UserChip";
import ColumnFilter from "@/components/table/ColumnFilter";
import {useMeasurementStore} from "@/stores/measurement";
import DateRangeSelector from "@/components/widgets/DateRangeSelector.vue";
import {date} from "quasar";

const router = useRouter()
const loading = ref(true);

const measurementStore = useMeasurementStore()
onMounted(() => {
  refreshList()
})

const now = new Date();
const fromDate = ref(date.subtractFromDate(now, { days: 7 }));
const toDate = ref(date.addToDate(now, { days: 1 }));
const getDateRange = () => {
  return { from: fromDate.value.getTime(), to: toDate.value.getTime() };
};

const refreshList = () => {
  loading.value = true;
  measurementStore.loadAllMeasurements(getDateRange()).then(() => {
    loading.value = false
  })
};

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

const filter = FilterUtils.makeFilter(columns.value);
const filterMethod = FilterUtils.defaultFilterMethod();
</script>
