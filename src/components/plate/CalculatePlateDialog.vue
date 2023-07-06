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

import {computed,ref,watch} from "vue";
import {useStore} from "vuex";
import ProtocolSelectableList from "@/components/protocol/ProtocolSelectableList";

const props = defineProps(['show', 'plateId']);
const emits = defineEmits(['update:show']);

const store = useStore();
const plate = computed(() => store.getters['plates/getById'](props.plateId));
const activeMeasurement = computed(() => store.getters['measurements/getActivePlateMeasurement'](props.plateId));

const showDialog = computed({
    get: () => props.show,
    set: (v) => emits('update:show', v)
});

watch(() => props.show, (v) => {
    if (v === true) store.dispatch('measurements/loadByPlateId', props.plateId);
});

watch(() => props.plateId, (v) => {
    store.dispatch('plates/loadById', v);
});

const selected = ref([]);

const calculatePlate = () => {
    store.dispatch('calculations/startCalculation', {
        protocolId:  selected.value[0].id,
        plateId: props.plateId,
        measId: activeMeasurement.value.measurementId
    });
    emits('update:show', false);
};

const checkDimensions = () => {
    if (activeMeasurement.value) {
        return activeMeasurement.value.rows === plate.value.rows && activeMeasurement.value.columns === plate.value.columns;
    }
    return true;
};
</script>
