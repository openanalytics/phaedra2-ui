<template>
  <Pane style="background-color: #E6E6E6">
    <q-btn label="Close" icon="close" size="sm" class="oa-action-button" @click="removeChartView" flat dense/>
    <div :id="`plot_${chartView.id}`"/>

    <div class="col oa-section-body">
      <q-select class="q-pa-xs"
                v-model="selectedProtocol"
                :options="protocolOptions"
                :option-value="'id'"
                :option-label="'name'"
                label="Select protocol"
                @update:model-value="handleProtocolSelection"
                dense/>
      <q-select class="q-pa-xs"
                v-if="chartView.type === 'scatter'"
                v-model="selectedXAxisFeature"
                :options="selectedProtocol?.features"
                :option-value="'id'"
                :option-label="'name'"
                label="Select x feature"
                @update:model-value="handleXAxisFeatureSelection"
                dense/>
      <q-select class="q-pa-xs"
                v-model="selectedYAxisFeature"
                :options="selectedProtocol?.features"
                :option-value="'id'"
                :option-label="'name'"
                label="Select y feature"
                @update:model-value="handleYAxisFeatureSelection"
                dense/>
      <q-select class="q-pa-xs"
                v-model="groupBy"
                :options="groupByOptions"
                :option-value="'value'"
                :option-label="'label'"
                @update:model-value="handleGroupBySelection"
                label="Group by"
                dense/>
    </div>
  </Pane>
</template>

<script setup>
import Plotly from 'plotly.js-dist'
import {computed, onMounted, reactive, ref, watch} from "vue"
import {useStore} from 'vuex'
import {Pane} from "splitpanes";
import chartsGraphQlAPI from '@/api/graphql/charts'
import resultDataGraphQlAPI from '@/api/graphql/resultdata'

const store = useStore();
const props = defineProps(['chartId', 'update']);

const chartView = computed(() => store.getters['ui/getChartView'](props.chartId))

const protocolOptions = resultDataGraphQlAPI.protocolsByPlateId(chartView.value.plateId)

const selectedProtocol = ref()
const selectedXAxisFeature = ref()
const selectedYAxisFeature = ref()
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
  console.log("handleChartUpdate: chart has been updated!")
  const chartView = computed(() => store.getters['ui/getChartView'](props.chartId))
  chartPlot.value = chartsGraphQlAPI.basicPlot(chartView.value.type, chartView.value.plateId, selectedProtocol.value?.id, selectedXAxisFeature.value?.id, selectedYAxisFeature.value?.id, groupBy.value.value)
}

const handlePlotUpdate = () => {
  console.log("handleUpdatePlot: chart has been updated!")
  Plotly.react("plot_" + chartView.value.id, chartPlot.value?.data, layout(chartView.value), {displaylogo: false});
}

const initSelectedValues = () => {
  selectedProtocol.value = protocolOptions.value[0]
  selectedXAxisFeature.value = selectedProtocol.value.features[0]
  selectedYAxisFeature.value = selectedProtocol.value.features[1]

  handleChartUpdate()
}

const removeChartView = () => {
  store.dispatch('ui/removeChartView', props.chartId)
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

watch(() => protocolOptions.value, initSelectedValues)

watch(() => chartPlot.value, handlePlotUpdate)

const handleProtocolSelection = (selectedProtocol) => {
  selectedXAxisFeature.value = selectedProtocol.features[0]
  selectedYAxisFeature.value = selectedProtocol.features[1]
  handleChartUpdate()
}

const handleXAxisFeatureSelection = (selectedXAxisFeature) => {
  console.log("Selected x-axis feature " + JSON.stringify(selectedXAxisFeature.value))
  handleChartUpdate()
}

const handleYAxisFeatureSelection = (selectedYAxisFeature) => {
  console.log("Selected x-axis feature " + JSON.stringify(selectedYAxisFeature.value))
  handleChartUpdate()
}

const handleGroupBySelection = (groupBy) => {
  console.log("Selected group by type " + JSON.stringify(groupBy.value))
  handleChartUpdate()
}

</script>
