<template>
  <div class="col">
    <div class="row ">
      <q-option-group v-model="selectedFeatureOption"
                      :options="featureOptions"
                      @update:model-value="value => handleFeatureOptionSelection(value)"
                      inline dense/>
    </div>
    <div class="row">
      <q-select v-if="selectedFeatureOption === 'raw'" class="col-12"
                v-model="selectedFeature"
                :options="rawFeatureOptions"
                label="Raw Feature"
                @update:model-value="value => handleRawFeatureSelection(value)"
                @filter="filterRawOptions"
                dense use-input/>
      <q-select v-if="selectedFeatureOption === 'calculated'" class="col-12"
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

const route = useRoute();
const props = defineProps(['protocols', 'measurements'])
const emits = defineEmits(['featureOptionSelection', 'rawFeatureSelection', 'calculatedFeatureSelection'])

const selectedFeatureOption = ref('raw')
const featureOptions = [
  { label: 'Active measurement features (raw data)', value: 'raw' },
  { label: 'Protocol features (calculated data)', value: 'calculated' }
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
