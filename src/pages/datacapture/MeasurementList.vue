<template>
  <oa-table :rows="measurementStore.measurements" :columns="columns"
            @row-dblclick="handleDblRowClick">
    <template v-slot:top-right>
      <q-btn round icon="refresh" size="sm" @click="refreshList" class="on-left">
        <q-tooltip>Refresh</q-tooltip>
      </q-btn>
    </template>
    <template v-slot:top-left>
      <date-range-selector v-model:from="fromDate" v-model:to="toDate"
                           @rangeChanged="refreshList"/>
    </template>
  </oa-table>
</template>

<script setup>
import DateRangeSelector from "@/components/widgets/DateRangeSelector";
import OaTable from "@/components/table/OaTable.vue";
import { useMeasurementStore } from "@/stores/measurement";
import { ref } from "vue";
import FormatUtils from "@/lib/FormatUtils";
import { date } from "quasar";
import { useLoadingHandler } from "@/composable/loadingHandler";

const emits = defineEmits(["rowDlbClick"]);

const columns = ref([
  { name: "id", align: "left", label: "ID", field: "id", sortable: true },
  {
    name: "createdOn", align: "left", label: "Created On", field: "createdOn",
    sortable: true, format: FormatUtils.formatDate
  },
  { name: "createdBy", align: "left", label: "Created By", field: "createdBy", sortable: true },
  { name: "barcode", align: "left", label: "Barcode", field: "barcode", sortable: true },
  { name: "name", align: "left", label: "Name", field: "name", sortable: true },
  { name: "description", align: "left", label: "Description", field: "description", sortable: true },
  {
    name: "dimensions", align: "left", label: "Dimensions",
    field: (t) => `${t.rows} x ${t.columns}`, sortable: true
  },
  { name: "wellColumns", align: "left", label: "WellData Columns",
    field: (row) => row?.wellColumns?.length || 0, sortable: true
  },
  { name: "subWellColumns", align: "left", label: "SubwellData Columns",
    field: (row) => row?.subWellColumns?.length || 0, sortable: true
  },
  { name: "imageChannels", align: "left", label: "Image Channels",
    field: (row) => row?.imageChannels?.length || 0, sortable: true
  },
]);

const now = new Date();
const fromDate = ref(date.subtractFromDate(now, { days: 7 }));
const toDate = ref(date.addToDate(now, { days: 1 }));
const getDateRange = () => {
  return { from: fromDate.value.getTime(), to: toDate.value.getTime() };
};

const measurementStore = useMeasurementStore();
const refreshList = async () => {
  await measurementStore.loadAllMeasurements(getDateRange())
};

const loadingHandler = useLoadingHandler();
loadingHandler.handleLoadingDuring(refreshList());

const handleDblRowClick = (event, row) => {
  emits("rowDlbClick", row);
};
</script>
