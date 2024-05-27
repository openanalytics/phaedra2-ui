<template>
  <div class="row no-wrap items-center">
    <div class="col-auto">
      <q-btn-toggle v-model="selectedFeatureOption" :options="featureOptions" class="on-left"/>
    </div>
    <div class="col-8">
      <q-select v-if="selectedFeatureOption === 'raw'"
                v-model="selectedRawFeature"
                :options="rawFeatureOptions"
                option-label="column"
                options-dense
                @update:model-value="value => handleRawFeatureSelection(value)"
                @filter="filterRawOptions"
                dense use-input hide-selected fill-input />
      <q-select v-if="selectedFeatureOption === 'calculated'"
                v-model="selectedCalcFeature"
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
import {useSelectedFeature} from "@/composable/feature/featureSelector";

const props = defineProps(['protocols', 'measurements'])
const measurements = computed(() => props.measurements ?? [])
const protocols = computed(() => props.protocols ?? [])

const emits = defineEmits(['featureOptionSelection', 'rawFeatureSelection', 'calculatedFeatureSelection'])

const selectedFeatureOption = ref('raw')
const featureOptions = [
  { label: 'Measurement Column', value: 'raw' },
  { label: 'Calculated Feature', value: 'calculated' }
]

onMounted(() => initFeatureOptions());

const allRawFeatures = ref([])
const rawFeatureOptions = ref([])
const allCalculatedFeatures = ref([])
const calculatedFeatureOptions = ref([])
const {selectedRawFeature, selectedCalcFeature} = useSelectedFeature()

const initFeatureOptions = () =>  {
  allRawFeatures.value = measurements.value.flatMap(measurement => measurement?.wellColumns
      .map(wellCol => {
        return {measurementId: measurement.measurementId, column: wellCol.trim()}
      }))
      .filter((obj, index, self) =>
              index === self.findIndex((el) => (
                  el.column === obj.column
              ))
      )
      .sort((f1, f2) => f1.column.localeCompare(f2.column))
  rawFeatureOptions.value = allRawFeatures.value

  allCalculatedFeatures.value = protocols.value.flatMap(protocol => protocol.features
      .map(feature => {
        return {name: `[${protocol.name}] ${feature.name}`, protocolId: protocol.id, featureId: feature.id}
      })
      .sort((f1, f2) => f1.name.localeCompare(f2.name))
  )
  calculatedFeatureOptions.value = allCalculatedFeatures.value

  initSelectedFeature()
}
watch([measurements, protocols], () => initFeatureOptions())

const initSelectedFeature = () => {
  if (selectedFeatureOption.value === 'raw') {
    if (rawFeatureOptions.value?.length > 0) {
      handleRawFeatureSelection(rawFeatureOptions.value[0])
    } else {
      handleRawFeatureSelection(null)
    }
  } else {
    if (calculatedFeatureOptions.value?.length > 0) {
      handleCalculatedFeatureSelection(calculatedFeatureOptions.value[0])
    } else {
      handleCalculatedFeatureSelection(null)
    }
  }
}
watch(selectedFeatureOption, () => initSelectedFeature())

const handleRawFeatureSelection = (feature) => {
  if (selectedRawFeature.value === null) selectedRawFeature.value = feature
  emits('rawFeatureSelection', selectedRawFeature.value)
}

const handleCalculatedFeatureSelection = (feature) => {
  if (selectedCalcFeature.value === null) selectedCalcFeature.value = feature
  emits('calculatedFeatureSelection', selectedCalcFeature.value)
}

const filterRawOptions = (filter, update) => {
  update(() => {
    rawFeatureOptions.value = allRawFeatures.value.filter(rfo => {
      return rfo?.column.toLowerCase().includes((filter || "").toLowerCase())
    })
  })
}

const filterCalculatedOptions = (filter, update) => {
  update(() => {
    calculatedFeatureOptions.value = allCalculatedFeatures.value.filter(cfo => {
      return cfo?.name.toLowerCase().includes((filter || "").toLowerCase())
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
