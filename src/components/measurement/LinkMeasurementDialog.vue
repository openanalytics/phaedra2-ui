<template>
  <q-dialog @hide="clearData" v-model="showDialog">
    <q-card style="min-width: 50vw">

      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="text_snippet" color="primary" text-color="white"/>
        Link Measurement
      </q-card-section>

      <q-card-section>
        <div class="row q-pb-md">
          <span>By linking plates with a measurement it allows the user to apply protocol(s) with calculation features on the plate(s)</span>
        </div>

        <div>Selected plate(s):</div>
        <q-list dense bordered >
          <q-item v-for="plate in props.plates" :key="plate.id">
            <q-item-section avatar>
              <q-icon color="primary" name="view_module" />
            </q-item-section>
            <q-item-section>{{ plate.barcode }} ({{ plate.id }}) with dimensions {{ plate.rows }} x {{ plate.columns }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section>
        <oa-table
            :rows="filteredMeasurements"
            :columns="columns"
            v-model:selected="selectedMeasurement"
            selection="single">
        </oa-table>
      </q-card-section>

      <q-card-actions class="text-primary" align="right">
        <q-btn flat label="Cancel" v-close-popup/>
        <q-btn label="Link" color="primary" @click="doLink" :disable="selectedMeasurement.length == 0" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>

import {computed, ref} from "vue"
import FormatUtils from "@/lib/FormatUtils"
import measurementsGraphQlAPI from "@/api/graphql/measurements"
import plateActions from "@/composable/plate/plateActions";
import {useLoadingHandler} from "@/composable/loadingHandler"
import OaTable from "@/components/table/OaTable.vue";

const props = defineProps(['show', 'plates'])
const emit = defineEmits([ 'update:show', 'linkPlateMeasurement' ])

const filter = ref('')

const showDialog = computed({
    get: () => props.show,
    set: (v) => emit('update:show', v)
});

const allMeasurements = ref([])
const selectedMeasurement = ref([]);

const {onResult, onError} = measurementsGraphQlAPI.measurementsAll()
onResult(({data}) => allMeasurements.value = data.measurements)
// TODO: Implement onError

const filteredMeasurements = computed(() => preFilterMeasurements(allMeasurements.value))

const loadingHandler = useLoadingHandler()
const doLink = async () => {
  await loadingHandler.handleLoadingDuring(plateActions.linkMeasurement(props.plates, selectedMeasurement.value[0]))
  emit('linkPlateMeasurement', selectedMeasurement.value[0])
}

const columns = [
    {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
    {name: 'name', align: 'left', label: 'Measurement Name', field: 'name', sortable: true},
    {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
    {name: 'layout', align: 'left', label: 'Dimensions', field: 'layout', sortable: true, format: (val, row) => row.rows + " x " + row.columns},
    {name: 'wellColumns', align: 'left', label: 'Well Columns', field: 'wellColumns', sortable: true, format: val => `${val?.length || 0}` },
    {name: 'subWellColumns', align: 'left', label: 'SubWell Columns', field: 'subWellColumns', sortable: true, format: val => `${val?.length || 0}` },
    {name: 'imageChannels', align: 'left', label: 'Image Channels', field: 'imageChannels', sortable: true, format: val => `${val?.length || 0}` },
    {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate },
];

const checkPlateDimensions = () => {
  const countRows = props.plates.map(p => p.rows).filter(onlyUnique).length;
  const countColumns = props.plates.map(p => p.columns).filter(onlyUnique).length;
  return (countRows <= 1 && countColumns <= 1);
}

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}

const preFilterMeasurements = (allMeasurements) => {
  if (!checkPlateDimensions()) return [];
  return allMeasurements.filter(row => row.rows === props.plates[0].rows && row.columns === props.plates[0].columns);
}

const clearData = () => {
  filter.value = '';
  selectedMeasurement.value = [];
}

</script>
