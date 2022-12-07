<template>
  <div class="viewer-panel relative-position">
    <Chart :chartTemplate="chartTemplate" :data="data" />
    <q-select id="x" v-model="x" :options="getKeys(wells[0])" label="X-axis"/>
    <q-select v-model="y" :options="getKeys(wells[0])" label="Y-axis"/>
    <q-select v-model="grouper" :options="getKeys(wells[0])" label="Group by"/>
    {{grouper}}
    {{data.grouperCopy}}
    <GroupBySelectableTable :grouperValues="grouperRows" @grouperSelection="updateGroupsShown"/>
  </div>
</template>

<script setup>
import PlotLy from 'plotly.js-dist'
import {useStore} from 'vuex'
import {computed, reactive, ref, watchEffect} from "vue";
import Chart from "./Chart";
import GroupBySelectableTable from "./GroupBySelectableTable";
import ChartUtils from "@/lib/ChartUtils";
const store = useStore();

// Get chart type
const chartType = computed(() => store.getters['ui/getChartType']())

// Get chart template
const chartTemplate = computed(() => store.getters['charting/getChartTemplate'](chartType.value))
console.log(chartType.value)
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
//not selected list of grouper values
let notSelected = [];
//colors for each grouper value
let colors = [];

//Tuple list (grouperValue, boolean) to enable/disable grouper values
const grouperValues = computed(() => {
  let values = [];
  wells.value.forEach(well => {
    if (!values.includes(well[grouper.value])) {
      values.push(well[grouper.value]);
    }
  });
  return values;
});
const grouperRows = computed(() => {
  let rows = [];
  grouperValues.value.forEach(grouperValue => {
    rows.push({
      value: grouperValue,
      color: data.colors[grouperValue]
    })
  });
  return rows;
});

//Make a reactive object to hold the data for the plot
let data = reactive({
  wells: ChartUtils.mapWellsToData(wells.value, x.value, y.value, grouper.value, notSelected),
  template: chartTemplate.value,
  colors: ChartUtils.getGrouperColors(wells.value),
  grouperCopy: null
});

const updateData = () => {
    data.wells = ChartUtils.mapWellsToData(wells.value, x.value, y.value, grouper.value, notSelected),
    data.template = chartTemplate.value,
    data.colors = (data.grouperCopy===grouper.value)?data.colors:ChartUtils.getGrouperColors(data.wells),
    data.grouperCopy = grouper.value;
}

const updateGroupsShown = (notSelectedList) => {
  notSelected = notSelectedList;
  updateData();
}

//Update properties when x or y changes
watchEffect(() => updateData());

</script>