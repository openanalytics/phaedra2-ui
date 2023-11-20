<template>
  <div class="curve-view" id="drCurve" ref="drCurve"/>
</template>

<script setup>

import Plotly from "plotly.js-dist-min";
import {onMounted, ref} from "vue";
import {useStore} from "vuex";

const store = useStore()

const props = defineProps(['curvedata'])
const emits = defineEmits(['showDRCView'])
const drCurve = ref()
const data = ref([])

const layout = {
  showlegend: false,
  autosize: false,
  width: 75,
  height: 75,
  margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 }
};

const config = {
  staticPlot: true,
  responsive: true,
  displaylogo: false
}

const drawChart = () => {
  const curve = {
    x: props.curvedata?.plotDoseData,
    y: props.curvedata?.plotPredictionData,
    mode: 'lines',
    line: {
      shape: 'spline',
      color: props.curvedata?.color
    },
    showlegend: false,
  }

  const datapoints = {
    x: props.curvedata?.wellConcentrations.map(wc => -wc),
    y: props.curvedata?.featureValues,
    mode: 'markers',
    marker: {
      size: props.curvedata?.weights?.map(w => w * 10),
      color: props.curvedata?.color,
    },
    showlegend: false,
  }
  data.value = [curve, datapoints]
  Plotly.newPlot(drCurve.value, data.value, layout, config)
}

onMounted(() => {
  drawChart()
})

</script>

<style scoped>
.curve-view {
  min-width: 75px;
  min-height: 75px;
}
</style>
