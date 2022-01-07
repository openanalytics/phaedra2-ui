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
                      :options="formulas.filter(formula => formula.category === feature.type)" option-label="name"
                      option-value="id" map-options></q-select>
            <div>
              <br>
              <!--Previous formula variables-->
              <div v-if="feature.formulaId===originalFormulaId || feature.formulaId.id === originalFormulaId">
                <span v-if="previous.list.length>0" class="text-primary">Formula variables:</span>
                <q-input :key="p.variableName" v-model="p.sourceMeasColName" v-for="p in previous.list" :label="p.variableName"></q-input>
              </div>
              <!--New formula variables-->
              <div v-if="feature.formulaId!==originalFormulaId && feature.formulaId.id!==originalFormulaId">
                <span v-if="variables.list.length>0" class="text-primary">Formula variables:</span>
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
      this.feature.formulaId = Number.isInteger(this.feature.formulaId) ? this.feature.formulaId : this.feature.formulaId.id
      //Did formula change? choose civs list accordingly
      const formulaChange = this.feature.formulaId!==this.originalFormulaId
      const civs = formulaChange?this.variables:this.previous
      this.$store.dispatch('features/editFeature', {feature:this.feature, formulaChange: formulaChange, civs: civs.list, prev: this.previous.list})
      this.$emit('update:show', false)
    },
  },
  setup(props) {
    const exported = {}

    const store = useStore()
    exported.formulas = computed(() => store.getters['calculations/getFormulas']())

    exported.feature = ref({})
    //Reactive list that changes when formulaInputs changes
    exported.variables = reactive({list: []})
    exported.previous = reactive({list: []})

    const fetchFeatureWorkingCopy = () => {
      let originalFeature = props.originalFeature || {}
      exported.feature.value = {...originalFeature}
      exported.originalFormulaId = ref(originalFeature.formulaId)
      //Fetch previous formula variable names
      store.dispatch('features/getCalculationInputValue',exported.feature.value.id).then(() => {
        const civs = store.getters['features/getCalculationInputValueByFeatureId'](exported.feature.value.id)
        if (civs)
          //Make full copy of getter + sort alphabetically instead of by date modified
          exported.previous.list = JSON.parse(JSON.stringify(civs)).sort((a, b) => a.variableName.localeCompare(b.variableName))
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
      exported.variables.list = f.map(i => {return {variableName: i,sourceMeasColName: ''}}).sort((a, b) => a.variableName.localeCompare(b.variableName))
    })

    //TODO fix hardcode
    exported.featureTypes =  ['CALCULATION', 'NORMALIZATION', 'RAW']

    return exported;
  },
  props: ['originalFeature'],
  emits: ['update:show']
}
</script>
