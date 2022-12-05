<template>
  <div class="curve-view" id="chart" ref="el"/>
</template>

<script setup>

import Plotly from "plotly.js-dist-min";
import {computed, onMounted, ref, watch} from "vue";
import {useCurveDataStore} from "@/stores/curvedata";
import {useStore} from "vuex";

const minCharViewWidth = ref('600px');
const minCharViewHeight = ref('600px');

const props = defineProps(['plate'])

const store = useStore()
const curvedataStore = useCurveDataStore()

const selectedWells = computed( () => {
    return store.getters['ui/getSelectedWells']();
})

const selectedWellSubstances = computed( () => {
  return store.getters['ui/getSelectedSubstances']();
})

const selectedPlates =computed( () => {
  return store.getters['ui/getSelectedPlates']();
})

const plateIds = [...new Set(selectedPlates.value)]

const el = ref()

onMounted(() => {
  updateDRCPlotView()
})

const layout = {
  showlegend: false,
  autosize: true,
  width: 500,
  height: 500,
  margin: { l: 20, r: 20, b: 20, t: 20, pad: 4 }
};

const config = {
  responsive: true
}

const updateDRCPlotView = () => {
  const dcCurves = curvedataStore.getCurvesByPlateIdAndSubstances(plateIds, selectedWellSubstances.value)
  if (dcCurves) {
    const curveData = dcCurves.map(c => {
      const curve = {
        x: c.plotDoseData.map(d => (d / 2.303)),
        y: c.plotPredictionData,
        mode: 'lines',
        line: {
          shape: 'spline',
          color: c.color
        },
        showlegend: true,
        legendgroup: c.substanceName,
        name: c.substanceName
      }

      const selectedWellIds = selectedWells.value.map(well => well.id)
      const colors = c.wells.map(well => selectedWellIds.includes(well) ? 'rgb(15,15,15)' : c.color)
      const datapoints = {
        x: c.wellConcentrations,
        y: c.featureValues,
        mode: 'markers',
        marker: {
          size: c.weights?.map(w => w * 10),
          color: c.color,
          line: {
            color: colors,
            width: 3
          }
        },
        showlegend: false,
        legendgroup: c.substanceName,
        name: c.substanceName
      }
      return {"substanceName": c.substanceName, "curve": curve, "datapoints": datapoints}
    })

    const line = curveData.map(cData => cData.curve)
    const scatter = curveData.map(cData => cData.datapoints)
    const data = line.concat(scatter)
    Plotly.newPlot(el.value, data, layout, config);
  }
}

const clear = () => {
  selectedSubstances.value = null;
  Plotly.newPlot(el.value, dcCurves.map(drc => drc.curve), layout);
}

watch(selectedWells, updateDRCPlotView);
watch(selectedWellSubstances, updateDRCPlotView);

</script>

<style scoped>
.curve-view {
  min-width: v-bind(minCharViewWidth);
  min-height: v-bind(minCharViewHeight);
}
</style>
