<template>
  <div class="q-pa-md">
    <oa-section-header :title="'Edit Feature'" :icon="'edit'"/>
    <div class="oa-section-body">
      <q-card-section>
        <div class="row">
          <div class="col-5">
            <q-input v-model="feature.name" square autofocus label="Name"></q-input>
            <q-input v-model="feature.alias" square label="Alias"></q-input>
            <q-input v-model="feature.description" square label="Description"></q-input>
            <q-input v-model="feature.format" square label="Format" placeholder="#.##"
                     style="width: 100px"></q-input>
            <q-input v-model="feature.sequence" square label="Sequence"></q-input>
            <q-input v-model="feature.trigger" square label="Trigger"></q-input>
          </div>
          <div class="col-1"/>
          <div class="col-5">
            <q-select v-model="feature.type" square label="Type" :options="featureTypes"></q-select>
            <q-select v-model="feature.formulaId" square label="Formula"
                      :options="formulas.filter(formula => isCalculation(feature.type, formula.category))" option-label="name"
                      option-value="id" map-options></q-select>
            <div v-if="(variables.list.length > 0)">
              <br/>
              <span class="text-primary">Formula variables:</span>
              <div class="row col-12">
                <template :key="variable.variableName"
                          v-for="variable in variables.list">
                  <div class="col-7">
                    <q-input v-model="variable.sourceMeasColName"
                             v-if="variable.sourceInput === 'MEASUREMENT'"
                             :label="variable.variableName"></q-input>
                    <q-select :options="availableFeatures(feature.protocolId, feature.id)"
                              v-model="variable.sourceFeatureId"
                              option-value="id" option-label="name" emit-value map-options
                              v-if="variable.sourceInput === 'FEATURE'"
                              :label="variable.variableName"></q-select>
                  </div>
                  <div class="col-1"/>
                  <div class="col-4">
                    <q-select v-model="variable.sourceInput"
                              :options="inputSource"
                              square label="Input source"></q-select>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <br>
        <div class="row justify-end">
          <q-btn flat label="Cancel" color="primary" @click="$emit('update:show',false)"/>
          <q-btn align="right" label="Edit feature" v-close-popup color="primary" @click="editFeature"/>
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<script>

import {useStore} from "vuex";
import {computed, reactive, ref, watch} from "vue";
import OaSectionHeader from "../widgets/OaSectionHeader";

export default {
  name: 'EditFeature',
  components: {OaSectionHeader},
  methods: {
    isCalculation(featureType, formulaCategory) {
      if (featureType === 'CALCULATION') {
        if (formulaCategory === 'CALCULATION'
            || formulaCategory === 'HIT_CALLING'
            || formulaCategory === 'OUTLIER_DETECTION'
            || formulaCategory === 'POLISHING') {
          return true;
        }
      }
      return false;
    },
    availableFeatures(protocolId, featureId) {
      if (featureId)
        return this.$store.getters['features/getByProtocolId'](protocolId).filter(f => f.id !== featureId)
      return this.$store.getters['features/getByProtocolId'](protocolId);
    }
  },
  setup(props, context) {
    const exported = {}

    const store = useStore()
    exported.formulas = computed(() => store.getters['calculations/getFormulas']())

    exported.feature = ref({})
    //Reactive list that changes when formulaInputs changes
    exported.variables = reactive({list: []})
    exported.previous = reactive({list: []})

    //Make hard copy of feature to edit it later
    const fetchFeatureWorkingCopy = () => {
      let originalFeature = props.originalFeature || {}
      exported.feature.value = {...originalFeature}
      exported.originalFormulaId = ref(originalFeature.formulaId)
      //Fetch previous formula variable names
      store.dispatch('features/getCalculationInputValue',exported.feature.value.id).then(() => {
      const civs = store.getters['features/getCalculationInputValueByFeatureId'](exported.feature.value.id)
        if (civs) {
          //Make full copy of getter + sort alphabetically instead of by date modified
          exported.previous.list = JSON.parse(JSON.stringify(civs)).sort((a, b) => a.variableName.localeCompare(b.variableName))
          exported.previous.list.forEach(f => f['sourceInput'] = f.sourceMeasColName ? 'MEASUREMENT' : 'FEATURE');

          exported.variables.list = JSON.parse(JSON.stringify(civs)).sort((a, b) => a.variableName.localeCompare(b.variableName));
          exported.variables.list.forEach(f => f['sourceInput'] = f.sourceMeasColName ? 'MEASUREMENT' : 'FEATURE');
        }
      })
    }
    fetchFeatureWorkingCopy()

    //Get formulaInputs
    const formulaInputs = computed(() => {
      if (!exported.feature.value.formulaId) return []
      const id = Number.isInteger(exported.feature.value.formulaId) ? exported.feature.value.formulaId:exported.feature.value.formulaId.id
      if(!store.getters['calculations/getFormulaInputs'](id))
        store.dispatch('calculations/getFormulaInputs',id)
      return store.getters['calculations/getFormulaInputs'](id) || []
    })

    //Watch for changes and update lists accordingly
    watch(formulaInputs, (f) => {
      exported.variables.list = f.map(i => {
        return {
          variableName: i,
          sourceInput: 'MEASUREMENT',
          sourceMeasColName: undefined,
          sourceFeatureId: undefined
        }
      })
    })

    //Function to fire an edit event of a feature using the working copy
    exported.editFeature = () => {
      exported.feature.value.formulaId = Number.isInteger(exported.feature.value.formulaId) ? exported.feature.value.formulaId : exported.feature.value.formulaId.id
      //Did formula change? choose civs list accordingly
      const formulaChange = exported.feature.value.formulaId!==exported.originalFormulaId.value
      const civs = formulaChange?exported.variables:exported.previous
      store.dispatch('features/editFeature', {feature:exported.feature.value, formulaChange: formulaChange, civs: civs.list, prev: exported.previous.list})
      context.emit('update:show', false)
    }

    //TODO fix hardcode
    exported.featureTypes =  ['CALCULATION', 'NORMALIZATION', 'RAW']
    exported.inputSource = ['MEASUREMENT', 'FEATURE']

    return exported;
  },
  props: ['originalFeature'],
  emits: ['update:show']
}
</script>
