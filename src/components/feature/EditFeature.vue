<template>
  <div>
    <oa-section title="Edit Feature" icon="edit">
      <q-card-section class="q-pa-sm">

        <q-tabs v-model="activeTab" align="left" class="q-px-sm oa-section-title" inline-label dense no-caps>
          <q-tab name="general" icon="info" label="General Info"/>
          <q-tab name="calculation" icon="functions" label="Calculation"/>
          <q-tab name="curve_fitting" icon="show_chart" label="Dose-Response Curve"/>
        </q-tabs>

        <div class="row oa-section-body">
          <q-tab-panels v-model="activeTab" animated style="width: 100%">
            <q-tab-panel name="general" label="General Info" class="col q-pa-sm">
              <q-input v-model="featureStore.feature.name" label="Name" stack-label dense autofocus/>
              <q-input v-model="featureStore.feature.alias" label="Alias" stack-label dense/>
              <q-input v-model="featureStore.feature.description" label="Description" stack-label dense/>
              <q-input v-model="featureStore.feature.format" label="Format" placeholder="#.##" stack-label dense/>
            </q-tab-panel>

            <q-tab-panel name="calculation" label="calculation" class="q-pa-sm">
              <div class="col">
                <q-input v-model="featureStore.feature.sequence" label="Sequence" stack-label dense/>

                <q-select v-model="featureStore.feature.formula" label="Formula" stack-label dense
                          :options="formulas" option-value="id" option-label="name"
                          @filter="filterFormulas" use-input
                          @update:model-value="onFormulaSelection">
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.name }}</q-item-label>
                        <q-item-label caption>{{ scope.opt.versionNumber }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>

                <div v-if="(formulaInputs.length > 0)" class="q-pt-sm">
                  <q-card square>
                    <q-card-section class="q-pa-sm">
                      <div class="text-grey-7 text-subtitle-2">Formula Variables</div>
                      <q-separator/>
                      <template :key="variable.variableName" v-for="variable in formulaInputs">
                        <div class="row">
                          <div class="col-1 self-center">
                            <q-chip square dense>{{ variable.variableName }}</q-chip>
                          </div>
                          <div class="col-4 on-right">
                            <q-select v-model="variable.inputSource" :options="inputSource" label="Source" dense/>
                          </div>
                          <div class="col-4 on-right">
                            <q-select v-if="variable.inputSource === 'FEATURE'"
                              v-model="variable.sourceFeatureId"
                              :options="availableFeatures()"
                              option-value="id" option-label="name"
                              emit-value map-options label="Name" dense/>
                            <q-input v-else v-model="variable.sourceMeasColName" label="Name" dense/>
                          </div>
                        </div>
                      </template>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="curve_fitting" class="q-pa-sm">
              <div class="col">
                <q-select label="Model" v-model="selectedDCRModel"
                          :options="drcModelOptions" option-label="name"
                          @update:model-value="onDRCModelSelection" stack-label dense/>
                <q-input label="Description" stack-label dense readonly v-model="drcModel.description"/>
                <div v-for="(input, index) in selectedDCRModel.inputParameters" :key="index">
                  <q-select v-if="input.type === 'option'" :label="input.label"
                            v-model="drcModel.inputParameters[input.name]" :options="input.options"
                            stack-label dense/>
                  <q-input v-if="input.type === 'numeric' || input.type === 'string'" :label="input.label"
                           v-model="drcModel.inputParameters[input.name]" stack-label dense/>
                  <q-checkbox v-if="input.type === 'boolean'" :label="input.label"
                              v-model="drcModel.inputParameters[input.name]"
                              true-value="true" false-value="false" left-label dense/>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
        <div class="row justify-end">
          <q-btn flat class="on-left" label="Cancel" color="primary" @click="onCancel"/>
          <q-btn label="Apply" v-close-popup color="primary" @click="editFeature"/>
        </div>
      </q-card-section>
    </oa-section>
  </div>
</template>

<script setup>
  import { computed, ref} from "vue";
  import { useProtocolStore } from "@/stores/protocol";
  import { useFormulasStore } from "@/stores/formulas";
  import { useFeatureStore } from "@/stores/feature";
  import drcModelOptions from "@/resources/dose_response_curve_fit_models.json"
  import OaSection from "@/components/widgets/OaSection";
  import ArrayUtils from "@/lib/ArrayUtils";

  const protocolStore = useProtocolStore();
  const formulasStore = useFormulasStore()
  const featureStore = useFeatureStore()

  const props = defineProps(['show'])
  const emit = defineEmits(['update:show'])

  const activeTab = ref('general');

  //TODO fix hardcode
  const inputSource = ['MEASUREMENT_WELL_COLUMN', 'MEASUREMENT_SUBWELL_COLUMN', 'FEATURE']

  const formulaInputs = ref(featureStore.feature.civs)
  const selectedDCRModel = drcModelOptions.find(drcModel => drcModel.name === featureStore.feature.drcModel.name)
  const drcModel = ref(featureStore.feature.drcModel)

  const onDRCModelSelection = (selected) => {
    drcModel.value = {
      "name": selected.name,
      "description": selected.description,
      "inputParameters": {}
    }

    for (let i in selected.inputParameters) {
      const input = selected.inputParameters[i]
      if (input.type === 'boolean')
        drcModel.value.inputParameters[selected.inputParameters[i].name] = false
      else
        drcModel.value.inputParameters[selected.inputParameters[i].name] = null
    }
  }

  const formulaFilter = ref('');
  const formulas = computed(() => ArrayUtils.sortBy([...formulasStore.formulas].filter(f => f.name.toLowerCase().includes(formulaFilter.value)), 'name'));
  const filterFormulas = (val, update) => update(() => formulaFilter.value = val);

  const availableFeatures = () => {
    return protocolStore.getFeatures().filter((f) => { return f.id !== featureStore.feature.id && f.name !== featureStore.feature.name })
  }

  const onFormulaSelection = (args) => {
    if (!args) return;
    formulasStore.loadFormulaInputs(args.id).then(() => {
      formulaInputs.value = formulasStore.formulaInputs[args.id].map(i => {
        return {
          variableName: i,
          inputSource: inputSource[0],
          sourceMeasColName: undefined,
          sourceFeatureId: undefined,
          featureId: featureStore.feature.id,
          formulaId: args.id
        }
      })
    })
  }

  //Function to fire an edit event of a feature using the working copy
  const editFeature = () => {
    featureStore.feature.formulaId = featureStore.feature.formula.id
    featureStore.feature.civs = formulaInputs.value
    featureStore.feature.drcModel = drcModel.value

    emit('update:show', false)
  }

  const onCancel = () => {
    featureStore.$reset()
    emit('update:show', false)
  }
</script>
