<template>
    <div ref="chart"/>
    <div class="col oa-section-body">
      <q-select class="q-pa-xs"
                v-model="selectedProtocol"
                :options="plateProtocols"
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
import {useUIStore} from "@/stores/ui";
import useScatterChartData from "@/composable/scatterChartData";
import useBoxPlotData from "@/composable/boxPlotData";
import useHistogramData from "@/composable/histogramData";
import WellUtils from "@/lib/WellUtils";

const uiStore = useUIStore()
const props = defineProps(['width', 'chartId', 'update']);

const chartView = computed(() => uiStore.getChartView(props.chartId))
const showXAxisSelector = computed(() => chartView.value.type === 'scatter' || chartView.value.type === 'histogram');
const showYAxisSelector = computed(() => chartView.value.type === 'scatter' || chartView.value.type === 'box');

const chart = ref(null)
const plateProtocols = ref([])
const plotValueOptions = ref()
const selectedProtocol = ref({})
const selectedXAxisOption = ref()
const selectedYAxisOption = ref()

onMounted(() => initSelectedValues())
const initSelectedValues = () => {
  plateProtocols.value = uiStore.protocols
  if (!(selectedProtocol.value) || !plateProtocols.value.map(plateProtocol => plateProtocol.id).includes(selectedProtocol.value.id)) {
    selectedProtocol.value = plateProtocols.value[0]

  }
  updatePlotValueOptions()
  handleChartUpdate()

  Plotly.react(chart.value, chartPlot.value?.data, layout(chartView.value), {displaylogo: false})
  chart.value.on('plotly_click', (data) => {
    const selectedWells = data?.points?.map(p => p.customdata) ?? []
    uiStore.selectedWells = selectedWells

    const selectedWellIndices = uiStore.selectedWells.map(well => WellUtils.getWellNr(well.row, well.column, uiStore.selectedPlate.columns) - 1)
    if (selectedWellIndices.length > 0) Plotly.restyle(chart.value, 'selectedpoints', [selectedWellIndices])
  })

  chart.value.on('plotly_selected', (data) => {
    const selectedWells = data?.points?.map(p => p.customdata) ?? []
    uiStore.selectedWells = selectedWells
  })

  chart.value.addEventListener('contextmenu', (ev) => {
    ev.preventDefault()
  })
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

  if (!(selectedXAxisOption.value) || !plotValueOptions.value.map(plotValueOption => plotValueOption.value).includes(selectedXAxisOption.value.value)) {
    selectedXAxisOption.value = plotValueOptions.value[0]
  }
  if (!(selectedYAxisOption.value) || !plotValueOptions.value.map(plotValueOption => plotValueOption.value).includes(selectedYAxisOption.value.value)) {
    selectedYAxisOption.value = plotValueOptions.value[1]
  }
}

const generateFeatureOptions = () => {
  return selectedProtocol.value?.features.map(feature => ({ type: 'FEATURE_ID', label: `${feature.name}`, value: feature.id})) ?? []
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

const handleChartUpdate = () => {
  const chartView = computed(() => uiStore.getChartView(props.chartId))
  if (chartView.value.type === 'scatter') {
    const scatterChartData = useScatterChartData()
    scatterChartData.getChartData(uiStore.selectedPlate.id, selectedProtocol.value?.id, selectedXAxisOption.value.value, selectedXAxisOption.value.type, selectedYAxisOption.value.value, selectedYAxisOption.value.type, groupBy.value.value).then((scatterData) => {
      console.log("Scatter Chart Data: " + Object.keys(scatterData))
      const data = Object.keys(scatterData).map(groupByKey => {return {x: scatterData[groupByKey].xvalues, y: scatterData[groupByKey].yvalues, customdata: scatterData[groupByKey].customdata, mode: "markers", type: "scatter", name: groupByKey}})
      chartPlot.value = {
        data: data,
        layout: {
          chartTitle: "Plate Scatter Plot",
          xAxisLabel: selectedXAxisOption.value?.label ?? '',
          yAxisLabel: selectedYAxisOption.value?.label ?? ''
        }
      }
    })
  } else if (chartView.value.type === 'box') {
    const boxPlotData = useBoxPlotData()
    boxPlotData.getChartData(uiStore.selectedPlate.id, selectedProtocol.value?.id, selectedYAxisOption.value.value, selectedYAxisOption.value.type, groupBy.value.value).then(boxPlotData => {
      console.log("Box Plot Data: " + JSON.stringify(boxPlotData))
      const data = Object.keys(boxPlotData).map(groupByKey => {return {y: boxPlotData[groupByKey].yvalues, type: "box", name: groupByKey}})
      chartPlot.value = {
        data: data,
        layout: {
          chartTitle: "Plate Box Plot",
          yAxisLabel: selectedYAxisOption.value?.label ?? ''
        }
      }
    })
  } else if (chartView.value.type === 'histogram') {
    const histogramData = useHistogramData()
    histogramData.getChartData(uiStore.selectedPlate.id, selectedProtocol.value?.id, selectedXAxisOption.value.value, selectedXAxisOption.value.type, groupBy.value.value).then(histogramData => {
      console.log("Histogram Data: " + JSON.stringify(histogramData))
      const data = Object.keys(histogramData).map(groupByKey => {return {x: histogramData[groupByKey].xvalues, type: "histogram", name: groupByKey}})
      chartPlot.value = {
        data: data,
        layout: {
          chartTitle: "Plate Histogram Plot",
          yAxisLabel: selectedXAxisOption.value?.label ?? ''
        }
      }
    })
  }
}

const handlePlotUpdate = () => {
  console.log("handleUpdatePlot: chart has been updated!")
  if (chartPlot.value) {
    Plotly.react(chart.value, chartPlot.value?.data, layout(chartView.value), {displaylogo: false})

    const selectedWellIndices = uiStore.selectedWells.map(well => WellUtils.getWellNr(well.row, well.column, uiStore.selectedPlate.columns) - 1)
    if (selectedWellIndices.length > 0) Plotly.restyle(chart.value, 'selectedpoints', [selectedWellIndices])
  }
}

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
watch(uiStore.selectedWells, () =>  handlePlotUpdate())

const handleProtocolSelection = () => {
  updatePlotValueOptions()
  handleChartUpdate()
}

const createSelectionHandler = () => () => handleChartUpdate();
const selectionHandler = createSelectionHandler();

</script>
