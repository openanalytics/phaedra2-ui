<template>
  <ScatterPlot mounted v-if="props.chartTemplate.type==='scatter'" :data="props.data"/>
  <BoxPlot v-else-if="props.chartTemplate.type==='boxplot'" :data="props.data"/>
  <BarPlot v-else-if="props.chartTemplate.type==='barplot'" :data="props.data"/>
  <LinePlot v-else-if="props.chartTemplate.type==='lineplot'" :data="props.data"/>
</template>

<script setup>
import ScatterPlot from "./ScatterPlot";
import BoxPlot from "./BoxPlot";
import BarPlot from "./BarPlot";
import LinePlot from "./LinePlot";
const props = defineProps(['chartTemplate', 'data'])
</script>