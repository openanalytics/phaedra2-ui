<template>
  <div class="q-pa-md">
    <div class="row text-h6 items-center q-px-md oa-section-title">
      <q-icon name="edit" class="q-pr-sm"/>
      Edit Feature
    </div>
    <div class="oa-section-body">
      <q-card-section>
        <div class="row">
          <div class="col-5">
            <q-input v-model="name" square autofocus label="Name"></q-input>
            <q-input v-model="alias" square label="Alias"></q-input>
            <q-input v-model="description" square label="Description"></q-input>
            <q-input v-model="format" square label="Format" placeholder="#.##"
                     style="width: 100px"></q-input>
            <q-input v-model="sequence" square label="Sequence"></q-input>
            <q-input v-model="trigger" square label="Trigger"></q-input>
          </div>
          <div class="col-1"/>
          <div class="col-5">
            <q-select v-model="type" square label="Type" :options="featureTypes"></q-select>
            <q-select v-model="formulaId" square label="Formula"
                      :options="formulas.filter(formula => formula.category === type)" option-label="name"
                      option-value="id" map-options></q-select>
            <div v-if="variables.list.length>0">
              <br>
              <span class="text-primary">Formula variables:</span>
              <!--Previous formula variables-->
              <div v-if="formulaId===props.feature.formulaId || formulaId.id === props.feature.formulaId">
                <q-input :key="p.variableName" v-model="p.sourceMeasColName" v-for="p in previous.list" :label="p.variableName"></q-input>
              </div>
              <!--New formula variables-->
              <div v-if="formulaId!==props.feature.formulaId && formulaId.id!==props.feature.formulaId">
                <br>
                <q-input :key="variable.variableName" v-model="variable.sourceMeasColName" v-for="variable in variables.list" :label="variable.variableName"></q-input>
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
      {{variables}}<br>
      {{previous}}<br>
      {{[formulaId,props.feature.formulaId]}}
    </div>
  </div>
</template>

<script>

import {useStore} from "vuex";
import {computed, reactive, ref, watch} from "vue";

export default {
  name: 'EditFeature',
  methods: {
    editFeature() {
      const editedFeature = {
        id: this.props.feature.id,
        name: this.name,
        type: this.type,
        protocolId: this.protocolId,
        formulaId: Number.isInteger(this.formulaId) ? this.formulaId : this.formulaId.id
      }
      //Check if it is not null
      if (this.alias) editedFeature.alias = this.alias
      if (this.description) editedFeature.description = this.description
      if (this.format) editedFeature.format = this.format
      if (this.sequence) editedFeature.alias = this.sequence
      if (this.trigger) editedFeature.trigger = this.trigger

      //Did formula change? choose civs list accordingly
      const formulaChange = this.formulaId!==this.props.feature.formulaId
      const civs = formulaChange?this.variables:this.previous
      this.$store.dispatch('features/editFeature', {feature:editedFeature, formulaChange: formulaChange, civs: civs.list, prev: this.previous.list})
      this.$emit('update:show', false)
    },
  },
  setup(props) {
    const store = useStore()
    const formulas = computed(() => store.getters['calculations/getFormulas']())

    let name = ref(props.feature.name)
    let alias = ref(props.feature.alias)
    let description = ref(props.feature.description)
    let format = ref(props.feature.format)
    let type = ref(props.feature.type)
    let sequence = ref(props.feature.sequence)
    let protocolId = ref(props.feature.protocolId)
    let trigger = ref(props.feature.alias)
    let formulaId = ref(props.feature.formulaId)

    //Get calculationInputValues
    const civs = computed(() => {
      console.log('civs')
      if(!store.getters['features/getCalculationInputValueByFeatureId'](props.feature.id))
        store.dispatch('features/getCalculationInputValue',props.feature.id)
      return store.getters['features/getCalculationInputValueByFeatureId'](props.feature.id)
    })
    //Get formulaInputs
    const formulaInputs = computed(() => {
      const id = Number.isInteger(formulaId.value) ? formulaId.value:formulaId.value.id
      if(!store.getters['calculations/getFormulaInputs'](id))
        store.dispatch('calculations/getFormulaInputs',id)
      return store.getters['calculations/getFormulaInputs'](id) || []
    })

    //Reactive list that changes when formulaInputs changes
    let variables = reactive({list: []})
    //Reactive list that changes when civs changes
    let previous = reactive({list: []})
    //Watch for changes and update lists accordingly
    watch([civs,formulaInputs], ([c,f]) => {
      console.log(c)
      if(c)previous.list = c.map(i => {return {variableName: i.variableName, sourceMeasColName: i.sourceMeasColName, id: i.id, featureId: i.featureId}})
      if(f)variables.list = f.map(i => {return {variableName: i,sourceMeasColName: ''}})
    },  { deep: true })

    return {
      props,
      formulas,
      name,
      alias,
      description,
      format,
      type,
      sequence,
      protocolId,
      formulaId,
      trigger,
      variables,
      previous
    }
  },
  data() {
    return {
      featureTypes: ['CALCULATION', 'NORMALIZATION', 'RAW'],
    }
  },
  props: ['feature'],
  emits: ['update:show']
}
</script>
