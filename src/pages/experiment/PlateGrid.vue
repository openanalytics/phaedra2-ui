<template>
    <div style="width: 100%">
        <div class="row q-pa-sm">
            <FeatureSelector :protocols=protocols @featureSelection="onFeatureSelection"/>
        </div>
        <div class="row gridContainer">
            <div v-for="(pd, index) in plateDataPerPlate" :key="index" class="q-pa-sm">
                <MiniHeatmap :plate="pd.plate" :plateData="pd.resultData" />
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import MiniHeatmap from "@/components/widgets/MiniHeatmap.vue"
import FeatureSelector from "@/components/widgets/FeatureSelector.vue"
import resultDataGraphQlAPI from "@/api/graphql/resultdata";

const props = defineProps(['plates', 'experiment']);
const gridColumnStyle = "repeat(3, 1fr)";
const protocols = resultDataGraphQlAPI.protocolsByExperimentId(props.experiment.id)
const selectedProtocol = ref(null)
const selectedFeature = ref(null)

const plateDataPerPlate = ref(props.plates.map(p => ({"plate": p, "resultData": {}})))

// Build an array of resultData objects, one per plate according to the currently selected feature.
const onFeatureSelection = (protocol, feature) => {
  selectedProtocol.value = protocol
  selectedFeature.value = feature
}

watch([selectedProtocol, selectedFeature], () => {
  console.log("PlateGrid watch protocol: " + JSON.stringify(selectedProtocol.value))
  console.log("PlateGrid watch feature: " + JSON.stringify(selectedFeature.value))
  for (let i = 0; i < plateDataPerPlate.value.length; i++) {
    const plateId = plateDataPerPlate.value[i].plate.id
    plateDataPerPlate.value[i].resultData = resultDataGraphQlAPI.resultDataByPlateIdAndProtocolIdAndFeatureId(plateId, selectedProtocol.value.id, selectedFeature.value.id)
  }
  console.log("PlateGrid watch plateDataPerPlate: " + JSON.stringify(plateDataPerPlate.value))
})
</script>

<style scoped>
.gridContainer {
  display: grid;
  grid-template-columns: v-bind(gridColumnStyle);
}
</style>
