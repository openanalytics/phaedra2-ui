<template>
  <div class="q-pa-md">
    <oa-section-header :title="featureStore.feature.name" :icon="'view'"/>
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
                  <div class="self-center full-width no-outline" tabindex="0">{{featureStore.feature.name}}</div>
                </template>
              </q-field>
              <q-field label="Alias" stack-label square>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{featureStore.feature.alias}}</div>
                </template>
              </q-field>
              <q-field label="Description" stack-label square>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{featureStore.feature.description}}</div>
                </template>
              </q-field>
              <q-field label="Format" placeholder="#.##" stack-label square>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{featureStore.feature.format}}</div>
                </template>
              </q-field>
              <q-field label="Type" stack-label square>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{featureStore.feature.type}}</div>
                </template>
              </q-field>
            </q-tab-panel>
            <q-tab-panel name="calculation" label="calculation">
              <div class="q-pa-xs col">
                <q-field label="Formula" stack-label square>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{featureStore.feature.formula.name}}</div>
                  </template>
                </q-field>
                <div v-if="(featureStore.feature.civs.length > 0)">
                  <div>
                    <q-field label="Formula variables" stack-label borderless>
                      <template v-slot:control>
                        <div class="row col-12">
                          <template :key="variable.variableName" v-for="variable in featureStore.feature.civs">
                              <div class="col-7">
                                <q-field :label="variable.variableName" stack-label square>
                                  <template v-slot:control>
                                    <div v-if="variable.sourceFeatureId" class="self-center full-width no-outline" tabindex="0">{{protocolStore.getFeatureById(variable.sourceFeatureId).name}}</div>
                                    <div v-if="!variable.sourceFeatureId" class="self-center full-width no-outline" tabindex="0">{{variable.sourceMeasColName}}</div>
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
                    <div class="self-center full-width no-outline" tabindex="0">{{featureStore.feature.sequence}}</div>
                  </template>
                </q-field>
                <q-field label="Trigger" stack-label square>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{featureStore.feature.trigger}}</div>
                  </template>
                </q-field>
              </div>
            </q-tab-panel>

            <q-tab-panel name="curve_fitting">
              <div class="col">
                <q-field label="Model" stack-label square>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{featureStore.feature.drcModel.name}}</div>
                  </template>
                </q-field>
                <q-field label="Description" stack-label square>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{featureStore.feature.drcModel.description}}</div>
                  </template>
                </q-field>
                <q-field label="Method" stack-label square>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{featureStore.feature.drcModel.method}}</div>
                  </template>
                </q-field>
                <q-field label="Slope type" stack-label square>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{featureStore.feature.drcModel.slope}}</div>
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
          <q-btn flat class="on-left" label="Cancel" color="primary" @click="onCancel"/>
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<script setup>

import { ref } from "vue";
import { useProtocolStore} from "@/stores/protocol";
import { useFeatureStore } from "@/stores/feature";
import OaSectionHeader from "../widgets/OaSectionHeader";

const protocolStore = useProtocolStore()
const featureStore = useFeatureStore()

const props = defineProps(['show', 'feature'])
const emit = defineEmits('update:show')

const activeTab = ref('general');

const onCancel = () => {
  featureStore.$reset()
  emit('update:show', false)
}

</script>