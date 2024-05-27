<template>
    <div style="width: 100%">
        <div class="row q-pa-sm">
            <FeatureSelector :protocols=protocols
                             :measurements=measurements
                             @featureOptionSelection="handleFeatureOptionSelection"
                             @rawFeatureSelection="handleRawFeatureSelection"
                             @calculatedFeatureSelection="handleCalculatedFeatureSelection"/>
        </div>
        <div class="row gridContainer">
            <div v-for="(pd, index) in plateDataPerPlate" :key="index" class="q-pa-sm">
                <MiniHeatmap :plate="pd.plate" :plateData="pd.resultData" />
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import MiniHeatmap from "@/components/widgets/MiniHeatmap.vue"
import FeatureSelector from "@/components/widgets/FeatureSelector.vue"
import resultDataGraphQlAPI from "@/api/graphql/resultdata";
import measurementsGraphQlAPI from "@/api/graphql/measurements";
import projectsGraphQlAPI from "@/api/graphql/projects";

const gridColumnStyle = "repeat(3, 1fr)";

const props = defineProps(['plates', 'experiment']);

const protocols = ref([])
const measurements = ref([])

const fetchMeasurementsByExperiment = () => {
  const {onResult} = projectsGraphQlAPI.activeMeasurementsByExperimentId(props.experiment.id)
  onResult(({data}) => measurements.value = data.plateMeasurements.filter(m => m !== null))
}
fetchMeasurementsByExperiment()

const fetchProtocolsByExperiment = () => {
  const {onResult, onError} = resultDataGraphQlAPI.protocolsByExperimentId(props.experiment.id)
  onResult(({data}) => protocols.value = data.protocols)
}
fetchProtocolsByExperiment()

const plateDataPerPlate = ref(props.plates.map(p => ({"plate": p, "resultData": {}})))

const handleFeatureOptionSelection = () => {
  plateDataPerPlate.value = props.plates.map(p => ({"plate": p, "resultData": {}}))
}

const handleRawFeatureSelection = (rawFeature) => {
  for (let i = 0; i < plateDataPerPlate.value.length; i++) {
    // TODO: Implement onError handler
    const {onResult} = measurementsGraphQlAPI.measurementWellData(rawFeature.measurementId,
        rawFeature.column)
    onResult(({data}) => {
      plateDataPerPlate.value[i].resultData = {values: data?.wellData ? data.wellData : []}
    })
  }
}

const handleCalculatedFeatureSelection = (calculatedFeature) => {
  for (let i = 0; i < plateDataPerPlate.value.length; i++) {
    const plateId = plateDataPerPlate.value[i].plate.id

    // TODO: Implement onError handler
    const {onResult, onError} = resultDataGraphQlAPI.featureValuesByPlateIdAndFeatureIdAndProtocolId(plateId, calculatedFeature.featureId, calculatedFeature.protocolId)
    onResult(({data}) => {
      plateDataPerPlate.value[i].resultData = { values: data?.featureValues ? data.featureValues.map(fv => fv.value) : [] }
    })
  }
}
</script>

<style scoped>
.gridContainer {
  display: grid;
  grid-template-columns: v-bind(gridColumnStyle);
}
</style>
