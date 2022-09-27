<template>
  <div id="plot"></div>
</template>

<script setup>
import PlotLy from 'plotly.js-dist'
import {onMounted, watch, watchEffect} from "vue";

const props = defineProps(['show', 'data']);

// Wait for the DOM to be ready
onMounted(() => {
  PlotLy.newPlot('plot', [props.data]);
});

// Call method when data changes
watch(props.data, () => {
  console.log('data changed');
  PlotLy.newPlot('plot', [props.data]);
});


</script>
