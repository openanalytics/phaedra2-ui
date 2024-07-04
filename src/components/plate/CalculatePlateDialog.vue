<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 60vw">

      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="calculate" color="primary" text-color="white"/>
        Calculate Plate(s)
      </q-card-section>

      <q-card-section>
        <div class="row q-pb-md">
          <span>Select the protocol to use for calculation on plate(s)</span>
        </div>

        <q-card-section>
          <div class="q-pb-md">Selected plate(s):</div>
          <q-list dense bordered>
            <q-item v-for="plate in props.plates" :key="plate.id">
              <q-item-section avatar>
                <q-icon color="primary" name="view_module"/>
              </q-item-section>
              <q-item-section>{{ plate.barcode }} ({{ plate.id }}) with dimensions {{ plate.rows }}
                x {{ plate.columns }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section>
          <div class="q-pb-sm">
            Select the protocol to use for calculation:
          </div>
          <protocol-selectable-list v-model:selected="selected" :protocolId="props.protocolId"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn label="Calculate" color="primary"
                 :disable="selected.length === 0"
                 @click="calculatePlates" v-close-popup/>
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>

import {computed, onUpdated, ref} from "vue";
import ProtocolSelectableList from "@/components/protocol/ProtocolSelectableList";
import {useCalcStore} from "@/stores/calculations";
import projectsGraphQlAPI from "@/api/graphql/projects";


const props = defineProps(['show', 'plate', 'plates', "protocolId"]);
const emits = defineEmits(['update:show']);

const calculationStore = useCalcStore()

const showDialog = computed({
    get: () => props.show,
    set: (v) => emits('update:show', v)
});

const selected = ref([]);
const activeMeasurements = ref({})

onUpdated(() => {
  const plateIds = props.plates.map(plate => Number.parseInt(plate.id))
  const {onResult, onError} = projectsGraphQlAPI.activeMeasurementByPlateIds(plateIds)
  onResult(({data}) => {
    for (let plateMeas of data.plateMeasurements) {
      activeMeasurements.value[plateMeas.plateId] = Number.parseInt(plateMeas.measurementId)
    }
  })
  console.log("On update Calculate plate dialog!! ")
})

const calculatePlates = () => {
  const plateIds = props.plates.map(plate => Number.parseInt(plate.id))
  calculationStore.startCalculation({
    protocolId: Number.parseInt(selected.value[0].id),
    plateIds: plateIds,
    measIds: activeMeasurements.value
  })
  emits('update:show', false);
}

const checkDimensions = () => {
  const countRows = props.plates.map(p => p.rows).filter(onlyUnique).length;
  const countColumns = props.plates.map(p => p.rows).filter(onlyUnique).length;
  return (countRows <= 1 && countColumns <= 1);

    if (activeMeasurement.value) {
        return activeMeasurement.value.rows === props.plate.rows && activeMeasurement.value.columns === props.plate.columns;
    }
    return true;
}
</script>
