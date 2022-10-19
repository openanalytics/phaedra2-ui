<template>
  <div class="q-pa-md">
    <oa-section-header :title="'New Feature'" :icon="'edit'"/>
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
              <q-input v-model="newFeature.name" label="Name" stack-label square autofocus/>
              <q-input v-model="newFeature.alias" label="Alias" stack-label square/>
              <q-input v-model="newFeature.description" label="Description" stack-label square/>
              <q-input v-model="newFeature.format" label="Format" placeholder="#.##" stack-label square/>
              <q-select v-model="newFeature.type" label="Type" :options="featureTypes" stack-label square
                        @update:model-value="onFeatureTypeSelection"/>
            </q-tab-panel>

            <q-tab-panel name="calculation" label="calculation">
              <div class="q-pa-xs col">
                <q-select v-model="selectedFormula" label="Formula" stack-label
                          v-if="!isRaw(newFeature.type)"
                          :options="formulas.filter(formula => isCalculation(newFeature.type, formula.category))"
                          option-value="id" option-label="name" @update:model-value="onFormulaSelection"/>
                <div v-if="(variables.list.length > 0)">
                  <div>
                    <q-field label="Formula variables" stack-label borderless>
                      <template v-slot:control>
                        <div class="row col-12">
                          <template :key="variable.variableName" v-for="variable in variables.list">
                            <div v-if="!isRaw(newFeature.type)" class="row col-12">
                              <div class="col-7">
                                <q-input v-model="variable.sourceMeasColName"
                                         v-if="variable.inputSource === 'MEASUREMENT'"
                                         :label="variable.variableName"/>
                                <q-select :options="availableFeatures(newFeature)"
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
                                <q-input v-model="variable.inputSource" :options="inputSource" label="Input source"
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
                <q-input v-model="newFeature.sequence" label="Sequence" stack-label/>
                <q-input v-model="newFeature.trigger" label="Trigger" stack-label/>
              </div>
            </q-tab-panel>
            <q-tab-panel name="curve_fitting">
              <div class="col">
                <q-select label="Model" v-model="newFeature.drcModel.name"
                          :options="drcModelOptions" option-label="name"
                          @update:model-value="onDRCModelSelection" stack-label square/>
                <q-input label="Description" stack-label square readonly
                         v-model="newFeature.drcModel.description"/>
                <q-select label="Method" stack-label square
                          v-model="newFeature.drcModel.method" :options="dcrModelMethodOptions"/>
                <q-select label="Slope type" stack-label square
                          v-model="newFeature.drcModel.slope" :options="drcModelSlopeTypesOptions"/>
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
          <q-btn flat label="Cancel" color="primary" @click="$emit('update:show',false)"/>
          <q-btn align="right" label="Add feature" v-close-popup color="primary" @click="addFeature"/>
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<script setup>

import {computed, reactive, ref, watch} from "vue";
import {useProtocolStore} from "@/stores/protocol";
import {useFormulasStore} from "@/stores/formulas";
import OaSectionHeader from "@/components/widgets/OaSectionHeader";
import drcModelOptions from "@/resources/dose_response_curve_fit_models.json"

const protocolStore = useProtocolStore()
const formulasStore = useFormulasStore()

const props = defineProps(['show', 'protocol'])
const emit = defineEmits(['update:show', 'addFeature'])

const newFeature = ref({
  name: null,
  alias: null,
  description: null,
  format: '#.##',
  type: null,
  sequence: 0,
  protocolId: props.protocol.id ? props.protocol.id : null,
  formulaId: null,
  drcModel: null,
  // drcModel: {
  //   name: null,
  //   description: null,
  //   method: null,
  //   slope: null
  // },
  civs: null,
  formula: null,
  trigger: null
})
const activeTab = ref('general');

//TODO fix hardcode
const featureTypes = ['CALCULATION', 'NORMALIZATION', 'RAW']
const inputSource = ['MEASUREMENT', 'FEATURE']

const dcrModelMethodOptions = ref(null)
const drcModelSlopeTypesOptions = ref(null)

const onDRCModelSelection = (selectedDCRModel) => {
  newFeature.value.drcModel.name = selectedDCRModel.name
  newFeature.value.drcModel.description = selectedDCRModel.description

  dcrModelMethodOptions.value = selectedDCRModel.methods
  drcModelSlopeTypesOptions.value = selectedDCRModel.slopeTypes
}

const addFeature = () => {
  newFeature.value.formulaId = selectedFormula.value.id
  newFeature.value.formula = {
    ...selectedFormula.value
  }
  newFeature.value.civs = variables.list
  protocolStore.addFeature(newFeature.value)
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

const availableFeatures = (feature) => {
  return protocolStore.getFeatures().filter((f) => { return f.id !== feature.id && f.name !== feature.name })
}

const formulas = computed(() => formulasStore.formulas)
const formulaInputs = ref(null)

const onFeatureTypeSelection = () => {
  if (isRaw(newFeature.value.type)) {
    const copyRawDataFormulaId = 75;
    newFeature.value.sequence = 0
    selectedFormula.value = formulasStore.getFormulaById(copyRawDataFormulaId)
    // formulaInputs.value = formulasStore.getFormulaInputsByFormulaId(copyRawDataFormulaId) || []
    formulasStore.loadFormulaInputs(copyRawDataFormulaId).then(() => {
      formulaInputs.value = formulasStore.formulaInputs[copyRawDataFormulaId].map(i => {
        return {
          variableName: i,
          inputSource: 'MEASUREMENT',
          sourceMeasColName: undefined,
          sourceFeatureId: undefined,
          featureId: newFeature.value.id,
          formulaId: copyRawDataFormulaId
        }
      })
      console.log(formulaInputs.value)
    })

    //TODO: retrieve the RAW formula that copies the measurement value
  } else {
    if (formulaInputs.value && formulaInputs.value.length > 0) {
      selectedFormula.value = null
      formulaInputs.value = []
    }
  }
}

//Get formulaInputs and dispatch if it not available
const selectedFormula = ref(null)
const onFormulaSelection = () => {
  if (selectedFormula.value) {
    formulasStore.loadFormulaInputs(selectedFormula.value.id).then(() => {
      formulaInputs.value = formulasStore.formulaInputs[selectedFormula.value.id].map(i => {
        return {
          variableName: i,
          inputSource: 'MEASUREMENT',
          sourceMeasColName: undefined,
          sourceFeatureId: undefined,
          featureId: newFeature.value.id,
          formulaId: selectedFormula.value.id
        }
      })
    })
  }
}

let variables = reactive({list: []})
watch(formulaInputs, (i) => {
  variables.list = i.map(i => {
    return {
      variableName: i.variableName,
      inputSource: i.inputSource,
      sourceMeasColName: i.sourceMeasColName,
      sourceFeatureId: i.sourceFeatureId,
      featureId: newFeature.value.id,
      formulaId: selectedFormula.value.id
    }
  })
})
</script>
