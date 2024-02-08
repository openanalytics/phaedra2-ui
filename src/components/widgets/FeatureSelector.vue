<template>
  <div class="row items-center">
    <q-btn-toggle v-model="selectedFeatureOption" :options="featureOptions" dense size="sm" padding="xs sm" class="on-left" />
    <q-select v-if="selectedFeatureOption === 'raw'"
              v-model="selectedFeature"
              :options="rawFeatureOptions"
              label="Measurement Column"
              @update:model-value="value => handleRawFeatureSelection(value)"
              @filter="filterRawOptions"
              dense use-input/>
    <q-select v-if="selectedFeatureOption === 'calculated'"
              v-model="selectedFeature"
              :options="calculatedFeatureOptions"
              option-value="featureId"
              option-label="name"
              label="Calculated Feature"
              @update:model-value="value => handleCalculatedFeatureSelection(value)"
              @filter="filterCalculatedOptions"
              dense use-input/>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useRoute} from "vue-router";

const route = useRoute();
const props = defineProps(['protocols', 'measurements'])
const emits = defineEmits(['featureOptionSelection', 'rawFeatureSelection', 'calculatedFeatureSelection'])

const selectedFeatureOption = ref('raw')
const featureOptions = [
  { label: 'Measurement Column', value: 'raw' },
  { label: 'Calculated Feature', value: 'calculated' }
]

const allRawFeatures = computed(() => [...new Set(props.measurements.flatMap(m => m.wellColumns ?? []))])
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

const filterRawOptions = (filter, update) => {
  console.log("Filter: " + filter)
  update(() => {
    rawFeatureOptions.value = allRawFeatures.value.filter(rfo => {
      return rfo.includes(filter)
    })
  })
}

const filterCalculatedOptions = (filter, update) => {
  console.log("Filter: " + filter)
  update(() => {
    calculatedFeatureOptions.value = allCalculatedFeatures.value.filter(cfo => {
      return cfo.name.includes(filter)
    })
    console.log("calculatedFeatureOptions: " + JSON.stringify(calculatedFeatureOptions.value))
  })
}

</script>
