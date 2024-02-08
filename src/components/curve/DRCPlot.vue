<script setup>
import {onMounted, onUpdated, ref, watch} from "vue";
import Plotly from "plotly.js-dist-min";

const props = defineProps(['width', 'height', 'curves', 'update'])
const curve = ref(null)

const updateDRCPlotView = () => {
  const config = {autosize: true, displaylogo: false}
  const layout = {
    xaxis: {
      title: "Log[M]"
    },
    margin: {t: 50, b: 50},
    showlegend: true,
    legend: { x: 1, y: 0.5},
    width: curve.value.parentElement.offsetWidth > 0 ? curve.value.parentElement.offsetWidth : props.width,
    height: props.height
  }

  if (props.curves?.length > 0) {
    const curveData = props.curves?.map(value => {
      const curve = {
        x: value.plotDoseData,
        y: value.plotPredictionData,
        mode: 'lines',
        line: {
          shape: 'spline',
          color: value.color
        },
        hovertemplate: `${value.substanceName} (${value.featureName}) <extra></extra>`,
        showlegend: true,
        legendgroup: `${value.substanceName} (${value.featureId})`,
        name: `${value.substanceName}`
      }

      const datapoints = {
        x: value.wellConcentrations.map(wc => -wc),
        y: value.featureValues,
        mode: 'markers',
        marker: {
          size: value.weights?.map(w => (w + 1.0) * 10),
          color: value.color,
          line: {
            width: 3
          }
        },
        hovertemplate: "x = %{x}, y = %{y}<extra></extra>",
        showlegend: false,
        legendgroup: `${value.substanceName} (${value.featureId})`,
      }
      return {"substanceName": value.substanceName, "curve": curve, "datapoints": datapoints}
    })

    const line = curveData.map(cData => cData.curve)
    const scatter = curveData.map(cData => cData.datapoints)
    const data = line.concat(scatter)
    Plotly.newPlot(curve?.value, data, layout, config)
  } else {
    const data = []
    Plotly.newPlot(curve?.value, data, layout, config)
  }
}

const resizeDRCPlotView = () => {
  const update = {
    width: curve.value.offsetWidth - 10,
    height: props.height
  }
  console.log("update: " + JSON.stringify(update))
  console.log("curve.value.style['paddingTop']: " + curve.value.style['paddingTop'])
  Plotly.relayout(curve?.value, update)
}

watch(() => props.curves, updateDRCPlotView)

onMounted(() => updateDRCPlotView())
onUpdated(() => resizeDRCPlotView())
</script>

<template>
  <div id="chart" ref="curve" style="padding-top: 30px"/>
</template>

<style scoped>

</style>
