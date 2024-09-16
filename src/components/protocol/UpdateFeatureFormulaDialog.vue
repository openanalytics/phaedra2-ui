<template>
    <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 50vw">
            <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                <q-avatar icon="functions" color="primary" text-color="white"/>
                Update Feature Formula
            </q-card-section>
            
            <q-card-section>
                <div class="row q-pb-md">
                    <span>The Feature Formula will be updated from version</span>
                    <q-chip square dense class="q-my-none">{{ currentFormula.versionNumber }}</q-chip>
                    <span>to</span>
                    <q-chip square dense class="q-my-none">{{ newFormula.versionNumber }}</q-chip>
                    <span>. Do you want to apply this update?</span>
                </div>

                <div>
                    <q-chip square dense class="q-ma-xs">{{ currentFormula.versionNumber }}</q-chip>
                    <codemirror disabled v-model="currentFormula.formula" style="border: 1px solid gray; max-height: 10vw" />

                    <q-chip square dense class="q-ma-xs q-mt-md">{{ newFormula.versionNumber }}</q-chip>
                    <codemirror disabled v-model="newFormula.formula" style="border: 1px solid gray; max-height: 10vw" />
                </div>
                
                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup/>
                    <q-btn label="Update" color="primary" @click="doUpdateFormula" v-close-popup/>
                </q-card-actions>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup>

import {computed} from "vue";
import {Codemirror} from 'vue-codemirror';
import {useProtocolStore} from "@/stores/protocol";
import {useFeatureStore} from "@/stores/feature";
import {useFormulasStore} from "@/stores/formulas";

const props = defineProps(['show', 'feature']);
const emits = defineEmits(['update:show']);

const protocolStore = useProtocolStore();
const featureStore = useFeatureStore();
const formulasStore = useFormulasStore();

const showDialog = computed({
    get: () => props.show,
    set: (v) => emits('update:show', v)
});

const currentFormula = computed(() => formulasStore.getFormulaById(parseInt(props.feature?.formulaId)) || {});
const newFormula = computed(() => formulasStore.getHigherVersionFormula(parseInt(props.feature?.formulaId)) || {});

function doUpdateFormula() {
    featureStore.loadFeature(props.feature);
    featureStore.feature.formula = newFormula.value;
    featureStore.feature.formulaId = newFormula.value.id;
    protocolStore.editFeature(featureStore.feature);
    protocolStore.saveProtocol();
}

</script>