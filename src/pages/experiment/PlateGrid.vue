<template>
  <div class="row" style="width: 100%">
    <div class="col-10 gridContainer">
      <div v-for="plate in plates" :key="plate.id" class="q-pa-sm">
        <MiniHeatmap :plate=plate :feature=selectedFeature :plate-result="plateResults[plate.id]"></MiniHeatmap>
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
    const protocols = ref([])
    const plateResults = {}

    async function load() {
      // 1. Load plates
      await store.dispatch('plates/loadByExperimentId', props.experiment.id);
      const plateIds = plates.value.map(plate => plate.id)

      // 2. Load plateResults
      const reqs = [];
      for (const plateId of plateIds) {
        let res = plateResults[plateId] = store.getters['resultdata/getLatestPlateResult'](plateId);
        if (res) {
          plateResults[plateId] = res;
        } else {
          reqs.push(store.dispatch('resultdata/loadLatestPlateResult', {plateId}).then(() => {
            plateResults[plateId] = store.getters['resultdata/getLatestPlateResult'](plateId);
          }));
        }
      }
      await Promise.all(reqs);

      // 3. Load protocols once all plateResults are in
      const protocolIds = [];
      for (const plateId of plateIds) {
        for (const i in plateResults[plateId]) {
          protocolIds.push(plateResults[plateId][i].protocolId)
        }
      }
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
      plateResults,
      gridColumnStyle: "repeat(3, 1fr)",
      selectedFeature,
      handleFeatureSelection
    }
  }
}
</script>
