<template>
  <div id="plot"></div>
</template>

<script setup>
import PlotLy from 'plotly.js-dist'
import {onMounted, watch} from "vue";
import ChartUtils from "@/lib/ChartUtils";

const props = defineProps(['data']);

const getColor = (well) => {
  return props.data.colors[well.grouper]
}

const plotData = () => {
  return {
    x: props.data.wells.map(well => well.x),
    y: props.data.wells.map(well => well.y),
    type: 'line',
    marker: {
      color: props.data.wells.map(well => getColor(well)),
      size: props.data.template.chartSettings.pointSize?props.data.template.chartSettings.pointSize:10
    },
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

// Watch for changes in grouper
watch(() => props.data.wells[0]?props.data.wells[0].grouper:null, () => {
  PlotLy.newPlot('plot', [plotData()], {width: 300, height: 400});
});

</script>