<template>
  <q-dialog v-model="showDialog">
    <q-card style="min-width: 50vw">

      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="text_snippet" color="primary" text-color="white"/>
        Link Measurement
      </q-card-section>

      <q-card-section>
        <div class="row q-pb-md">
          <span>By linking plates with a measurement it allows the user to apply protocol(s) with calculation features on the plate(s)</span>
        </div>

        <q-card-section>
          <div class="q-pb-md">Selected plate(s):</div>
          <q-list dense bordered>
            <q-item v-for="plate in props.plates" :key="plate.id">
              <q-item-section avatar>
                <q-icon color="primary" name="view_module" />
              </q-item-section>
              <q-item-section>{{ plate.barcode }} ({{plate.id}}) with dimensions {{ plate.rows }} x {{ plate.columns }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card-section>

      <q-card-section>
        <q-table
            :rows="availableMeasurements"
            :columns="columns"
            row-key="id"
            :pagination="{ rowsPerPage: 10, sortBy: 'createdOn', descending: true }"
            :filter="filter"
            :filter-method="filterMethod"
            v-model:selected="selectedMeasurement"
            selection="single"
            virtual-scroll
            style="max-height: 400px"
            table-header-class="text-grey"
            flat square dense>
          <template v-slot:top-left>
            <div class="row">
              <q-input outlined dense debounce="300" v-model="filter.name" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search"/>
                </template>
              </q-input>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions class="text-primary" align="right">
        <q-btn flat label="Cancel" v-close-popup/>
        <q-btn label="Link" color="primary" @click="doLink" :disable="selectedMeasurement.length == 0" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>

import {computed, onMounted, ref, watch} from "vue"
import {useStore} from "vuex"
import FormatUtils from "@/lib/FormatUtils"
import FilterUtils from "@/lib/FilterUtils"
import projectsGraphQlAPI from "@/api/graphql/projects"
import measurementsGraphQlAPI from "@/api/graphql/measurements"

const store = useStore();
const props = defineProps(['show', 'plate', 'plates'])
const emit = defineEmits([ 'update:show', 'linkPlateMeasurement' ])

const showDialog = computed({
    get: () => props.show,
    set: (v) => emit('update:show', v)
});

const measurements = ref([])
onMounted(() => {
  const {onResult, onError} = measurementsGraphQlAPI.measurementsAll()
  onResult(({data}) => measurements.value = data.measurements)
})

const doLink = () => {
  emit('linkPlateMeasurement', selectedMeasurement.value[0])
    // const plateIds = props.plates.map(plate => plate.id)
    // const { mutate: linkMeasurements } = projectsGraphQlAPI.linkPlateMeasurement(plateIds, selectedMeas.id)
    // linkMeasurements().then(() => {
    // })
};

const availableMeasurements = computed(() => (measurements.value || []).filter(m => m.rows == props.plates[0].rows));
const selectedMeasurement = ref([]);

const columns = [
    {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
    {name: 'name', align: 'left', label: 'Measurement Name', field: 'name', sortable: true},
    {name: 'layout', align: 'left', label: 'Dimensions', field: 'layout', sortable: true, format: (val, row) => row.rows + " x " + row.columns},
    {name: 'wellColumns', align: 'left', label: 'Well Columns', field: 'wellColumns', sortable: true, format: val => `${val?.length || 0}` },
    {name: 'subWellColumns', align: 'left', label: 'SubWell Columns', field: 'subWellColumns', sortable: true, format: val => `${val?.length || 0}` },
    {name: 'imageChannels', align: 'left', label: 'Image Channels', field: 'imageChannels', sortable: true, format: val => `${val?.length || 0}` },
    {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate },
];

const filter = ref({
      "colDef.name": columns.filter((col) => col.name === "name")[0],
      name:
          props.plate
              ? props.plate.barcode
              : props.plates && props.plates[0]
                  ? props.plates[0].barcode
                  : "",
})
const filterMethod = FilterUtils.defaultFilterMethod();

</script>
