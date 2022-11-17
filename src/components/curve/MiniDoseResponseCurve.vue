<template>
  <div class="curve-view" id="drCurve" ref="drCurve">
    <q-menu context-menu>
      <q-list dense>
        <q-item clickable v-close-popup @click="viewDoseResponseCurve">
          <q-item-section avatar><q-icon color="primary" name="show_chart"/></q-item-section>
          <q-item-section>View Dose Response Curve</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup>

import Plotly from "plotly.js-dist-min";
import {onMounted, ref} from "vue";
import {useStore} from "vuex";

const store = useStore()

const props = defineProps(['curvedata'])
const drCurve = ref()

const layout = {
  showlegend: false,
  autosize: false,
  width: 100,
  height: 100,
  margin: { l: 0, r: 0, b: 0, t: 0, pad: 4 }
};

const config = {
  staticPlot: true,
  responsive: true,
  displaylogo: false
}
onMounted(() => {
  const curve = {
    x: props.curvedata?.plotDoseData?.map(d => (d / 2.303)),
    y: props.curvedata?.plotPredictionData,
    mode: 'lines',
    line: {
      shape: 'spline',
      color: props.curvedata?.color
    },
    showlegend: false,
  }

  const datapoints = {
    x: props.curvedata?.wellConcentrations,
    y: props.curvedata?.featureValues,
    mode: 'markers',
    marker: {
      size: props.curvedata?.weights?.map(w => w * 10),
      color: props.curvedata?.color,
    },
    showlegend: false,
  }
  const data = [curve, datapoints]
  Plotly.newPlot(drCurve.value, data, layout, config)
})

const viewDoseResponseCurve = () => {
  store.dispatch('ui/openSideView', 'doseResponseCurve')
}

</script>

<style scoped>
.curve-view {
  min-width: 100px;
  min-height: 100px;
}
</style>
