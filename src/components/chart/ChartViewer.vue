<template>
  <div class="col" v-if="charts.length > 0">
    <Splitpanes @resized="handleResized" ref="splitPane">
      <Chart v-for="chart in charts" :key="chart.id" :id="chart.id" :type="chart.type" :data="data(chart)" :layout="layout(chart)" :update="update" />
    </Splitpanes>
    <div class="row oa-section-body">
      <q-select class="col q-pa-sm" v-model="selectedXAxisFeature" :options="availableFeatures" label="Select x feature"/>
      <q-select class="col q-pa-sm" v-model="selectedYAxisFeature" :options="availableFeatures" label="Select y feature"/>
      <q-select class="col q-pa-sm" v-model="groupBy" :options="groupByOptions" label="Group By"/>
    </div>
    <!--    <q-select v-model="grouper" :options="getKeys(wells[0])" label="Group by"/>-->
    <!--    <GroupBySelectableTable v-if="grouper!='NONE'" :grouperValues="grouperRows" @grouperSelection="updateGroupsShown"/>-->
  </div>
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
const splitPane = ref()

const availableFeatures = ref(["feature1", "feature2", "feature3", "feature4"])
const groupByOptions = ref(["Well Type"])

const selectedXAxisFeature = ref(availableFeatures.value[0])
const selectedYAxisFeature = ref(availableFeatures.value[1])
const groupBy = ref()

const data = (chart) => {
  return {
    x: [1, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9],
    y: [0, 3, 2, 3, 2, 21, 3, 6, 4, 3, 2, 7],
    mode: chart.type === 'scatter' ? 'markers' : null,
    type: chart.type,
    marker: {
      size: 10
    },
  }
}

const layout = (chart) => {
  return {
    autosize: true,
    width: chart.size ? chart.size : null,
    xaxis: {
      title: {
        text: selectedXAxisFeature.value,
      },
    },
    yaxis: {
      title: {
        text: selectedYAxisFeature.value,
      }
    }
  }
}

const handleResized = (event) => {
  const maxWidth = splitPane.value.$el.clientWidth
  const chartWidths = event.map(e => maxWidth * (e.size / 100))

  store.dispatch('ui/updateChartViewWidth', chartWidths)
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
