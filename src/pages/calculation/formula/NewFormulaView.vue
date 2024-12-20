<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="newFormula">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench'}"/>
    <q-breadcrumbs-el label="Formulas" icon="list" :to="'/calc/formulas'"/>
    <q-breadcrumbs-el label="New Formula" icon="functions"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="New Formula" icon="functions">
        <div class="q-pa-sm">
          <q-form class="full-width" @submit="onSubmit" @reset="onReset">
            <div class="col">
              <q-input v-model="newFormula.name" label="Name" dense/>
              <q-input v-model="newFormula.description" label="Description" dense/>
              <q-select v-model="newFormula.category" label="Category" :options="categories" dense/>
              <q-select v-model="newFormula.language" label="Language" :options="languages" dense/>
              <q-select v-model="newFormula.scope" label="Scope" :options="scopes" dense/>
              <q-input v-model="newFormula.versionNumber" label="Version" mask="#.#.#" hint="Mask: #.#.#, Example: 1.0.0" dense />
            </div>
            <div class="row justify-end">
              <q-btn label="Save" type="submit" color="primary" icon="save"/>
              <q-btn label="Cancel" type="reset" color="primary" icon="cancel" flat/>
            </div>
          </q-form>
        </div>
      </oa-section>
    </div>
  </q-page>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import OaSection from "@/components/widgets/OaSection";
import {useFormulasStore} from "@/stores/formulas";
import {useCalcStore} from "@/stores/calculations";

const newFormula = ref({});
onMounted(() => {
  newFormula.value = {
    name: null,
    description: null,
    deprecated: false,
    category: null,
    language: null,
    scope: null,
    versionNumber: null,
    formula: "//Insert your formula here",
  }
})

const formulaStore = useFormulasStore()
const onSubmit = async () => {
  await formulaStore.createFormula(newFormula.value)
  await router.push("/calc/formula/" + formulaStore.formula.id);
};

const router = useRouter();
const onReset = () => {
  router.push("/calc/formulas");
};

const calculationStore = useCalcStore()
const categories = calculationStore.categories
const languages = calculationStore.languages
const scopes = calculationStore.scopes
</script>
