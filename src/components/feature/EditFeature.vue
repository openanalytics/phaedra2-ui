<template>
  <div class="q-pa-md">
    <oa-section-header :title="'Edit Feature'" :icon="'edit'"/>
    <div class="oa-section-body">
      <q-card-section>
        <q-tabs v-model="activeTab" align="left" class="q-px-sm oa-section-title" inline-label dense no-caps>
          <q-tab name="general" icon="info" label="General Info"/>
          <q-tab name="calculation" icon="functions" label="Calculation"/>
          <q-tab name="curve_fitting" label="Dose-Response Curve Fitting"/>
          <q-tab name="outlier_detection" label="Outlier Detection"/>
          <q-tab name="hit_calling" icon="rules" label="Hit Calling"/>
        </q-tabs>

        <div class="row oa-section-body">
          <q-tab-panels v-model="activeTab" animated style="width: 100%">
            <q-tab-panel name="general" label="General Info" class="col">
              <q-input v-model="feature.name" label="Name" stack-label square autofocus/>
              <q-input v-model="feature.alias" label="Alias" stack-label square/>
              <q-input v-model="feature.description" label="Description" stack-label square/>
              <q-input v-model="feature.format" label="Format" placeholder="#.##" stack-label square/>
              <q-select v-model="feature.type" label="Type" :options="featureTypes" stack-label square
                        @update:model-value="onFeatureTypeSelection"/>
            </q-tab-panel>
            <q-tab-panel name="calculation" label="calculation">
              <div class="q-pa-xs col">
                <q-select v-model="selectedFormula" label="Formula" stack-label
                          v-if="!isRaw(feature.type)"
                          :options="formulas.filter(formula => isCalculation(feature.type, formula.category))"
                          option-value="id" option-label="name" @update:model-value="onFormulaSelection"/>
                <div v-if="(variables.list.length > 0)">
                  <div>
                    <q-field label="Formula variables" stack-label borderless>
                      <template v-slot:control>
                        <div class="row col-12">
                          <template :key="variable.variableName" v-for="variable in variables.list">
                            <div v-if="!isRaw(feature.type)" class="row col-12">
                              <div class="col-7">
                                <q-input v-model="variable.sourceMeasColName"
                                         v-if="variable.inputSource === 'MEASUREMENT'"
                                         :label="variable.variableName"/>
                                <q-select :options="availableFeatures(feature.protocolId, feature.id)"
                                          v-model="variable.sourceFeatureId"
                                          option-value="id" option-label="name" emit-value map-options
                                          v-if="variable.inputSource === 'FEATURE'"
                                          :label="variable.variableName"/>
                              </div>
                              <div class="col-1"/>
                              <div class="col-4">
                                <q-select v-model="variable.inputSource" :options="inputSource" label="Input source"
                                          square/>
                              </div>
                            </div>
                            <div v-else class="row col-12">
                              <div class="col-7">
                                <q-input v-model="variable.sourceMeasColName" :label="variable.variableName"/>
                              </div>
                              <div class="col-1"/>
                              <div class="col-4">
                                <q-select v-model="variable.inputSource" :options="inputSource" label="Input source"
                                          disable square/>
                              </div>
                            </div>
                          </template>
                        </div>
                      </template>
                    </q-field>
                  </div>
                </div>

                <br/>
                <q-input v-model="feature.sequence" label="Sequence" stack-label/>
                <q-input v-model="feature.trigger" label="Trigger" stack-label/>
              </div>
            </q-tab-panel>

            <q-tab-panel name="curve_fitting">
              <div class="col">
                <q-select label="Model" stack-label square
                          v-model="selectedDCRModel" :options="drcModelOptions" option-label="name"
                          @update:model-value="onDRCModelSelection"/>
                <q-input label="Description" stack-label square readonly
                         v-model="drcModelDescription"/>
                <q-select label="Method" stack-label square
                          v-model="feature.drcMethod" :options="dcrModelMethodOptions"/>
                <q-select label="Slope type" stack-label square
                          v-model="feature.drcSlopeType" :options="drcModelSlopeTypesOptions"/>
              </div>
            </q-tab-panel>

            <q-tab-panel name="outlier_detection">
              <div>Not yet implemented!</div>
            </q-tab-panel>
            <q-tab-panel name="hit_calling">
              <div>Not yet implemented!</div>
            </q-tab-panel>
          </q-tab-panels>
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
import drcModelOptions from "../../resources/dose_response_curve_fit_models.json"

const store = useStore()

const props = defineProps(['show', 'originalFeature'])
const emit = defineEmits(['update:show'])

const activeTab = ref('general');

//TODO fix hardcode
const featureTypes = ['CALCULATION', 'NORMALIZATION', 'RAW']
const inputSource = ['MEASUREMENT', 'FEATURE']

const drcModelDescription = ref(null)
const dcrModelMethodOptions = ref(null)
const drcModelSlopeTypesOptions = ref(null)

const selectedDCRModel = ref(null)

const onDRCModelSelection = () => {
  drcModelDescription.value = selectedDCRModel.value.description
  dcrModelMethodOptions.value = selectedDCRModel.value.methods
  drcModelSlopeTypesOptions.value = selectedDCRModel.value.slopeTypes
}

const formulas = computed(() => store.getters['calculations/getFormulas']())
const feature = ref( props.originalFeature )

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
previous.list = originalFeature.civs
variables.list = originalFeature.civs

const selectedFormula = computed(() => store.getters['calculations/getFormula'](feature.value.formulaId))
const formulaInputs = ref(feature.value.civs)

const onFormulaSelection = () => {
  if (selectedFormula.value) {
    store.dispatch('calculations/getFormulaInputs', selectedFormula.value.id).then(() => {
      formulaInputs.value = store.getters['calculations/getFormulaInputs'](selectedFormula.value.id) || []
    })
  }
}

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

//Watch for changes and update lists accordingly
watch(formulaInputs, (i) => {
  variables.list = i.map(i => {
    return {variableName: i, inputSource: 'MEASUREMENT', sourceMeasColName: undefined, sourceFeatureId: undefined}
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
