<template>
  <div class="q-pa-sm">
    <div class="row oa-section-title justify-evenly">
      <div class="col-1 text-h6 q-ml-md">
        <q-icon name="show_chart" />
      </div>
      <div class="col text-h6">Dose-Response View</div>
      <div class="text-h6">
        <actions>
          <slot name="actions" class="row">
            <q-btn icon="close" @click="closeDRCView" class="q-pa-xs" size="md" flat/>
          </slot>
        </actions>
      </div>
    </div>
    <div class="oa-section-body">
      <div id="chart" ref="curve" style="padding-top: 30px"/>
    </div>
    <q-separator class="q-pt-md oa-section-body"/>
    <div class="oa-section-body">
      <q-table
          table-header-class="text-grey"
          :rows="curvePropertyRows"
          row-key="PropertyName"
          square flat dense
      />
    </div>
  </div>
</template>

<script setup>
import Plotly from "plotly.js-dist-min";
import {onMounted, onUpdated, ref, watch} from "vue";

const props = defineProps(['width', 'height', 'curves', 'update'])
const emits = defineEmits(['closeDRCView'])
const curve = ref(null)
const curvePropertyRows = ref([])

onMounted(() => {
  updateDRCPlotView()
  updateDRCPropertyTable()
})

onUpdated(() => {
  resizeDRCPlotView()
})


const updateDRCPlotView = () => {
  const config = {autosize: false, displaylogo: false}
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

const closeDRCView = () => {
  console.log("Close DRC View!")
  emits("closeDRCView")
}

const updateDRCPropertyTable = () => {
  const curvePropertyNames = props.curves[0].curveProperties.map(cProp => cProp.name)
  curvePropertyRows.value = curvePropertyNames.map(cPropName => {
    const result = { Property: cPropName }

    props.curves.forEach(curve => {
      const matchingProp = curve.curveProperties.find(cProp => cProp.name === cPropName);
      result[curve.substanceName] = matchingProp?.numericValue ?? matchingProp?.stringValue;
    })

    return result
  })
}

watch(() => props.curves, updateDRCPlotView)
watch(() => props.curves, updateDRCPropertyTable)

</script>

<style scoped>
</style>
