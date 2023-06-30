<template>
  <Pane>
    <div>
      <q-btn label="Close" icon="close" size="sm" class="oa-action-button" @click="removeChartView" flat dense/>
    </div>
    <div :id="`plot_${chartId}`" ref="plotDiv"/>
  </Pane>
</template>

<script setup>
import Plotly from 'plotly.js-dist'
import {onMounted, ref, watch} from "vue";
import {useStore} from 'vuex'
import {Pane} from "splitpanes";

const store = useStore()

const props = defineProps(["id", 'data', 'update']);
const chartId = ref(props.id)
const plotDiv = ref(null)

const plotData = () => {
  return {
    x: props.data.xValues,
    y: props.data.yValues,
    type: 'line',
    marker: {
      size: 10
    },
  }
}

// Wait for the DOM to be ready
onMounted(() => {
  Plotly.newPlot("plot_" + chartId.value, [plotData()], {autosize: true});
});

const handleResized = () => {
  const maxWidth = plotDiv.value.parentElement.parentElement.offsetWidth
  const chartIndex = props.update.length > chartId.value ? chartId.value : props.update.length - 1
  const chartWidth = maxWidth * (props.update[chartIndex].size / 100)
  Plotly.relayout("plot_" + chartId.value, {width: chartWidth})
}
watch(() => props.update, handleResized);

const removeChartView = () => {
  store.dispatch('ui/removeChartView', chartId.value)
}

</script>
