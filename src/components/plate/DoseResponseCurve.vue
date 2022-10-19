<template>
  <div class="curve-properties">
    <q-select
        v-model="selectedSubstances"
        :options="plateSubstanceNames"
        multiple
        label="Select substance"
        @update:model-value="value => updateDRCPlotView(value)">
      <template v-slot:append>
        <q-icon
            v-if="selectedSubstances !== null"
            class="cursor-pointer"
            name="clear"
            @click.stop.prevent="selectedSubstances = null"
        />
      </template>
    </q-select>
  </div>
  <div id="chart" ref="el">
  </div>
</template>

<script setup>

import Plotly from "plotly.js-dist-min";
import {onMounted, ref} from "vue";
import {useCurveDataStore} from "@/stores/curvedata";

const props = defineProps(['plate'])

const curvedataStore = useCurveDataStore()
curvedataStore.loadPlateCurves(props.plate.id)
const plateCurves = curvedataStore.getCurvesByPlateId(props.plate.id)

const plateSubstanceNames = curvedataStore.getCurvesSubstanceNames(props.plate.id)
const selectedSubstances = ref(null)

let data = plateCurves.map(pc => {
  const result = {
    x: pc.plotDoseData,
    y: pc.plotPredictionData,
    mode: 'lines',
    line: {
      shape: 'spline'
    },
    name: pc.substanceName
  }
  return result
})

var layout = {
  legend: {
    yref: 'paper'
  }};

const el = ref()

onMounted(() => {
  Plotly.newPlot(el.value, data, layout);
})

const updateDRCPlotView = (value) => {
  console.log(value)
  data = plateCurves.map(pc => {
    if (pc.substanceName in value) {
      const result = {
        x: pc.plotDoseData,
        y: pc.plotPredictionData,
        mode: 'lines',
        line: {
          shape: 'spline'
        },
        name: pc.substanceName
      }
      return result
    }
  })
}

</script>
