<template>
  <div class="q-pa-md">
    <oa-section-header :title="feature.name" :icon="'view'"/>
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
              <q-field label="Name" stack-label square autofocus>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{feature.name}}</div>
                </template>
              </q-field>
              <q-field label="Alias" stack-label square>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{feature.alias}}</div>
                </template>
              </q-field>
              <q-field label="Description" stack-label square>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{feature.description}}</div>
                </template>
              </q-field>
              <q-field label="Format" placeholder="#.##" stack-label square>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{feature.format}}</div>
                </template>
              </q-field>
              <q-field label="Type" stack-label square>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{feature.type}}</div>
                </template>
              </q-field>
            </q-tab-panel>
            <q-tab-panel name="calculation" label="calculation">
              <div class="q-pa-xs col">
                <q-field label="Formula" stack-label square>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{selectedFormula.name}}</div>
                  </template>
                </q-field>
                <div v-if="(variables.length > 0)">
                  <div>
                    <q-field label="Formula variables" stack-label borderless>
                      <template v-slot:control>
                        <div class="row col-12">
                          <template :key="variable.variableName" v-for="variable in variables">
                              <div class="col-7">
                                <q-field :label="variable.variableName" stack-label square>
                                  <template v-slot:control>
                                    <div class="self-center full-width no-outline" tabindex="0">{{variable.sourceMeasColName}}</div>
                                  </template>
                                </q-field>
                              </div>
                              <div class="col-1"/>
                              <div class="col-4">
                                <q-field label="Input source" stack-label square>
                                  <template v-slot:control>
                                    <div class="self-center full-width no-outline" tabindex="0">{{variable.inputSource}}</div>
                                  </template>
                                </q-field>
                              </div>
                          </template>
                        </div>
                      </template>
                    </q-field>
                  </div>
                </div>

                <br/>
                <q-field label="Sequence" stack-label square>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{feature.sequence}}</div>
                  </template>
                </q-field>
                <q-field label="Trigger" stack-label square>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{feature.trigger}}</div>
                  </template>
                </q-field>
              </div>
            </q-tab-panel>

            <q-tab-panel name="curve_fitting">
              <div class="col">
                <q-field label="Model" stack-label square>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{selectedDCRModel.name}}</div>
                  </template>
                </q-field>
                <q-field label="Description" stack-label square>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{selectedDCRModel.description}}</div>
                  </template>
                </q-field>
                <q-field label="Method" stack-label square>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{selectedDCRModel.method}}</div>
                  </template>
                </q-field>
                <q-field label="Slope type" stack-label square>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{selectedDCRModel.slopeType}}</div>
                  </template>
                </q-field>
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
<!--          <q-btn label="Edit feature" v-close-popup color="primary" @click="editFeature"/>-->
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

const props = defineProps(['show', 'feature'])

const activeTab = ref('general');

//TODO fix hardcode
const featureTypes = ['CALCULATION', 'NORMALIZATION', 'RAW']
const inputSource = ['MEASUREMENT', 'FEATURE']

const feature = computed(() => props.feature)
const selectedFormula = computed(() => store.getters['calculations/getFormula'](props.feature.formulaId))
const variables = computed(() => props.feature.civs)
const selectedDCRModel = computed(() => props.feature.drcModel)

//Watch for changes and update lists accordingly
// variables.list = feature.value.civs
// watch(formulaInputs, (i) => {
//   variables.list = i.map(i => {
//     return {variableName: i, inputSource: 'MEASUREMENT', sourceMeasColName: undefined, sourceFeatureId: undefined}
//   })
// })

// const formulaInputs = ref(feature.value.civs)



</script>
