<template>
  <div class="viewer-panel relative-position">
    <q-select id="x" v-model="x" :options="getKeys(wells[0])" label="X-axis"/>
    <q-select v-model="y" :options="getKeys(wells[0])" label="Y-axis"/>
    <q-select v-model="grouper" :options="getKeys(wells[0])" label="Grouper"/>
    <ScatterPlot mounted v-if="chartTemplate.type==='scatter'" :data="data"/>
    <BoxPlot v-else-if="chartTemplate.type==='boxplot'" :data="data"/>
    <BarPlot v-else-if="chartTemplate.type==='barplot'" :data="data"/>
    <LinePlot v-else-if="chartTemplate.type==='lineplot'" :data="data"/>
  </div>
</template>

<script setup>
import PlotLy from 'plotly.js-dist'
import {useStore} from 'vuex'
import {computed, reactive, ref, watchEffect} from "vue";
import ScatterPlot from "./ScatterPlot.vue";
import BoxPlot from "./BoxPlot.vue";
import BarPlot from "./BarPlot.vue";
import LinePlot from "./LinePlot.vue";

const store = useStore();

// Get chart type
const chartType = computed(() => store.getters['ui/getChartType']())

// Get chart template
const chartTemplate = computed(() => store.getters['charting/getChartTemplate'](chartType.value))

const plateId = 101;
const wells = computed(() => {
  const wellIds = store.getters['ui/getSelectedWellIds']();
  let wells = store.getters['charting/getChartEntity'](wellIds);
  return wells
});

//Make a method to return the property keys of an object
const getKeys = (obj) => {
  if (null) return null;
  return Object.keys(obj);
};
//first property of selectedWells
const x = ref(chartTemplate.value.axisXExpression);
//second property of selectedWells
const y = ref(chartTemplate.value.axisYExpression);
//grouping property of selectedWells
const grouper = ref(chartTemplate.value.grouperExpression);

//Make a reactive object to hold the data for the plot
let data = reactive({
  wells: wells.value.map(well => {return {x: well[x.value], y: well[y.value], grouper: well[chartTemplate.value.grouperExpression]}}),
  template: chartTemplate.value
});

//Update properties when x or y changes
watchEffect(() => {
  data.wells = wells.value.map(well => {return {x: well[x.value], y: well[y.value], grouper: well[grouper.value]}}),
  data.template = chartTemplate.value
});

</script>