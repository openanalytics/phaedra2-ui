<template>
  <div class="q-pa-md">
    <oa-section-header :title="'New Feature'" :icon="'edit'"/>
    <div class="oa-section-body">
      <q-card-section>
        <div class="row">
          <div class="col-5">
            <q-input v-model="newFeature.name" square autofocus label="Name"></q-input>
            <q-input v-model="newFeature.alias" square label="Alias"></q-input>
            <q-input v-model="newFeature.description" square label="Description"></q-input>
            <q-input v-model="newFeature.format" square label="Format" placeholder="#.##"
                     style="width: 100px"></q-input>
            <q-input v-model="newFeature.sequence" square label="Sequence"></q-input>
            <q-input v-model="newFeature.trigger" square label="Trigger"></q-input>
          </div>
          <div class="col-1"/>
          <div class="col-5">
            <q-select v-model="newFeature.type" square label="Type" :options="featureTypes"
                      @update:model-value="onFeatureTypeSelection"/>
            <q-select v-model="selectedFormulaId" square label="Formula" v-if="!isRaw(newFeature.type)"
                      :options="formulas.filter(formula => isCalculation(newFeature.type, formula.category))"
                      option-value="id" option-label="name" @update:model-value="onFormulaSelection"/>
            <div v-if="(variables.list.length > 0)">
              <br/>
              <div>
                <span class="text-primary">Formula variables:</span>
                <div>
                  <template :key="variable.variableName" v-for="variable in variables.list">
                    <div v-if="!isRaw(newFeature.type)" class="row col-12">
                      <div class="col-7">
                        <q-input v-model="variable.sourceMeasColName"
                                 v-if="variable.sourceInput === 'MEASUREMENT'"
                                 :label="variable.variableName"/>
                        <q-select :options="availableFeatures(newFeature.protocolId, newFeature.id)"
                                  v-model="variable.sourceFeatureId"
                                  option-value="id" option-label="name" emit-value map-options
                                  v-if="variable.sourceInput === 'FEATURE'"
                                  :label="variable.variableName"/>
                      </div>
                      <div class="col-1"/>
                      <div class="col-4">
                        <q-select v-model="variable.sourceInput" :options="inputSource" label="Input source" square />
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
        </div>
        <br>
        <div class="row justify-end">
          <q-btn flat label="Cancel" color="primary" @click="$emit('update:show',false)"/>
          <q-btn align="right" label="Add feature" v-close-popup color="primary" @click="addFeature"/>
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<script setup>

import {useStore} from "vuex";
import {computed, reactive, ref, watch} from "vue";
import OaSectionHeader from "../widgets/OaSectionHeader";

const store = useStore()

const props = defineProps(['show', 'protocolId'])
const emit = defineEmits(['update:show'])

const featureTypes = ['CALCULATION', 'NORMALIZATION', 'RAW']
const inputSource = ['MEASUREMENT', 'FEATURE']

const newFeature = ref({
  name: null,
  alias: null,
  description: null,
  format: '#.##',
  type: null,
  sequence: 0,
  protocolId: props.protocolId,
  formulaId: selectedFormulaId?.value,
  trigger: null
})

const variableNames = ref([])

const addFeature = () => {
  newFeature.value.formulaId = selectedFormulaId.value.id
  store.dispatch('features/createFeature', {newFeature: newFeature.value, civs: variables.list})
  emit('update:show', false)
}

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

const formulas = computed(() => store.getters['calculations/getFormulas']())

const selectedFormulaId = ref(null)
// const selectedInputSource = ref(null)
const formulaInputs = ref(null)

const onFeatureTypeSelection = () => {
  if (isRaw(newFeature.value.type)) {
    newFeature.value.sequence = 0
    store.dispatch('calculations/getFormulaInputs', 75).then(() => {
      formulaInputs.value = store.getters['calculations/getFormulaInputs'](75) || []
    })
  } else {
    if (formulaInputs.value && formulaInputs.value.length > 0) {
      selectedFormulaId.value = null
      formulaInputs.value = []
    }
  }
}

//Get formulaInputs and dispatch if it not available
const onFormulaSelection = () => {
  if (selectedFormulaId.value) {
    store.dispatch('calculations/getFormulaInputs', selectedFormulaId.value.id).then(() => {
      formulaInputs.value = store.getters['calculations/getFormulaInputs'](selectedFormulaId.value.id) || []
    })
  }
}

let variables = reactive({list: []})
watch(formulaInputs, (i) => {
  variables.list = i.map(i => {
    return {variableName: i, sourceInput: 'MEASUREMENT', sourceMeasColName: undefined, sourceFeatureId: undefined}
  })
})
</script>
