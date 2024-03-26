<template>
    <div id="chart" ref="plot"/>
    <div class="col oa-section-body">
      <q-select class="q-pa-xs"
                v-model="selectedProtocol"
                :options="plateStore.protocols"
                :option-value="'id'"
                :option-label="'name'"
                label="Select protocol"
                @update:model-value="handleProtocolSelection"
                dense/>
      <q-select class="q-pa-xs"
                v-if="showXAxisSelector"
                v-model="selectedXAxisOption"
                :options="plotValueOptions"
                :option-label="'label'"
                label="Select x values"
                @update:model-value="selectionHandler"
                dense/>
      <q-select class="q-pa-xs"
                v-if="showYAxisSelector"
                v-model="selectedYAxisOption"
                :options="plotValueOptions"
                :option-label="'label'"
                label="Select y values"
                @update:model-value="selectionHandler"
                dense/>
      <q-select class="q-pa-xs"
                v-model="groupBy"
                :options="groupByOptions"
                :option-value="'value'"
                :option-label="'label'"
                @update:model-value="selectionHandler"
                label="Group by"
                dense/>
    </div>
</template>

<script setup>
import Plotly from "plotly.js-cartesian-dist-min"
import {computed, onMounted, onUpdated, reactive, ref, watch} from "vue"
import {useStore} from 'vuex'
import {Pane} from "splitpanes";
import chartsGraphQlAPI from '@/api/graphql/charts'
import resultDataGraphQlAPI from '@/api/graphql/resultdata'
import {useUIStore} from "@/stores/ui";
import {usePlateStore} from "@/stores/plate";
import useScatterChartData from "@/composable/scatterChartData";
import useBoxPlotData from "@/composable/boxPlotData";
import useHistogramData from "@/composable/histogramData";

const store = useStore();
const uiStore = useUIStore()
const plateStore = usePlateStore()
const props = defineProps(['width', 'chartId', 'update']);

const chartView = computed(() => uiStore.getChartView(props.chartId))
const showXAxisSelector = computed(() => chartView.value.type === 'scatter' || chartView.value.type === 'histogram');
const showYAxisSelector = computed(() => chartView.value.type === 'scatter' || chartView.value.type === 'box');

const plotValueOptions = ref()
const selectedProtocol = ref()
const selectedXAxisOption = ref()
const selectedYAxisOption = ref()

onMounted(() => initSelectedValues())
const initSelectedValues = () => {
  selectedProtocol.value = plateStore.protocols[0]
  updatePlotValueOptions()
  handleChartUpdate()
}

const updatePlotValueOptions = () => {
  plotValueOptions.value = [
    {type: 'WELL_PROPERTY', label: "Well ID", value: "wellId"},
    {type: 'WELL_PROPERTY', label: "Well Number", value: "wellNr"},
    {type: 'WELL_PROPERTY', label: "Well Row", value: "row"},
    {type: 'WELL_PROPERTY', label: "Well Column", value: "column"},
    {type: 'WELL_PROPERTY', label: "Well Type", value: "wellType"},
    {type: 'WELL_PROPERTY', label: "Well Substance", value: "wellSubstance"},
    ...generateFeatureOptions()
  ]

  selectedXAxisOption.value = plotValueOptions.value[0]
  selectedYAxisOption.value = plotValueOptions.value[1]
}

const generateFeatureOptions = () => {
  return selectedProtocol.value.features.map(feature => ({ type: 'FEATURE_ID', label: `${feature.name}`, value: feature.id}))
}

const groupByOptions = ref([
  {label: 'No grouping', value: 'none'},
  {label: 'Group by well row', value: 'row'},
  {label: 'Group by well column', value: 'column'},
  {label: 'Group by well type', value: 'welltype'},
  {label: 'Group by well status', value: 'status'},
  {label: 'Group by substance', value: 'substance'}
])
const groupBy = ref(groupByOptions.value[0])

const chartPlot = reactive([])
const plot = ref()

const handleChartUpdate = () => {
  const chartView = computed(() => uiStore.getChartView(props.chartId))
  if (chartView.value.type === 'scatter') {
    const scatterChartData = useScatterChartData()
    scatterChartData.getChartData(chartView.value.plateId, selectedProtocol.value.id, selectedXAxisOption.value.value, selectedXAxisOption.value.type, selectedYAxisOption.value.value, selectedYAxisOption.value.type).then((scatterData) => {
      chartPlot.value = {
        data: [{
          x: scatterData.xvalues,
          y: scatterData.yvalues,
          mode: "markers",
          type: "scatter"
        }],
        layout: {
          chartTitle: "Plate Scatter Plot",
          xAxisLabel: selectedXAxisOption.value.label,
          yAxisLabel: selectedYAxisOption.value.label,
        }
      }
    })
  } else if (chartView.value.type === 'box') {
    const boxPlotData = useBoxPlotData()
    boxPlotData.getChartData(chartView.value.plateId, selectedProtocol.value.id, selectedYAxisOption.value.value, selectedYAxisOption.value.type).then(boxPlotData => {
      chartPlot.value = {
        data: [{
          y: boxPlotData.yvalues,
          type: "box",
        }],
        layout: {
          chartTitle: "Plate Box Plot",
          yAxisLabel: selectedYAxisOption.value.label
        }
      }
    })
  } else if (chartView.value.type === 'histogram') {
    const histogramData = useHistogramData()
    histogramData.getChartData(chartView.value.plateId, selectedProtocol.value.id, selectedXAxisOption.value.value, selectedXAxisOption.value.type).then(histogramData => {
      chartPlot.value = {
        data: [{
          x: histogramData.xvalues,
          type: "histogram",
        }],
        layout: {
          chartTitle: "Plate Histogram Plot",
          yAxisLabel: selectedXAxisOption.value.label
        }
      }
    })
  }
}

const handlePlotUpdate = () => {
  console.log("handleUpdatePlot: chart has been updated!")
  Plotly.react("chart", chartPlot.value?.data, layout(chartView.value), {displaylogo: false});
}

onUpdated(() => handlePlotUpdate())

const layout = (chartView) => {
  return {
    autosize: true,
    width: chartView.size ? chartView.size : null,
    title: chartPlot.value?.layout?.chartTitle ?? '',
    xaxis: {
      title: {
        text: chartPlot.value?.layout?.xAxisLabel ?? '',
      },
    },
    yaxis: {
      title: {
        text: chartPlot.value?.layout?.yAxisLabel ?? '',
      }
    }
  }
}

watch(() => props.update, handlePlotUpdate)
watch(() => chartPlot.value, handlePlotUpdate)

const handleProtocolSelection = () => {
  updatePlotValueOptions()
  handleChartUpdate()
}

const createSelectionHandler = () => () => handleChartUpdate();
const selectionHandler = createSelectionHandler();

</script>
