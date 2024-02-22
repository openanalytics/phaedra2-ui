<template>
  <div class="row no-wrap items-center">
    <div class="col-auto">
      <q-btn-toggle v-model="selectedFeatureOption" :options="featureOptions" class="on-left"/>
    </div>
    <div class="col-8">
      <q-select v-if="selectedFeatureOption === 'raw'"
                v-model="selectedFeature"
                :options="rawFeatureOptions"
                options-dense
                @update:model-value="value => handleRawFeatureSelection(value)"
                @filter="filterRawOptions"
                dense use-input hide-selected fill-input class="" />
      <q-select v-if="selectedFeatureOption === 'calculated'"
                v-model="selectedFeature"
                :options="calculatedFeatureOptions"
                options-dense
                option-value="featureId"
                option-label="name"
                @update:model-value="value => handleCalculatedFeatureSelection(value)"
                @filter="filterCalculatedOptions"
                dense use-input hide-selected fill-input />
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

const allRawFeatures = computed(() => [...new Set(props.measurements.flatMap(m => m.wellColumns ?? []))].sort((f1, f2) => f1.localeCompare(f2)))
const rawFeatureOptions = ref(allRawFeatures.value)

const allCalculatedFeatures = computed(() => props.protocols.flatMap(protocol => protocol.features
  .map(feature => {
    return {name: `[${protocol.name}] ${feature.name}`, protocolId: protocol.id, featureId: feature.id}
  })
  .sort((f1, f2) => f1.name.localeCompare(f2.name))
))
const calculatedFeatureOptions = ref(allCalculatedFeatures.value)

const selectedFeature = ref(null)

onMounted(() => initSelectedFeature());
watch(selectedFeatureOption, () => initSelectedFeature())

watch(allRawFeatures, () => {
  rawFeatureOptions.value = allRawFeatures.value;
  if (!selectedFeature.value) initSelectedFeature();
});
watch(allCalculatedFeatures, () => {
  calculatedFeatureOptions.value = allCalculatedFeatures.value;
});

const initSelectedFeature = () => {
  if (selectedFeatureOption.value === 'raw' && rawFeatureOptions.value?.length > 0) {
    handleRawFeatureSelection(rawFeatureOptions.value[0])
  } else if (calculatedFeatureOptions.value?.length > 0) {
    handleCalculatedFeatureSelection(calculatedFeatureOptions.value[0])
  }
}

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
      return rfo.toLowerCase().includes((filter || "").toLowerCase())
    })
  })
}

const filterCalculatedOptions = (filter, update) => {
  update(() => {
    calculatedFeatureOptions.value = allCalculatedFeatures.value.filter(cfo => {
      return cfo.name.toLowerCase().includes((filter || "").toLowerCase())
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
