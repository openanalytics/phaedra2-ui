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

const gridColumnStyle = "repeat(3, 1fr)";

const props = defineProps(['plates', 'experiment']);

const protocols = ref([])
const selectedProtocol = ref(null)
const selectedFeature = ref(null)

const {onResult, onError} = resultDataGraphQlAPI.protocolsByExperimentId(props.experiment.id)
onResult(({data}) => protocols.value = data.protocols)

const plateDataPerPlate = ref(props.plates.map(p => ({"plate": p, "resultData": {}})))

// Build an array of resultData objects, one per plate according to the currently selected feature.
const onFeatureSelection = (protocol, feature) => {
  selectedProtocol.value = protocol
  selectedFeature.value = feature
}

watch([selectedProtocol, selectedFeature], () => {
  for (let i = 0; i < plateDataPerPlate.value.length; i++) {
    const plateId = plateDataPerPlate.value[i].plate.id

    // TODO: Implement onError handler
    const {onResult, onError} = resultDataGraphQlAPI.resultDataByPlateIdAndProtocolIdAndFeatureId(plateId, selectedProtocol.value.id, selectedFeature.value.id)
    onResult(({data}) => {
      plateDataPerPlate.value[i].resultData = data.resultData
    })
  }
})
</script>

<style scoped>
.gridContainer {
  display: grid;
  grid-template-columns: v-bind(gridColumnStyle);
}
</style>
