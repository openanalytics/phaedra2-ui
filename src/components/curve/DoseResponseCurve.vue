<template>
  <div id="chart" ref="curve"/>
</template>

<script setup>
import Plotly from "plotly.js-dist-min";
import {computed, ref, watch} from "vue";
import {useStore} from "vuex";

const store = useStore()
const props = defineProps(['plate', 'width', 'height'])

const selectedWells = computed(() => store.getters['ui/getSelectedWells']())
const selectedWellSubstances = computed(() => store.getters['ui/getSelectedSubstances']())
const selectedCurves = computed(() => store.getters['curvedata/getCurvesByPlateIdAndSubstances'](props.plate.id, selectedWellSubstances))

const curve = ref(null)

const updateDRCPlotView = () => {
  const dcCurves = computed(() => store.getters['curvedata/getCurvesByPlateIdAndSubstances'](props.plate.id, selectedWellSubstances.value))
  if (dcCurves.value) {
    const layout = {
      margin: {t: 0, b: 0},
      showlegend: false,
      width: curve.value.parentElement.offsetWidth > 0 ? curve.value.parentElement.offsetWidth : props.width,
      height: curve.value.parentElement.offsetHeight > 0 ? curve.value.parentElement.offsetHeight : props.height
    }
    const config = {autosize: false, displaylogo: false}

    const curveData = dcCurves.value.map(c => {
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
    console.log("Execute updateDRCPlotView!")
    Plotly.newPlot(curve?.value, data, layout, config);
  }
}

const resizeDRCPlotView = () => {
  const update = {
    width: curve.value.parentElement.offsetWidth,
    height: curve.value.parentElement.offsetHeight
  }
  Plotly.relayout(curve?.value, update)
}

watch(selectedWells, updateDRCPlotView)
watch(selectedWellSubstances, updateDRCPlotView)
watch(() => props.width, resizeDRCPlotView)
watch(() => props.height, resizeDRCPlotView)

</script>

<style scoped>
</style>
