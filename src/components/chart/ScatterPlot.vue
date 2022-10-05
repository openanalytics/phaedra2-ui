<template>
  <div id="plot"></div>
</template>

<script setup>
import PlotLy from 'plotly.js-dist'
import {onMounted, watch, watchEffect} from "vue";

const props = defineProps(['data', 'width']);

let layout = {
  margin: {t:5, l:50, r:5, b:20},
  "xaxis": {
    "autorange": true,
  },
  "yaxis": {
    "autorange": true,
  }
}

const getAxisType = (data) => {
  if (data.every(d => typeof d === 'number')) return 'linear';
  return 'category';
}

// Wait for the DOM to be ready
onMounted(() => {
  layout.width = document.getElementById('plot').parentElement.clientWidth*3;
  layout.xaxis.type = getAxisType(props.data.x);
  layout.yaxis.type = getAxisType(props.data.y);
  PlotLy.newPlot('plot', [props.data], layout);
});

// Call method when data changes
watch(props.data, () => {
  layout.xaxis.type = getAxisType(props.data.x);
  layout.yaxis.type = getAxisType(props.data.y);
  PlotLy.newPlot('plot', [props.data],layout);
});

window.onresize = () => {
  PlotLy.Plots.resize(document.getElementById('plot'));
}


</script>
