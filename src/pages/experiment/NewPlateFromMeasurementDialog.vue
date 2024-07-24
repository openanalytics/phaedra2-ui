<template>
  <q-dialog v-model="showDialog">
    <q-card style="min-width: 50vw">
      <q-card-section class="text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-icon name="add" class="q-pr-sm"/>
        New Plate from Measurement
      </q-card-section>

      <q-card-section>
        <div>
          <span>Select measurement(s): </span>
        </div>
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <generic-table :rows="measurementStore.measurements"
                       :columns="columns"
                       selection="multiple"
                       v-model:selected="selectedMeasurements">
          <template v-slot:top-left>
            <date-range-selector v-model:from="fromDate" v-model:to="toDate"
                                 @rangeChanged="refreshList"/>
          </template>
        </generic-table>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn label="Cancel" v-close-popup/>
        <q-btn label="Add plate(s)" v-close-popup color="primary" @click="createPlates" :disable="selectedMeasurements.length === 0"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import DateRangeSelector from "@/components/widgets/DateRangeSelector";
import GenericTable from "@/components/table/GenericTable";
import {useMeasurementStore} from "@/stores/measurement";
import {computed, onMounted, ref} from "vue";
import FormatUtils from "@/lib/FormatUtils";
import {date} from "quasar";
import {useLoadingHandler} from "@/composable/loadingHandler";
import {useExperimentStore} from "@/stores/experiment";

const props = defineProps({
  show: Boolean
});
const emits = defineEmits(['update:show' ]);
const showDialog = computed({
  get: () => props.show,
  set: (v) => emits('update:show', v)
})

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

const loadingHandler = useLoadingHandler()
const refreshList = async () => {
  await loadingHandler.handleLoadingDuring(measurementStore.loadAllMeasurements(getDateRange()))
}

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'dimensions', align: 'left', label: 'Dimensions', field: t => `${t.rows} x ${t.columns}`, sortable: true},
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true}
])

const selectedMeasurements = ref([])
const experimentStore = useExperimentStore()
const createPlates = async () => {
  const newPlates = selectedMeasurements.value.map((m, idx) => ({
    barcode: m.barcode,
    description: `Created from measurement (${m.name})` ,
    rows: m.rows,
    columns: m.columns,
    sequence: idx,
    linkStatus: "NOT_LINKED",
    calculationStatus: "CALCULATION_NEEDED",
    validationStatus: "VALIDATION_NOT_SET",
    approvalStatus: "APPROVAL_NOT_SET",
    experimentId: experimentStore.experiment.id,
    measurementId: m.id
  }))
  await loadingHandler.handleLoadingDuring(experimentStore.addPlates(newPlates))
}

</script>

<style scoped>

</style>
