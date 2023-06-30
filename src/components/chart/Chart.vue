<template>
  <ScatterPlot v-if="chartType === 'scatter2D'" :id="chartId" :data="chartData" :update="props.update"/>
  <BoxPlot v-else-if="chartType === 'boxplot'" :id="chartId" :data="chartData" :update="props.update"/>
  <BarPlot v-else-if="chartType === 'barplot'" :id="chartId" :data="chartData" :update="props.update"/>
  <LinePlot v-else-if="chartType === 'lineplot'" :id="chartId" :data="chartData" :update="props.update"/>
</template>

<script setup>
import ScatterPlot from "@/components/chart/ScatterPlot_v2.vue";
import BoxPlot from "@/components/chart/BoxPlot_v2.vue";
import BarPlot from "@/components/chart/BarPlot_v2.vue";
import LinePlot from "@/components/chart/LinePlot_v2.vue";
import {computed, ref, watch} from "vue";

const props = defineProps(['id', 'type', 'data', 'update'])
const chartId = ref(props.id)
const chartType = ref(props.type)
const chartData = ref(props.data)

const handleChartClick = () => {
 console.log("update changed: " + props.update)
}

watch(() => props.update, handleChartClick);
</script>
