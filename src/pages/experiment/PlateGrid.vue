<template>
  <div class="row" style="width: 100%">
    <div class="col-10 gridContainer">
      <div v-for="plate in plates" :key="plate.id" class="q-pa-sm">
        <MiniHeatmap :plate=plate :feature=selectedFeature :plate-result="plateResult(plate.id)"></MiniHeatmap>
      </div>
    </div>
    <div class="col-2 q-pa-sm">
      <FeatureSelector
          :protocols=protocols
          @featureSelection="handleFeatureSelection"
      ></FeatureSelector>
    </div>
  </div>
</template>

<style scoped>
  .gridContainer {
    display: grid;
    grid-template-columns: v-bind(gridColumnStyle);
  }
</style>

<script>
import {ref, computed} from 'vue'
import {useStore} from 'vuex'

import MiniHeatmap from "@/components/widgets/MiniHeatmap.vue"
import FeatureSelector from "@/components/widgets/FeatureSelector.vue"

export default {
  props: {
    experiment: Object
  },
  components: {
    MiniHeatmap,
    FeatureSelector
  },
  setup(props) {
    const store = useStore()

    const plates = computed(() => store.getters['plates/getByExperimentId'](props.experiment.id))
    const plateResult = (plateId) => plateResults[plateId]
    const protocols = ref([])
    const plateResults = {}

    // helper function to asynchronous load all data
    async function load() {
      // 1. get plates
      await store.dispatch('plates/loadByExperimentId', props.experiment.id);
      const plateIds = plates.value.map(plate => plate.id)
      const protocolIds = [];

      // 2. get PlatResults in order to get protocolIds (PlateResults are re-used for the heatmaps)
      const reqs = [];
      for (const plateId of plateIds) {
        reqs.push(store.dispatch('resultdata/loadLatestPlateResult', {plateId})
            .then(() => {
              const plateResult = store.getters['resultdata/getLatestPlateResult'](plateId)
              plateResults[plateId] = plateResult;
              protocolIds?.push(...Object.keys(plateResult?.protocols));
            }))
      }

      // 3. load protocols once we got all ids
      await Promise.all(reqs);
      const uniqueProtocolIds = Array.from(new Set(protocolIds)).map(f => parseInt(f))
      await store.dispatch('protocols/loadByIds', uniqueProtocolIds);
      protocols.value = store.getters['protocols/getByIds'](uniqueProtocolIds);
    }

    load();

    const selectedFeature = ref(null)
    const handleFeatureSelection = function (feature) {
      selectedFeature.value = feature
    }

    return {
      protocols,
      plates,
      plateResult,
      gridColumnStyle: "repeat(3, 1fr)",
      selectedFeature,
      handleFeatureSelection
    }
  }
}
</script>
