<template>
  <div class="q-pa-md">
    <div class="row text-h6 items-center q-px-md oa-section-title">
      <q-icon name="edit" class="q-pr-sm"/>
      New Feature
    </div>
    <oa-section-header :title="'New Feature'" :icon="'edit'"/>
    <div class="oa-section-body">
      <q-card-section>
        <div class="row">
          <div class="col-5">
            <q-input v-model="newFeature.name" square autofocus label="Name"></q-input>
            <q-input v-model="newFeature.alias" square label="Alias"></q-input>
            <q-input v-model="newFeature.description" square label="Description"></q-input>
            <q-input v-model="newFeature.format" square label="Format" placeholder="#.##"
                     style="width: 100px"></q-input>
            <q-input v-model="newFeature.sequence" square label="Sequence"></q-input>
            <q-input v-model="newFeature.trigger" square label="Trigger"></q-input>
          </div>
          <div class="col-1"/>
          <div class="col-5">
            <q-select v-model="newFeature.type" square label="Type" :options="featureTypes"></q-select>
            <q-select v-model="selectedFormulaId" square label="Formula"
                      :options="formulas.filter(formula => formula.category === newFeature.type)" option-value="id"
                      option-label="name"></q-select>
            <div v-if="variables.list.length>0">
              <br>
              <span class="text-primary">Formula variables:</span>
              <q-input :key="variable.variableName" v-model="variable.sourceMeasColName" v-for="variable in variables.list" :label="variable.variableName"></q-input>
            </div>
          </div>
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

<script>

import {useStore} from "vuex";
import {computed, reactive, ref, watch} from "vue";
import OaSectionHeader from "../widgets/OaSectionHeader";

export default {
  name: 'NewFeature',
  components: {OaSectionHeader},
  methods: {
    addFeature() {
      console.log(this.newFeature)
      this.newFeature.formulaId = this.selectedFormulaId.id
      this.$store.dispatch('features/createFeature', {newFeature: this.newFeature, civs: this.variables.list})
      this.$emit('update:show', false)
    },
  },
  setup(props) {
    const store = useStore()
    const formulas = computed(() => store.getters['calculations/getFormulas']())

    let selectedFormulaId = ref(null)
    //Get formulaInputs and dispatch if it not available
    const formulaInputs = computed(() => {
      if (!selectedFormulaId.value) return []
      if(!store.getters['calculations/getFormulaInputs'](selectedFormulaId.value.id))
        store.dispatch('calculations/getFormulaInputs',selectedFormulaId.value.id)
      return store.getters['calculations/getFormulaInputs'](selectedFormulaId.value.id) || []
    })
    let variables = reactive({list: []})
    watch(formulaInputs, (i) =>{
      variables.list = i.map(i => {return {variableName: i,sourceMeasColName: ''}})
    })
    return {
      props,
      formulas,
      formulaInputs,
      selectedFormulaId,
      variables
    }
  },
  data() {
    return {
      featureTypes: ['CALCULATION', 'NORMALIZATION', 'RAW'],
      newFeature: {
        name: null,
        alias: null,
        description: null,
        format: null,
        type: null,
        sequence: 0,
        protocolId: this.props.protocolId,
        formulaId: this.selectedFormulaId,
        trigger: null
      },
      variableNames: []
    }
  },
  props: ['protocolId'],
  emits: ['update:show']
}
</script>
