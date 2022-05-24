<template>
  <div class="q-pa-md">
    <oa-section-header :title="'Edit Feature'" :icon="'edit'"/>
    <div class="oa-section-body">
      <q-card-section>
        <div class="row">
          <div class="col-5">
            <q-input v-model="feature.name" square autofocus label="Name"/>
            <q-input v-model="feature.alias" square label="Alias"/>
            <q-input v-model="feature.description" square label="Description"/>
            <q-input v-model="feature.format" square label="Format" placeholder="#.##" style="width: 100px"/>
            <q-input v-model="feature.sequence" square label="Sequence"/>
            <q-input v-model="feature.trigger" square label="Trigger"/>
          </div>
          <div class="col-1"/>
          <div class="col-5">
            <q-select v-model="feature.type" square label="Type" :options="featureTypes" @update:model-value="onFeatureTypeSelection"/>
            <q-select v-model="feature.formulaId" square label="Formula" v-if="!isRaw(feature.type)"
                      :options="formulas.filter(formula => isCalculation(feature.type, formula.category))"
                      option-label="name" option-value="id" map-options @update:model-value="onFormulaSelection"/>
            <div v-if="(variables.list.length > 0)">
              <br/>
              <span class="text-primary">Formula variables:</span>
              <div class="row col-12">
                <template :key="variable.variableName" v-for="variable in variables.list">
                  <div v-if="!isRaw(feature.type)" class="row col-12">
                    <div class="col-7">
                      <q-input v-model="variable.sourceMeasColName"
                               v-if="variable.sourceInput === 'MEASUREMENT'"
                               :label="variable.variableName"/>
                      <q-select :options="availableFeatures(feature.protocolId, feature.id)"
                                v-model="variable.sourceFeatureId"
                                option-value="id" option-label="name" emit-value map-options
                                v-if="variable.sourceInput === 'FEATURE'"
                                :label="variable.variableName"/>
                    </div>
                    <div class="col-1"/>
                    <div class="col-4">
                      <q-select v-model="variable.sourceInput" :options="inputSource" label="Input source" square/>
                    </div>
                  </div>
                  <div v-else class="row col-12">
                    <div class="col-7">
                      <q-input v-model="variable.sourceMeasColName" :label="variable.variableName"/>
                    </div>
                    <div class="col-1"/>
                    <div class="col-4">
                      <q-select v-model="variable.sourceInput" :options="inputSource" label="Input source" disable square />
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <br>
        <div class="row justify-end">
          <q-btn flat class="on-left" label="Cancel" color="primary" @click="$emit('update:show',false)"/>
          <q-btn label="Edit feature" v-close-popup color="primary" @click="editFeature"/>
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<script setup>

import { useStore } from "vuex";
import { computed, reactive, ref, watch } from "vue";
import assert from 'assert'
import OaSectionHeader from "../widgets/OaSectionHeader";

const store = useStore()

//TODO fix hardcode
const featureTypes = ['CALCULATION', 'NORMALIZATION', 'RAW']
const inputSource = ['MEASUREMENT', 'FEATURE']

const props = defineProps(['show', 'originalFeature'])
const emit = defineEmits(['update:show'])

const formulas = computed(() => store.getters['calculations/getFormulas']())
const feature = ref({})

//Reactive list that changes when formulaInputs changes
const variables = reactive({list: []})
const previous = reactive({list: []})

const isCalculation = (featureType, formulaCategory) => {
  if (featureType === 'CALCULATION') {
    if (formulaCategory === 'CALCULATION'
        || formulaCategory === 'HIT_CALLING'
        || formulaCategory === 'OUTLIER_DETECTION'
        || formulaCategory === 'POLISHING') {
      return true;
    }
  }
  return false;
}

const isRaw = (featureType) => {
  return featureType === 'RAW' ? true : false
}

const availableFeatures = (protocolId, featureId) => {
  if (featureId)
    return store.getters['features/getByProtocolId'](protocolId).filter(f => f.id !== featureId)
  return store.getters['features/getByProtocolId'](protocolId);
}

//Make hard copy of feature to edit it later
let originalFeature = props.originalFeature || {}
feature.value = {...originalFeature}
const originalFormulaId = ref(originalFeature.formulaId)
//Fetch previous formula variable names
store.dispatch('features/getCalculationInputValue', feature.value.id).then(() => {
  const civs = store.getters['features/getCalculationInputValueByFeatureId'](feature.value.id)
  if (civs) {
    //Make full copy of getter + sort alphabetically instead of by date modified
    previous.list = JSON.parse(JSON.stringify(civs)).sort((a, b) => a.variableName.localeCompare(b.variableName))
    previous.list.forEach(f => f['sourceInput'] = f.sourceMeasColName ? 'MEASUREMENT' : 'FEATURE');

    variables.list = JSON.parse(JSON.stringify(civs)).sort((a, b) => a.variableName.localeCompare(b.variableName));
    variables.list.forEach(f => f['sourceInput'] = f.sourceMeasColName ? 'MEASUREMENT' : 'FEATURE');
  }
})

//Get formulaInputs
const formulaInputs = ref(null)
const onFeatureTypeSelection = () => {
  if (isRaw(feature.value.type)) {
    feature.value.sequence = 0
    feature.value.formulaId = 75
    store.dispatch('calculations/getFormulaInputs', 75).then(() => {
      formulaInputs.value = store.getters['calculations/getFormulaInputs'](75) || []
    })
  } else {
    if (formulaInputs.value && formulaInputs.value.length > 0) {
      feature.value.formulaId = null
      formulaInputs.value = []
    }
  }
}

const onFormulaSelection = () => {
  if (feature.value.formulaId) {
    store.dispatch('calculations/getFormulaInputs', feature.value.formulaId.id).then(() => {
      formulaInputs.value = store.getters['calculations/getFormulaInputs'](feature.value.formulaId.id) || []
    })
  }
}

//Watch for changes and update lists accordingly
watch(formulaInputs, (f) => {
  variables.list = f.map(i => {
    return {
      variableName: i,
      sourceInput: 'MEASUREMENT',
      sourceMeasColName: undefined,
      sourceFeatureId: undefined
    }
  })
})

//Function to fire an edit event of a feature using the working copy
const editFeature = () => {
  feature.value.formulaId = Number.isInteger(feature.value.formulaId) ? feature.value.formulaId : feature.value.formulaId.id
  //Did formula change? choose civs list accordingly
  const formulaChange = (feature.value.formulaId !== originalFormulaId.value)
  const varsChanged = calcVariablesChanged(variables, previous)
  const civs = (formulaChange || varsChanged) ? variables : previous
  store.dispatch('features/editFeature', {
    feature: feature.value,
    formulaChange: formulaChange,
    civs: civs.list,
    prev: previous.list
  })
  emit('update:show', false)
}

const calcVariablesChanged =  (variables, previous) => {
  if (variables.list.length !== previous.list.length) return true;
  try {
    assert.deepEqual(variables.list, previous.list);
    return false;
  } catch (e) {
    return true
  }

}
</script>
