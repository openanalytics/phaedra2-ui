<template>
    <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 50vw">
            <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                <q-avatar icon="calculate" color="primary" text-color="white"/>
                Calculate Plate
            </q-card-section>

            <q-card-section v-if="activeMeasurement && checkDimensions()">
                <div class="q-pb-sm">
                    Select the protocol to use for calculation:
                </div>
                <protocol-selectable-list v-model:selected="selected"></protocol-selectable-list>
            </q-card-section>

            <q-card-section v-if="!activeMeasurement">
                <q-icon name="warning" color="negative" class="on-left"/>
                <span class="text-accent text-weight-bold">Cannot calculate: this plate has no active measurement.</span>
            </q-card-section>
            <q-card-section v-if="!checkDimensions()">
                <q-icon name="warning" color="negative" class="on-left"/>
                <span class="text-accent text-weight-bold">Cannot calculate: the plate and measurement dimensions are different.</span>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup/>
                <q-btn label="Calculate" color="primary" :disable="!activeMeasurement || selected.length === 0 || !checkDimensions()" @click="calculatePlate" v-close-popup/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>

import {computed, onUpdated, ref} from "vue";
import {useStore} from "vuex";
import ProtocolSelectableList from "@/components/protocol/ProtocolSelectableList";
import {useCalcStore} from "@/stores/calculations";
import projectsGraphQlAPI from "@/api/graphql/projects";

const props = defineProps(['show', 'plate']);
const emits = defineEmits(['update:show']);

const store = useStore();
const calculationStore = useCalcStore()

const showDialog = computed({
    get: () => props.show,
    set: (v) => emits('update:show', v)
});

const selected = ref([]);
const activeMeasurement = ref({})

onUpdated(() => {
  const {onResult, onError} = projectsGraphQlAPI.activeMeasurementByPlateId(props.plate.id)
  onResult(({data}) => {
    activeMeasurement.value = data.plateMeasurement
  })
  console.log("On update Calculate plate dialog!! ")
})

const calculatePlate = () => {
  calculationStore.startCalculation({
    protocolId: Number.parseInt(selected.value[0].id),
    plateId: Number.parseInt(props.plate.id),
    measId: Number.parseInt(activeMeasurement.value.measurementId)
  })

  emits('update:show', false);
};

const checkDimensions = () => {
    if (activeMeasurement.value) {
        return activeMeasurement.value.rows === props.plate.rows && activeMeasurement.value.columns === props.plate.columns;
    }
    return true;
};
</script>
