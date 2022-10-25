<template>
  <div id="plot"></div>
</template>

<script setup>
import PlotLy from 'plotly.js-dist'
import {onMounted, watch} from "vue";

const props = defineProps(['data']);

const plotData = () => {
  return {
    x: props.data.x,
    y: props.data.y,
    mode: 'markers',
    type: 'bar',
    marker: {color: 'red'},
  }
}

// Wait for the DOM to be ready
onMounted(() => {
  PlotLy.newPlot('plot', [plotData()], {width: 300, height: 400});
});

// Call method when data changes
watch(props.data, () => {
  PlotLy.newPlot('plot', [plotData()], {width: 300, height: 400});
});


</script>