<template>
  <div>
    <q-toolbar class="oa-section-title">
      <q-tabs v-model="activeTab" align="left" inline-label dense no-caps>
        <q-tab name="general" icon="info" label="General Info"/>
        <q-tab name="calculation" icon="functions" label="Calculation"/>
        <q-tab name="curve_fitting" icon="show_chart" label="Dose-Response Curve"/>
      </q-tabs>
    </q-toolbar>

    <div class="row oa-section-body">
      <q-tab-panels v-model="activeTab" animated style="width: 100%">

        <q-tab-panel name="general" label="General Info" class="col q-pa-md">
          <q-field label="Name" stack-label dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ featureStore.feature.name }}
              </div>
            </template>
          </q-field>
          <q-field label="Alias" stack-label dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ featureStore.feature.alias }}
              </div>
            </template>
          </q-field>
          <q-field label="Description" stack-label dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ featureStore.feature.description }}
              </div>
            </template>
          </q-field>
          <q-field label="Format" placeholder="#.##" stack-label dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ featureStore.feature.format }}
              </div>
            </template>
          </q-field>
        </q-tab-panel>

        <q-tab-panel name="calculation" label="calculation" class="q-pa-md">
          <div class="col">
            <q-field label="Sequence" stack-label dense>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ featureStore.feature.sequence }}
                </div>
              </template>
            </q-field>

            <q-field label="Formula" stack-label dense>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ featureStore.feature.formula?.name }} (v{{ featureStore.feature.formula?.versionNumber }})
                </div>
              </template>
            </q-field>

            <div v-if="(featureStore.feature.civs.length > 0)" class="q-pt-sm">
              <q-card square>
                <q-card-section class="q-pa-sm">
                  <div class="text-grey-7 text-subtitle-2">Formula Variables</div>
                  <q-separator class="q-mb-sm"/>
                  <template :key="variable.variableName" v-for="variable in featureStore.feature.civs">
                    <div class="row">
                      <div class="col-1 self-center">
                        <q-chip square dense>
                          {{ variable.variableName }}
                        </q-chip>
                      </div>
                      <div class="col-4 on-right">
                        <q-field label="Source" stack-label dense>
                          <template v-slot:control>
                            <div class="self-center full-width no-outline" tabindex="0">
                              {{ variable.inputSource }}
                            </div>
                          </template>
                        </q-field>
                      </div>
                      <div class="col-4 on-right">
                        <q-field label="Name" stack-label dense>
                          <template v-slot:control>
                            <div v-if="variable.sourceFeatureId" class="self-center full-width no-outline" tabindex="0">
                              {{ protocolStore.getFeatureById(variable.sourceFeatureId).name }}
                            </div>
                            <div v-if="!variable.sourceFeatureId" class="self-center full-width no-outline"
                                 tabindex="0">
                              {{ variable.sourceMeasColName }}
                            </div>
                          </template>
                        </q-field>
                      </div>
                    </div>
                  </template>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="curve_fitting" class="q-pa-md">
          <div class="col">
            <q-field label="Model" stack-label dense>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ featureStore.feature.drcModel?.name }}
                </div>
              </template>
            </q-field>
            <q-field label="Description" stack-label dense>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ featureStore.feature.drcModel?.description }}
                </div>
              </template>
            </q-field>

            <div class="q-pt-sm">
              <q-card square>
                <q-card-section class="q-pa-sm">
                  <div class="text-grey-7 text-subtitle-2">Input Parameters</div>
                  <q-separator class="q-mb-sm"/>
                  <div v-if="featureStore.feature.drcModel !== null">
                    <div v-for="(input, index) in selectedDCRModel.inputParameters" :key="index">
                      <q-field :label="input.label" stack-label dense>
                        <template v-slot:control>
                          <div class="self-center full-width no-outline" tabindex="0">
                            {{
                              featureStore.feature.drcModel.inputParameters.find(inParam => inParam.name === input.name)?.value
                            }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <div class="row col-12 justify-end">
        <div class="q-pa-md">
          <q-btn flat class="on-left" label="Cancel" color="primary" @click="onCancel"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {useProtocolStore} from "@/stores/protocol";
import {useFeatureStore} from "@/stores/feature";
import drcModelOptions from "@/resources/dose_response_curve_fit_models.json"

defineProps(['show'])
const emit = defineEmits(['cancel'])

const protocolStore = useProtocolStore()
const featureStore = useFeatureStore()

const selectedDCRModel = drcModelOptions.find(drcModel => drcModel.name === featureStore.feature.drcModel?.name) ?? ''

const activeTab = ref('general');

const onCancel = () => {
  emit('cancel')
}
</script>
