<template>
  <div>
    <oa-section title="New Feature" icon="edit">
      <q-card-section class="q-pa-sm">

        <q-tabs v-model="activeTab" align="left" class="q-px-sm oa-section-title" inline-label dense no-caps>
          <q-tab name="general" icon="info" label="General Info"/>
          <q-tab name="calculation" icon="functions" label="Calculation"/>
          <q-tab name="curve_fitting" label="Dose-Response Curve"/>
        </q-tabs>

        <div class="row oa-section-body">
          <q-tab-panels v-model="activeTab" animated style="width: 100%">

            <q-tab-panel name="general" label="General Info" class="col q-pa-sm">
              <q-input v-model="newFeature.name" label="Name" stack-label dense autofocus/>
              <q-input v-model="newFeature.alias" label="Alias" stack-label dense/>
              <q-input v-model="newFeature.description" label="Description" stack-label dense/>
              <q-input v-model="newFeature.format" label="Format" placeholder="#.##" stack-label dense/>
            </q-tab-panel>

            <q-tab-panel name="calculation" label="calculation" class="q-pa-sm">
              <div class="q-pa-xs col">
                <q-select v-model="selectedFormula" label="Formula" stack-label dense
                          :options="formulas" option-value="id" option-label="name" @update:model-value="onFormulaSelection"/>
                <div v-if="(variables.list.length > 0)">
                  <div>
                    <q-field label="Formula variables:" stack-label borderless dense class="q-pt-sm">
                      <template v-slot:control>
                        <div class="row col-8">
                          <template :key="variable.variableName" v-for="variable in variables.list">
                              <div class="col-4">
                                <q-select v-if="variable.inputSource === 'FEATURE'" :options="availableFeatures(newFeature)"
                                          v-model="variable.sourceFeatureId" option-value="id" option-label="name" emit-value map-options
                                          :label="variable.variableName"/>
                                <q-input v-else v-model="variable.sourceMeasColName" :label="variable.variableName"/>
                              </div>
                              <div class="col-1"/>
                              <div class="col-4">
                                <q-select v-model="variable.inputSource" :options="inputSource" label="Source" dense/>
                              </div>
                          </template>
                        </div>
                      </template>
                    </q-field>
                  </div>
                </div>
                <q-input v-model="newFeature.sequence" label="Sequence" stack-label dense/>
              </div>
            </q-tab-panel>

            <q-tab-panel name="curve_fitting" class="q-pa-sm">
              <div class="col">
                <q-select label="Model" v-model="selectedDCRModel"
                          :options="drcModelOptions" option-label="name"
                          @update:model-value="onDRCModelSelection" stack-label dense/>
                <q-input label="Description" stack-label dense readonly v-model="selectedDCRModel.description"/>
                <div v-for="(input, index) in selectedDCRModel.inputParameters" :key="index">
                  <q-select v-if="input.type === 'option'" :label="input.label"
                            v-model="newFeature.drcModel.inputParameters[input.name]" :options="input.options" stack-label dense/>
                  <q-input v-if="input.type === 'numeric' || input.type === 'string'" :label="input.label"
                           v-model="newFeature.drcModel.inputParameters[input.name]" stack-label dense/>
                  <q-checkbox v-if="input.type === 'boolean'" :label="input.label"
                              v-model="newFeature.drcModel.inputParameters[input.name]"
                              left-label dense/>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>

        <div class="row justify-end">
          <q-btn flat label="Cancel" color="primary" @click="$emit('update:show',false)"/>
          <q-btn align="right" label="Add feature" v-close-popup color="primary" @click="addFeature"/>
        </div>
      </q-card-section>
    </oa-section>
  </div>
</template>

<script setup>
  import {computed, reactive, ref, watch} from "vue";
  import {useProtocolStore} from "@/stores/protocol";
  import {useFormulasStore} from "@/stores/formulas";
  import OaSection from "@/components/widgets/OaSection";
  import drcModelOptions from "@/resources/dose_response_curve_fit_models.json"

  const protocolStore = useProtocolStore()
  const formulasStore = useFormulasStore()

  const props = defineProps(['show', 'protocol'])
  const emit = defineEmits(['update:show', 'addFeature'])

  const newFeature = ref({
    name: null,
    alias: null,
    description: null,
    format: null,
    type: 'CALCULATION',
    sequence: 0,
    protocolId: props.protocol.id ? props.protocol.id : null,
    formulaId: null,
    drcModel: null,
    civs: null,
    formula: null,
    trigger: null
  })
  const activeTab = ref('general');

  //TODO fix hardcode
  const inputSource = ['MEASUREMENT_WELL_COLUMN', 'MEASUREMENT_SUBWELL_COLUMN', 'FEATURE']

  const selectedDCRModel = ref({
    "name": "",
    "description": ""
  })

  const onDRCModelSelection = (selected) => {
    newFeature.value.drcModel = {
      "name": selected.name,
      "description": selected.description,
      "inputParameters": {}
    }

    for (let i in selected.inputParameters) {
      const input = selected.inputParameters[i]
      if (input.type === 'boolean')
        newFeature.value.drcModel.inputParameters[selected.inputParameters[i].name] = false
    }
    console.log("newFeature.drcModel: " + JSON.stringify(newFeature.value.drcModel))
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

  const availableFeatures = (feature) => {
    return protocolStore.getFeatures().filter((f) => { return f.id !== feature.id && f.name !== feature.name })
  }

  const formulas = computed(() => (formulasStore.formulas || []).sort((f1, f2) => f1.name.localeCompare(f2.name)));
  const formulaInputs = ref(null);
  const selectedFormula = ref(null);

  const onFormulaSelection = async () => {
    if (!selectedFormula.value) return;
    await formulasStore.loadFormulaInputs(selectedFormula.value.id);
    formulaInputs.value = formulasStore.formulaInputs[selectedFormula.value.id].map(i => {
      return {
        variableName: i,
        inputSource: inputSource[0],
        sourceMeasColName: undefined,
        sourceFeatureId: undefined,
        featureId: newFeature.value.id,
        formulaId: selectedFormula.value.id
      }
    });
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
