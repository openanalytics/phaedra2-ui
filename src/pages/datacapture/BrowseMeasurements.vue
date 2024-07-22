<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Measurements'" icon="list"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="Captured Measurements" icon="text_snippet">
        <generic-table :rows="measurementStore.measurements"
                       :columns="columns"
                       :loading="loading"
                       @row-dblclick="gotoMeasurementView">
          <template v-slot:top-left>
            <q-btn color="primary" icon="refresh" size="sm" @click="refreshList" class="on-left"/>
          </template>
          <template v-slot:top-right>
            <date-range-selector v-model:from="fromDate" v-model:to="toDate"
                                 @rangeChanged="refreshList"/>
          </template>
        </generic-table>

        <div class="q-mt-md">
          Selected: {{ JSON.stringify(selectedMeasurements.map(m => m.id)) }}
        </div>
      </oa-section>
    </div>
  </q-page>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useRouter} from "vue-router";
import FormatUtils from "@/lib/FormatUtils";
import OaSection from "@/components/widgets/OaSection";
import {useMeasurementStore} from "@/stores/measurement";
import DateRangeSelector from "@/components/widgets/DateRangeSelector.vue";
import {date} from "quasar";
import GenericTable from "@/components/table/GenericTable.vue";

const router = useRouter()
const loading = ref(true);
const selectedMeasurements = ref([])

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
  {name: 'dimensions', align: 'left', label: 'Dimensions', field: t => `${t.rows} x ${t.columns}`, sortable: true},
  {name: 'wellColumns', align: 'left', label: 'WellData Columns', field: row => (row?.wellColumns?.length || 0), sortable: true},
  {name: 'subWellColumns', align: 'left', label: 'SubwellData Columns', field: row => (row?.subWellColumns?.length || 0), sortable: true},
  {name: 'imageChannels', align: 'left', label: 'Image Channels', field: row => (row?.imageChannels?.length || 0), sortable: true},
])

const gotoMeasurementView = (event, row) => {
  router.push('/datacapture/meas/' + row.id)
}
</script>
