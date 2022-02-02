<template>
  <div class="row">
    <div class="col-9">
      <WellGrid :plate="plate"
                :loading="dataLoading"
                :wellColorFunction="wellColorFunction"
                :wellLabelFunctions="wellLabelFunctions"/>
    </div>
    <div class="col-3 q-pa-sm">
      <FeatureSelector :protocols=protocols @featureSelection="handleFeatureSelection"/>
    </div>
  </div>
</template>

<script>
import {ref, computed} from 'vue'
import {useStore} from 'vuex'
import WellGrid from "@/components/widgets/WellGrid.vue"
import FeatureSelector from "@/components/widgets/FeatureSelector.vue"
import ColorUtils from "@/lib/ColorUtils.js"
import WellUtils from "@/lib/WellUtils.js"

export default {
  components: {
    WellGrid,
    FeatureSelector
  },
  props: {
    plate: Object
  },
  setup(props) {
    const exported = {};
    const store = useStore()

    exported.plateResults = ref([]);
    exported.protocols = ref([]);
    exported.selectedFeature = ref(null);
    exported.dataLoading = ref(true);

    // Load resultdata to display
    exported.plateResults.value = store.getters['resultdata/getPlateResults'](props.plate.id);
    let protocolIds = [...new Set(exported.plateResults.value.map(rs => rs.protocolId))];
    store.dispatch('protocols/loadByIds', protocolIds).then(() => {
      exported.protocols.value = store.getters['protocols/getByIds'](protocolIds);
      exported.dataLoading.value = false;
    })

    const selectedFeatureData = computed(() => {
      if (!exported.selectedFeature.value) return undefined
      return exported.plateResults.value.find(rs => (rs.featureId == exported.selectedFeature.value.id));
    })

    exported.wellColorFunction = function (well) {
      if (!selectedFeatureData.value) return WellUtils.getWellTypeColor("EMPTY");
      let value = selectedFeatureData.value.values[WellUtils.getWellNr(well.row, well.column, props.plate.columns) - 1];
      let index = ColorUtils.findGradientIndex(value, selectedFeatureData.value.values, ColorUtils.defaultHeatmapGradients);
      if (index == -1) return WellUtils.getWellTypeColor("EMPTY");
      return ColorUtils.defaultHeatmapGradients[index];
    }

    exported.wellLabelFunctions = [
      function (well) {
        return WellUtils.getWellCoordinate(well.row, well.column);
      },
      function (well) {
        let wellNr = WellUtils.getWellNr(well.row, well.column, props.plate.columns);
        return (selectedFeatureData.value) ? (Math.round(selectedFeatureData.value.values[wellNr - 1] * 100) / 100) : "";
      }
    ]

    exported.handleFeatureSelection = function (feature) {
      exported.selectedFeature.value = feature
    }

    return exported;
  }
}
</script>
