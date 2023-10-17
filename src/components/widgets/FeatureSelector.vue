<template>
  <div class="col justify-center">
    <div class="row">
      <q-option-group class="col-6"
                      v-model="selectedFeatureOption"
                      :options="featureOptions"
                      @update:model-value="value => handleFeatureOptionSelection(value)"
                      inline />
      <q-select v-if="selectedFeatureOption === 'raw'" class="col-6"
                v-model="selectedFeature"
                :options="rawFeatureOptions"
                label="Raw Feature"
                @update:model-value="value => handleRawFeatureSelection(value)"
                @filter="filterRawOptions"
                dense use-input/>
      <q-select v-if="selectedFeatureOption === 'calculated'" class="col-6"
                v-model="selectedFeature"
                :options="calculatedFeatureOptions"
                option-value="featureId"
                option-label="name"
                label="Calculated Feature"
                @update:model-value="value => handleCalculatedFeatureSelection(value)"
                @filter="filterCalculatedOptions"
                dense use-input/>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useRoute} from "vue-router";
import measurementsGraphQlAPI from '@/api/graphql/measurements'

const route = useRoute();
const props = defineProps(['protocols', 'measurements'])
const emits = defineEmits(['featureOptionSelection', 'rawFeatureSelection', 'calculatedFeatureSelection'])

const selectedFeatureOption = ref('raw')
const featureOptions = [
  { label: 'Active measurement features (raw data)', value: 'raw' },
  { label: 'Protocol features (calculated data)', value: 'calculated' }
]

const allRawFeatures = computed(() => [...new Set(props.measurements.flatMap(m => m.wellColumns))])
const rawFeatureOptions = ref(allRawFeatures.value)

const allCalculatedFeatures = computed(() => props.protocols.flatMap(protocol => protocol.features.map(feature => {
  return {name: `[${protocol.name}] ${feature.name}`, protocolId: protocol.id, featureId: feature.id}
})))
const calculatedFeatureOptions = ref(allCalculatedFeatures.value)

const selectedFeature = ref(null)

const handleFeatureOptionSelection = () => {
  selectedFeature.value = null
  emits('featureOptionSelection')
}

const handleRawFeatureSelection = (feature) => {
  emits('rawFeatureSelection', feature)
}

const handleCalculatedFeatureSelection = (feature) => {
  emits('calculatedFeatureSelection', feature)
}

const filterRawOptions = (filter, update, abort) => {
  console.log("Filter: " + filter)
  update(() => {
    rawFeatureOptions.value = allRawFeatures.value.filter(rfo => {
      return rfo.includes(filter)
    })
  })
}

const filterCalculatedOptions = (filter, update, abort) => {
  console.log("Filter: " + filter)
  update(() => {
    calculatedFeatureOptions.value = allCalculatedFeatures.value.filter(cfo => {
      return cfo.name.includes(filter)
    })
    console.log("calculatedFeatureOptions: " + JSON.stringify(calculatedFeatureOptions.value))
  })
}

</script>
