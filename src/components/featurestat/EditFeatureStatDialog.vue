<template>
    <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 20vw">
            <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                <q-avatar icon="functions" color="primary" text-color="white"/>
                {{ statWorkingCopy.id ? 'Edit' : 'Create' }} Feature Stat
            </q-card-section>
            
            <q-card-section>
                <q-input v-model="statWorkingCopy.id" label="ID" readonly dense borderless></q-input>
                <q-input v-model="statWorkingCopy.name" label="Name" stack-label dense></q-input>
                
                <q-field label="Is Plate Stat?" stack-label dense borderless class="q-pt-md">
                    <template v-slot:control>
                        <q-toggle v-model="statWorkingCopy.plateStat" size="sm" dense />
                    </template>
                </q-field>
                <q-field label="Is WellType Stat?" stack-label dense borderless class="q-pb-md">
                    <template v-slot:control>
                        <q-toggle v-model="statWorkingCopy.welltypeStat" size="sm" dense />
                    </template>
                </q-field>

                <q-select v-model="statWorkingCopy.formula" label="Formula" stack-label dense
                        :options="formulas" option-value="id" option-label="name"
                        @filter="filterFormulas" use-input>
                    <template v-slot:selected>
                        {{ statWorkingCopy.formula.name }}
                        <q-chip v-if="statWorkingCopy.formula" square dense class="q-ma-xs" size="sm">
                            {{ statWorkingCopy.formula.versionNumber }}
                        </q-chip>
                        <q-badge v-else>*none*</q-badge>
                    </template>
                    <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                        <q-item-section>
                            <q-item-label>{{ scope.opt.name }}</q-item-label>
                            <q-item-label caption>{{ scope.opt.versionNumber }}</q-item-label>
                        </q-item-section>
                        </q-item>
                    </template>
                </q-select>
                <q-card-actions align="right" class="text-primary q-pt-md">
                    <q-btn flat label="Cancel" v-close-popup/>
                    <q-btn label="Save" color="primary" @click="doUpdateFeatureStat" v-close-popup/>
                </q-card-actions>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup>

import {computed, ref, watchEffect} from "vue";
import {useFormulasStore} from "@/stores/formulas";
import ArrayUtils from "@/lib/ArrayUtils";

const formulasStore = useFormulasStore();
const props = defineProps(['show', 'featureStat']);
const emits = defineEmits(['update:show', 'onSaveStat']);

const showDialog = computed({
    get: () => props.show,
    set: (v) => emits('update:show', v)
});

const statWorkingCopy = ref({});
watchEffect(() => {
    if (props.show && props.featureStat) statWorkingCopy.value = {...props.featureStat, formula: (formulasStore.getFormulaById(props.featureStat.formulaId) || {})};
});

const formulaFilter = ref('');
const formulas = computed(() => ArrayUtils.sortBy([...formulasStore.formulas].filter(f => f.name.toLowerCase().includes(formulaFilter.value)), 'name'));
const filterFormulas = (val, update) => update(() => formulaFilter.value = val);

async function doUpdateFeatureStat() {
    if (statWorkingCopy.value.formula) statWorkingCopy.value.formulaId = statWorkingCopy.value.formula.id;
    emits('onSaveStat', statWorkingCopy.value);
    statWorkingCopy.value = { formula: {} };
}

</script>