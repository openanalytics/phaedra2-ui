<template>
  <div class="q-pa-md">
    <div class="row oa-section-title">
      <div class="col-1 text-h6"/>
      <div class="col-1 text-h6">
        <q-icon name="show_chart" />
      </div>
      <div class="col-9 text-h6">Dose-Response View</div>
      <div class="col-1 text-h6">
        <q-btn icon="close" @click="closeDRCView" class="q-pa-xs" size="md" flat/>
      </div>
    </div>
    <div class="oa-section-body">
      <div id="chart" ref="curve" style="padding-top: 50px"/>
    </div>
  </div>
</template>

<script setup>
import Plotly from "plotly.js-dist-min";
import {onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import ColorUtils from "@/lib/ColorUtils";

const store = useStore()

const props = defineProps(['width', 'height', 'curves'])
const emits = defineEmits(['closeDRCView'])
const curve = ref(null)

onMounted(() => {
  updateDRCPlotView()
})

const updateDRCPlotView = () => {
  const layout = {
    margin: {t: 50, b: 50},
    showlegend: true,
    legend: {"orientation": "h"},
    width: curve.value.parentElement.offsetWidth > 0 ? curve.value.parentElement.offsetWidth : props.width,
    height: props.height
  }

  const config = {autosize: false, displaylogo: false}
  if (props.curves?.length > 0) {
    const curveData = props.curves?.map(value => {
      const curve = {
        x: value.plotDoseData.map(d => (d / 2.303)),
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

      // const selectedWellIds = selectedWells.value.map(well => well.id)
      // const colors = c.wells.map(well => selectedWellIds.includes(well) ? 'rgb(246,2,2)' : c.color)
      const datapoints = {
        x: value.wellConcentrations,
        y: value.featureValues,
        mode: 'markers',
        marker: {
          size: value.weights?.map(w => w * 15),
          color: value.color,
          line: {
            // color: colors,
            width: 3
          }
        },
        hovertemplate: "%{y}<extra></extra>",
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

const closeDRCView = () => {
  console.log("Close DRC View!")
  emits("closeDRCView")
}

// watch(selectedWells, updateDRCPlotView)
// watch(selectedWellSubstances, updateDRCPlotView)
watch(() => props.width, resizeDRCPlotView)
watch(() => props.height, resizeDRCPlotView)
watch(() => props.curves, updateDRCPlotView)

</script>

<style scoped>
</style>
