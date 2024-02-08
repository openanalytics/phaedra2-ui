<template>
  <div class="row no-wrap items-center">
    <div>
      <q-btn-toggle v-model="selectedFeatureOption" :options="featureOptions" class="on-left"/>
    </div>
    <div>
      <q-select v-if="selectedFeatureOption === 'raw'"
                v-model="selectedFeature"
                :options="rawFeatureOptions"
                @update:model-value="value => handleRawFeatureSelection(value)"
                @filter="filterRawOptions"
                dense use-input/>
      <q-select v-if="selectedFeatureOption === 'calculated'"
                v-model="selectedFeature"
                :options="calculatedFeatureOptions"
                option-value="featureId"
                option-label="name"
                @update:model-value="value => handleCalculatedFeatureSelection(value)"
                @filter="filterCalculatedOptions"
                dense use-input/>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
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
onMounted(() => {
  initSelectedFeature()
})

const initSelectedFeature = () => {
  if (selectedFeatureOption.value === 'raw')
    handleRawFeatureSelection(rawFeatureOptions.value[0])
  else
    handleCalculatedFeatureSelection(calculatedFeatureOptions.value[0])
}

watch(selectedFeatureOption, () => {
  initSelectedFeature()
})

const handleRawFeatureSelection = (feature) => {
  selectedFeature.value = feature
  emits('rawFeatureSelection', feature)
}

const handleCalculatedFeatureSelection = (feature) => {
  selectedFeature.value = feature
  emits('calculatedFeatureSelection', feature)
}

const filterRawOptions = (filter, update) => {
  update(() => {
    rawFeatureOptions.value = allRawFeatures.value.filter(rfo => {
      return rfo.includes(filter)
    })
  })
}

const filterCalculatedOptions = (filter, update) => {
  update(() => {
    calculatedFeatureOptions.value = allCalculatedFeatures.value.filter(cfo => {
      return cfo.name.includes(filter)
    })
  })
}

</script>

<style scoped>
:deep(.q-field__control),
:deep(.q-field__append) {
  font-size: 12px;
  height: 30px;
}
:deep(.q-btn) {
  font-size: 11px;
  height: 30px;
}
</style>
