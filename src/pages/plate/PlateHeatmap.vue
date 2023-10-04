<template>
    <div class="col" style="min-width: 75%">
      <WellGrid :plate="plateStore.plate"
                :wells="plateStore.wells"
                :loading="dataLoading"
                :wellColorFunction="wellColorFunction"
                :wellLabelFunctions="wellLabelFunctions"/>
      <ColorLegend class="q-pt-sm" :rangeValues="rangeValues" :plate="plate" />
      <FeatureSelector class="q-pb-xs" :protocols=plateStore.protocols :plate="plateStore.plate" @featureSelection="handleFeatureSelection"/>
    </div>
</template>

<script setup>
import {ref, watch, defineProps} from 'vue'
import WellGrid from "@/components/well/WellGrid"
import FeatureSelector from "@/components/widgets/FeatureSelector"
import ColorLegend from "@/components/widgets/ColorLegend"
import ColorUtils from "@/lib/ColorUtils.js"
import WellUtils from "@/lib/WellUtils.js"

import resultDataGraphQlAPI from '@/api/graphql/resultdata'
import {usePlateStore} from "@/stores/plate";

console.log("PlateHeatmap: enter script setup section")
const props = defineProps(['plate', 'wells']);
const plateStore = usePlateStore()

const dataLoading = ref(false);
const rangeValues = ref({min: 0, mean: 50, max: 100});
const lut = ref(ColorUtils.createLUT([], ColorUtils.defaultHeatmapGradients));

const resultSet = plateStore.activeResultSet

const resultData = ref([])
// TODO: Implement onError event handling
const {onResult, onError} = resultDataGraphQlAPI.resultDataByResultSetId(resultSet?.id)
onResult(({data}) => resultData.value = data.resultData)

const selectedFeatureData = ref(null)

const handleFeatureSelection = (protocol, feature) => {
  selectedFeatureData.value = resultData.value.find(rd => rd.featureId === feature.id)
}

watch(selectedFeatureData, () => {
  if (!selectedFeatureData.value?.values) return;
  lut.value = ColorUtils.createLUT(selectedFeatureData.value.values, ColorUtils.defaultHeatmapGradients);
  rangeValues.value = calcRangeValues(selectedFeatureData.value.values);
});

const wellColorFunction = well => {
  if (!selectedFeatureData.value?.values) return WellUtils.getWellTypeColor("EMPTY");
  const wellNr = WellUtils.getWellNr(well.row, well.column, props.plate.columns);
  return lut.value.getColor(selectedFeatureData.value.values[wellNr - 1]);
}

const wellLabelFunctions = [
    well => {
        let wellNr = WellUtils.getWellNr(well.row, well.column, props.plate.columns);
        return (selectedFeatureData.value?.values) ? (Math.round(selectedFeatureData.value.values[wellNr - 1] * 100) / 100) : "";
    }
]

const calcRangeValues = (values) => {
  const min = Math.min(...values.filter(v => !isNaN(v)));
  const mean = values.reduce((x, y) => x + y, 0) / values.length;
  const max = Math.max(...values.filter(v => !isNaN(v)));
  return {min: min, mean: mean, max: max};
}
</script>
