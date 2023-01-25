<template>
  <div class="col" style="min-width: 75%">
    <FeatureSelector class="q-pb-md" :protocols=protocols :plateResults=plateResults :plate="plate"
                     @featureSelection="handleFeatureSelection"/>
    <WellGrid :plate="plate"
              :loading="dataLoading"
              :wellColorFunction="wellColorFunction"
              :wellLabelFunctions="wellLabelFunctions"
              :plateResults="plateResults"/>
    <ColorLegend class="q-pt-sm" :rangeValues="rangeValues" :plate="plate"/>
  </div>
</template>

<style>
</style>

<script setup>
import {ref, computed, watchEffect, defineProps} from 'vue'
import {useStore} from 'vuex'
import WellGrid from "@/components/well/WellGrid.vue"
import FeatureSelector from "@/components/widgets/FeatureSelector.vue"
import ColorLegend from "@/components/widgets/ColorLegend.vue"
import ColorUtils from "@/lib/ColorUtils.js"
import WellUtils from "@/lib/WellUtils.js"

const props = defineProps(['plate'])
const exported = ref({});
const store = useStore()

const plateResults = ref([]);
const protocols = ref([]);
const selectedFeature = ref(null);
const dataLoading = ref(true);
const rangeValues = ref(null)

// Load resultdata to display
const activeMeasurement = store.getters['measurements/getActivePlateMeasurement'](props.plate.id);
if (activeMeasurement) {
  plateResults.value = store.getters['resultdata/getPlateResults'](props.plate.id, activeMeasurement.measurementId);
  let protocolIds = [...new Set(plateResults.value.map(rs => rs.protocolId))];
  store.dispatch('protocols/loadByIds', protocolIds).then(() => {
    protocols.value = store.getters['protocols/getByIds'](protocolIds);
    dataLoading.value = false;
  })
} else {
  dataLoading.value = false;
}

const selectedFeatureData = computed(() => {
  if (!selectedFeature.value) return undefined;
  let rsData = plateResults.value.filter(rs => (rs.featureId == selectedFeature.value.id));
  return rsData.sort((t1, t2) => t2.id - t1.id)[0];
})

const lut = ref(ColorUtils.createLUT([], ColorUtils.defaultHeatmapGradients));
watchEffect(() => {
  if (selectedFeatureData.value) {
    lut.value = ColorUtils.createLUT(selectedFeatureData.value.values, ColorUtils.defaultHeatmapGradients);
  }
});

const wellColorFunction = function (well) {
  if (!selectedFeatureData.value) return WellUtils.getWellTypeColor("EMPTY");
  const wellNr = WellUtils.getWellNr(well.row, well.column, props.plate.columns);
  return lut.value.getColor(selectedFeatureData.value.values[wellNr - 1]);
}

const wellLabelFunctions = [
  function (well) {
    let wellNr = WellUtils.getWellNr(well.row, well.column, props.plate.columns);
    return (selectedFeatureData.value) ? (Math.round(selectedFeatureData.value.values[wellNr - 1] * 100) / 100) : "";
  }
]

const handleFeatureSelection = function (feature) {
  selectedFeature.value = feature
  rangeValues.value = calcRangeValues()
}

const calcRangeValues = () => {
  if (Array.isArray(plateResults.value)) {
    const result = plateResults.value.filter(rs => (rs.featureId == selectedFeature.value.id));
    if (result.length > 0) {
      const min = Math.min(...result[0].values.filter(v => !isNaN(v)));
      const mean = result[0].values.reduce((x, y) => x + y, 0) / result[0].values.length;
      const max = Math.max(...result[0].values.filter(v => !isNaN(v)));
      return {min: min, mean: mean, max: max}
    }
  }
  return {min: 0, mean: 50, max: 100};
}
</script>
