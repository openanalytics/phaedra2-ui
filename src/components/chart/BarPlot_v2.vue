<template>
  <Pane>
    <q-btn label="Close" icon="close" size="sm" class="oa-action-button" @click="removeChartView" flat dense/>
    <div :id="`plot_${chartId}`" class="q-ma-sm"/>
  </Pane>
</template>

<script setup>
import Plotly from 'plotly.js-dist'
import {onMounted, ref, watch} from "vue";
import {useStore} from 'vuex'
import {Pane} from "splitpanes";

const store = useStore()

const props = defineProps(["id", 'data', 'layout']);
const chartId = ref(props.id)

// Wait for the DOM to be ready
onMounted(() => {
  Plotly.newPlot("plot_" + chartId.value, [props.data], props.layout);
});

const handleLayout = () => {
  Plotly.newPlot("plot_" + chartId.value, [props.data], props.layout);
}
watch(() => props.layout, handleLayout);

const removeChartView = () => {
  store.dispatch('ui/removeChartView', props.id)
}
</script>
