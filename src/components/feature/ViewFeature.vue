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
              <div class="self-center full-width no-outline" tabindex="0">{{feature.name}}</div>
            </template>
          </q-field>
          <q-field label="Alias" stack-label dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{feature.alias}}</div>
            </template>
          </q-field>
          <q-field label="Description" stack-label dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{feature.description}}</div>
            </template>
          </q-field>
          <q-field label="Format" placeholder="#.##" stack-label dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{feature.format}}</div>
            </template>
          </q-field>
        </q-tab-panel>

        <q-tab-panel name="calculation" label="calculation" class="q-pa-md">
          <div class="col">
            <q-field label="Sequence" stack-label dense>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{feature.sequence}}</div>
              </template>
            </q-field>

            <q-field label="Formula" stack-label dense>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{feature.formula?.name}}</div>
              </template>
            </q-field>

            <div v-if="(feature.civs.length > 0)" class="q-pt-sm">
              <q-card square>
                <q-card-section class="q-pa-sm">
                  <div class="text-grey-7 text-subtitle-2">Formula Variables</div>
                  <q-separator/>
                  <template :key="variable.variableName" v-for="variable in feature.civs">
                    <div class="row">
                      <div class="col-1 self-center">
                        <q-chip square dense>{{ variable.variableName }}</q-chip>
                      </div>
                      <div class="col-4 on-right">
                        <q-field label="Source" stack-label dense>
                          <template v-slot:control>
                            <div class="self-center full-width no-outline" tabindex="0">{{variable.inputSource}}</div>
                          </template>
                        </q-field>
                      </div>
                      <div class="col-4 on-right">
                        <q-field label="Name" stack-label dense>
                          <template v-slot:control>
                            <div v-if="variable.sourceFeatureId" class="self-center full-width no-outline" tabindex="0">{{protocolStore.getFeatureById(variable.sourceFeatureId).name}}</div>
                            <div v-if="!variable.sourceFeatureId" class="self-center full-width no-outline" tabindex="0">{{variable.sourceMeasColName}}</div>
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
                <div class="self-center full-width no-outline" tabindex="0">{{feature.drcModel?.name}}</div>
              </template>
            </q-field>
            <q-field label="Description" stack-label dense>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{feature.drcModel?.description}}</div>
              </template>
            </q-field>
            <q-field label="Method" stack-label dense>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{feature.drcModel?.method}}</div>
              </template>
            </q-field>
            <q-field label="Slope type" stack-label dense>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{feature.drcModel?.slope}}</div>
              </template>
            </q-field>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import { useProtocolStore} from "@/stores/protocol";
  import { useFeatureStore } from "@/stores/feature";

  const protocolStore = useProtocolStore()
  const featureStore = useFeatureStore()

  const props = defineProps(['show', 'feature'])
  const emit = defineEmits('update:show')

  const activeTab = ref('general');
</script>
