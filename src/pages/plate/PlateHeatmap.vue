<template>
    <div class="col" style="min-width: 75%">
      <FeatureSelector class="q-pb-xs"
                       :protocols=plateStore.protocols
                       :measurements=measurements
                       @featureOptionSelection="handleFeatureOptionSelection"
      @rawFeatureSelection="handleRawFeatureSelection"
      @calculatedFeatureSelection="handleCalculatedFeatureSelection"/>
      <q-space class="q-pa-md"/>
      <WellGrid :plate="plateStore.plate"
                :wells="plateStore.wells"
                :loading="dataLoading"
                :wellColorFunction="wellColorFunction"
                :wellLabelFunctions="wellLabelFunctions"/>
      <ColorLegend class="q-pt-sm" :rangeValues="rangeValues" :plate="plate" />
    </div>
</template>

<script setup>
import {ref, watch, defineProps, computed} from 'vue'
import WellGrid from "@/components/well/WellGrid"
import FeatureSelector from "@/components/widgets/FeatureSelector"
import ColorLegend from "@/components/widgets/ColorLegend"
import ColorUtils from "@/lib/ColorUtils.js"
import WellUtils from "@/lib/WellUtils.js"

import resultDataGraphQlAPI from '@/api/graphql/resultdata'
import {usePlateStore} from "@/stores/plate";
import measurementsGraphQlAPI from "@/api/graphql/measurements";

const props = defineProps(['plate', 'wells']);
const plateStore = usePlateStore()

const wellData = ref([])
const dataLoading = ref(false);
const rangeValues = ref({min: 0, mean: 50, max: 100});

const lut = ref(ColorUtils.createLUT([], ColorUtils.defaultHeatmapGradients));
const measurements = computed(() => plateStore.activeMeasurement !== undefined ? [plateStore.activeMeasurement] : [])

const handleFeatureOptionSelection = () => {
  wellData.value = []
}

const handleRawFeatureSelection = (rawFeature) => {
  const {onResult} = measurementsGraphQlAPI.measurementWellData(plateStore.activeMeasurement.measurementId, rawFeature)
  onResult(({data}) => {
    wellData.value = data?.wellData ? data.wellData : []
  })
}

const handleCalculatedFeatureSelection = (calculatedFeature) => {
  const {onResult} = resultDataGraphQlAPI.featureValuesByPlateIdAndFeatureId(plateStore.plate.id, calculatedFeature.featureId)
  onResult(({data}) => {
    wellData.value = data?.featureValues ? data.featureValues.map(fv => fv.value) : []
  })
}

watch(wellData, () => {
  lut.value = ColorUtils.createLUT(wellData.value, ColorUtils.defaultHeatmapGradients);
  rangeValues.value = calcRangeValues(wellData.value);
})

const wellColorFunction = well => {
  const wellNr = WellUtils.getWellNr(well.row, well.column, props.plate.columns);
  return lut.value.getColor(wellData.value[wellNr - 1]);
}

const wellLabelFunctions = [
    well => {
        let wellNr = WellUtils.getWellNr(well.row, well.column, props.plate.columns);
        return (wellData.value.length > 0) ? (Math.round(wellData.value[wellNr - 1] * 100) / 100) : "";
    }
]

const calcRangeValues = (values) => {
  const min = Math.min(...values.filter(v => !isNaN(v)));
  const mean = values.reduce((x, y) => x + y, 0) / values.length;
  const max = Math.max(...values.filter(v => !isNaN(v)));
  return {min: min, mean: mean, max: max};
}
</script>
