<template>
    <q-breadcrumbs class="oa-breadcrumb" v-if="formulaStore.formula">
        <q-breadcrumbs-el icon="home" :to="{ name: 'workbench'}"/>
        <q-breadcrumbs-el :label="'Formulas'" icon="list" :to="'/calc/formulas'"/>
        <q-breadcrumbs-el :label="formulaStore.formula.name" icon="functions"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <div class="q-pa-sm">
          <formula-details @edit="toggleEditMode"/>
          <oa-section title="Formula" icon="description" class="q-pt-sm">
            <codemirror :disabled="!editMode" v-model="formulaStore.formula.formula"/>
            <div class="text-grey text-caption q-pt-md">
                {{ formulaInputs.length }} input variable(s) detected: {{ formulaInputs.length > 0 ? formulaInputs.map(n => `\"${n}\"`).join(",") : 'None' }}
            </div>
          </oa-section>
        </div>
    </q-page>
</template>

<script setup>
import {ref} from 'vue'
import {useRoute} from 'vue-router'
import { Codemirror } from 'vue-codemirror';

import OaSection from "@/components/widgets/OaSection";
import FormulaDetails from "@/pages/calculation/formula/FormulaDetails.vue";
import {useLoadingHandler} from "@/composable/loadingHandler";
import {useFormulasStore} from "@/stores/formulas";

const route = useRoute();
const formulaId = parseInt(route.params.id);
const formulaInputs = ref([])

const formulaStore = useFormulasStore()
const fetchFormula = async () => {
  await formulaStore.loadFormula(formulaId)
  formulaInputs.value = await formulaStore.getFormulaInputsByFormulaId(formulaId)
}
const loadingHandler = useLoadingHandler()
loadingHandler.handleLoadingDuring(fetchFormula())

const editMode = ref(false);
const toggleEditMode = (value) => {
    editMode.value = value;
};

</script>
