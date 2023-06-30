<template>
<!--  <div class="viewer-panel relative-position">-->
  <Splitpanes @resized="updateChartLayout">
    <Chart v-for="chart in charts" :key="chart.id" :id="chart.id" :type="chart.type" :data="data" :update="update"/>
  </Splitpanes>
<!--    <q-select id="x" v-model="x" :options="getKeys(wells[0])" label="X-axis"/>-->
<!--    <q-select v-model="y" :options="getKeys(wells[0])" label="Y-axis"/>-->
<!--    <q-select v-model="grouper" :options="getKeys(wells[0])" label="Group by"/>-->
<!--    <GroupBySelectableTable v-if="grouper!='NONE'" :grouperValues="grouperRows" @grouperSelection="updateGroupsShown"/>-->
<!--  </div>-->
</template>

<script setup>
import {useStore} from 'vuex'
import {computed, onMounted, onUnmounted, reactive, ref, watchEffect} from "vue";
import {Splitpanes} from "splitpanes";
import Chart from "./Chart";
const store = useStore();

const props = defineProps(['chartTemplate'])

const charts = computed(() => store.getters['ui/getChartViews']())
const update = ref(Date.now())
// Get chart type
// const chartType = computed(() => store.getters['ui/getChartType']())
// const chartId = ref(props.chartTemplate.id)
// const chartType = ref(props.chartTemplate.type)
const data = ref({
  xValues: [1, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9],
  yValues: [0, 3, 2, 3, 2, 21, 3, 6, 4, 3, 2, 7]
})

const updateChartLayout = (event) => {
  update.value = event
}

// Get chart template
// const chartTemplate = computed(() => store.getters['charting/getChartTemplate'](props.chartTemplate.type))

// const wells = computed(() => {
//   const wellIds = store.getters['ui/getSelectedWellIds']();
//   let wells = store.getters['charting/getChartEntity'](wellIds);
//   return wells
// });

//Method to return the property keys of an object
// const getKeys = (obj) => {
//   if (null) return null;
//   var keys = JSON.parse(JSON.stringify(Object.keys(obj)));
//   //Add NONE option in the front
//   keys.unshift("NONE");
//   return keys;
// };

//first property of selectedWells
// const x = ref(props.chartTemplate.axisXExpression);
//second property of selectedWells
// const y = ref(props.chartTemplate.axisYExpression);
//grouping property of selectedWells
// const grouper = ref(props.chartTemplate.grouperExpression);
//not selected list of grouper values
// let notSelected = [];

// List of (value, color) tuples for each grouper value
// const grouperRows = computed(() => {
//   let rows = [];
//   Object.keys(data.colors).forEach(grouperValue => {
//     rows.push({
//       value: grouperValue,
//       color: data.colors[grouperValue]
//     })
//   });
//   return rows;
// });

//Make a reactive object to hold the data for the plot
// let data = reactive({
//   wells: ChartUtils.mapWellsToData(wells.value, x.value, y.value, grouper.value, notSelected),
//   template: props.chartTemplate,
//   colors: ChartUtils.getGrouperColors(wells.value),
//   grouperCopy: null
// });

// const updateData = () => {
//     data.wells = ChartUtils.mapWellsToData(wells.value, x.value, y.value, grouper.value, notSelected),
//     data.template = props.chartTemplate,
//     data.colors = (data.grouperCopy===grouper.value)?data.colors:ChartUtils.getGrouperColors(data.wells),
//     data.grouperCopy = grouper.value;
// }

// const updateGroupsShown = (notSelectedList) => {
//   notSelected = notSelectedList;
//   updateData();
// }

//Update properties when x or y changes
// watchEffect(() => updateData());

</script>
