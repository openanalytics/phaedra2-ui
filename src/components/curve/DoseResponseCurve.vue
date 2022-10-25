<template>
  <div class="viewer-panel relative-position">
    <div class="col" style="width: auto">
      <div class="row" style="width: auto" id="chart" ref="el" />
<!--      <div class="row">-->
<!--        <q-select-->
<!--            v-model="selectedSubstances"-->
<!--            :options="selectedWellSubstances"-->
<!--            multiple-->
<!--            label="Select substance"-->
<!--            @update:model-value="value => updateDRCPlotView"-->
<!--            dense>-->
<!--          <template v-slot:append>-->
<!--            <q-icon-->
<!--                v-if="selectedWellSubstances !== null"-->
<!--                class="cursor-pointer"-->
<!--                name="clear"-->
<!--                @click.stop.prevent="clear()"-->
<!--            />-->
<!--          </template>-->
<!--        </q-select>-->
<!--      </div>-->
    </div>

  </div>
</template>

<script setup>

import Plotly from "plotly.js-dist-min";
import ColorUtils from "@/lib/ColorUtils";
import {computed, onMounted, ref, watch} from "vue";
import {useCurveDataStore} from "@/stores/curvedata";
import {useStore} from "vuex";

const props = defineProps(['plate'])

const store = useStore()
const curvedataStore = useCurveDataStore()

const selectedWells = computed( () => {
    return store.getters['ui/getSelectedWells']();
})
const selectedWellSubstances = computed(() => {
  return selectedWells.value.map(well => well.wellSubstance.name)
})

const plateIds = [...new Set(selectedWells.value.map(well => well.plateId))]
// curvedataStore.loadPlateCurves(plateIds)

var layout = {
  autosize: true
};

const el = ref()

// onMounted(() => {
//   const data = curveData.value.map(drc => drc.curve)
//   Plotly.newPlot(el.value, data, layout);
// })



const selectedSubstances = ref(selectedWellSubstances.value)
const updateDRCPlotView = () => {
  const dcCurves = curvedataStore.getCurvesByPlateIdAndSubstances(plateIds, selectedWellSubstances.value)
  if (dcCurves) {
    const curveData = dcCurves.map(c => {
      const curve = {
        x: c.plotDoseData.map(d => (d / 2.303)),
        y: c.plotPredictionData,
        mode: 'lines',
        line: {
          shape: 'spline',
          color: c.color
        },
        showlegend: true,
        name: c.substanceName
      }

      const selectedWellIds = selectedWells.value.map(well => well.id)
      const colors = c.wells.map(well => selectedWellIds.includes(well) ? 'rgb(15,15,15)' : c.color)
      const datapoints = {
        x: c.wellConcentrations,
        y: c.featureValues,
        mode: 'markers',
        marker: {
          size: 15,
          color: c.color,
          line: {
            color: colors,
            width: 3
          }
        },
        showlegend: false,
        name: c.substanceName
      }
      return {"substanceName": c.substanceName, "curve": curve, "datapoints": datapoints}
    })

    const line = curveData.map(cData => cData.curve)
    const scatter = curveData.map(cData => cData.datapoints)
    const data = line.concat(scatter)
    Plotly.newPlot(el.value, data, layout, {responsive: true, displaylogo: false});
  }
}

const clear = () => {
  selectedSubstances.value = null;
  Plotly.newPlot(el.value, dcCurves.map(drc => drc.curve), layout);
}

watch(selectedWells, updateDRCPlotView);

</script>
