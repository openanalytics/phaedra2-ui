<template>
  <div>
    <oa-section title="Edit Feature" icon="edit">
      <q-card-section>
        <q-tabs v-model="activeTab" align="left" class="q-px-sm oa-section-title" inline-label dense no-caps>
          <q-tab name="general" icon="info" label="General Info"/>
          <q-tab name="calculation" icon="functions" label="Calculation"/>
          <q-tab name="curve_fitting" icon="show_chart" label="Dose-Response Curve Fitting"/>
          <!-- <q-tab name="outlier_detection" icon="sms_failed" label="Outlier Detection"/>
          <q-tab name="hit_calling" icon="rules" label="Hit Calling"/> -->
        </q-tabs>

        <div class="row oa-section-body">
          <q-tab-panels v-model="activeTab" animated style="width: 100%">
            <q-tab-panel name="general" label="General Info" class="col">
              <q-input v-model="featureStore.feature.name" label="Name" stack-label square autofocus/>
              <q-input v-model="featureStore.feature.alias" label="Alias" stack-label square/>
              <q-input v-model="featureStore.feature.description" label="Description" stack-label square/>
              <q-input v-model="featureStore.feature.format" label="Format" placeholder="#.##" stack-label square/>
            </q-tab-panel>
            <q-tab-panel name="calculation" label="calculation">
              <div class="q-pa-xs col">
                <q-select v-model="featureStore.feature.formula" label="Formula" stack-label
                          :options="formulas" option-value="id" option-label="name" @update:model-value="onFormulaSelection"/>
                <div v-if="(formulaInputs.length > 0)">
                  <q-field label="Formula variables" stack-label borderless>
                    <template v-slot:control>
                      <div class="row col-12">
                        <template :key="variable.variableName" v-for="variable in formulaInputs">
                          <div class="row col-12 q-col-gutter-sm">
                            <div class="col-8">
                              <q-select v-if="variable.inputSource === 'FEATURE'" :options="availableFeatures(newFeature)"
                                        v-model="variable.sourceFeatureId" option-value="id" option-label="name" emit-value map-options
                                        :label="variable.variableName"/>
                              <q-input v-else v-model="variable.sourceMeasColName" :label="variable.variableName"/>
                            </div>
                            <div class="col-4">
                              <q-select v-model="variable.inputSource" :options="inputSource" label="Input source" square/>
                            </div>
                          </div>
                        </template>
                      </div>
                    </template>
                  </q-field>
                </div>
                <q-input v-model="featureStore.feature.sequence" label="Sequence" stack-label/>
              </div>
            </q-tab-panel>

            <q-tab-panel name="curve_fitting">
              <div class="col">
                <q-select label="Model" stack-label square
                          v-model="drcModel.name" :options="drcModelOptions" option-label="name" option-value="name"
                          @update:model-value="onDRCModelSelection"/>
                <q-input label="Description" stack-label square readonly
                        v-model="drcModel.description"/>
                <q-select label="Method" stack-label square
                          v-model="drcModel.method" :options="dcrModelMethodOptions"/>
                <q-select label="Slope type" stack-label square
                          v-model="drcModel.slope" :options="drcModelSlopeTypesOptions"/>
              </div>
            </q-tab-panel>

            <!-- <q-tab-panel name="outlier_detection">
              <div>Not yet implemented!</div>
            </q-tab-panel>
            <q-tab-panel name="hit_calling">
              <div>Not yet implemented!</div>
            </q-tab-panel> -->
          </q-tab-panels>
        </div>
        <br>
        <div class="row justify-end">
          <q-btn flat class="on-left" label="Cancel" color="primary" @click="onCancel"/>
          <q-btn label="Edit feature" v-close-popup color="primary" @click="editFeature"/>
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

  const protocolStore = useProtocolStore();
  const formulasStore = useFormulasStore()
  const featureStore = useFeatureStore()

  const props = defineProps(['show'])
  const emit = defineEmits(['update:show'])

  const activeTab = ref('general');

  //TODO fix hardcode
  const inputSource = ['MEASUREMENT_WELL_COLUMN', 'MEASUREMENT_SUBWELL_COLUMN', 'FEATURE']

  const drcModel = ref({
    name: featureStore.feature.drcModel?.name,
    description: featureStore.feature.drcModel?.description,
    method: featureStore.feature.drcModel?.method,
    slope: featureStore.feature.drcModel?.slope
  })
  const dcrModelMethodOptions = ref(null)
  const drcModelSlopeTypesOptions = ref(null)
  const formulaInputs = ref(featureStore.feature.civs)

  const onDRCModelSelection = (args) => {
    drcModel.value.name = args.name
    drcModel.value.description = args.description
    dcrModelMethodOptions.value = args.methods
    drcModelSlopeTypesOptions.value = args.slopeTypes
  }

  const formulas = computed(() => formulasStore.formulas);

  const availableFeatures = (feature) => {
    return protocolStore.getFeatures().filter((f) => { return f.id !== feature.id && f.name !== feature.name })
  }

  const onFormulaSelection = (args) => {
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
    // if (featureStore.feature.formulaId !== featureStore.feature.formula.id) {
      featureStore.feature.formulaId = featureStore.feature.formula.id
      featureStore.feature.civs = formulaInputs.value
    // }
    if (drcModel.value.name !== null) {
      featureStore.feature.drcModel = drcModel.value;
      featureStore.feature.drcModel.featureId = featureStore.feature.id;
    }


    emit('update:show', false)
  }

  const onCancel = () => {
    featureStore.$reset()
    emit('update:show', false)
  }
</script>
