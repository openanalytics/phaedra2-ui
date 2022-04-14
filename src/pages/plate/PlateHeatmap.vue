<template>
  <div class="row">
    <div class="col-auto" style="min-width: 75%">
      <WellGrid :plate="plate"
                :loading="dataLoading"
                :wellColorFunction="wellColorFunction"
                :wellLabelFunctions="wellLabelFunctions"/>
    </div>
    <div class="col q-pa-sm">
      <FeatureSelector :protocols=protocols @featureSelection="handleFeatureSelection"/>
    </div>
  </div>
</template>

<script>
import {ref, computed, watchEffect} from 'vue'
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
    const activeMeasurement = store.getters['measurements/getActivePlateMeasurement'](props.plate.id);
    if (activeMeasurement) {
      exported.plateResults.value = store.getters['resultdata/getPlateResults'](props.plate.id, activeMeasurement.measurementId);
      let protocolIds = [...new Set(exported.plateResults.value.map(rs => rs.protocolId))];
      store.dispatch('protocols/loadByIds', protocolIds).then(() => {
        exported.protocols.value = store.getters['protocols/getByIds'](protocolIds);
        exported.dataLoading.value = false;
      })
    } else {
      exported.dataLoading.value = false;
    }

    const selectedFeatureData = computed(() => {
      if (!exported.selectedFeature.value) return undefined;
      let rsData = exported.plateResults.value.filter(rs => (rs.featureId == exported.selectedFeature.value.id));
      return rsData.sort((t1, t2) => t2.id - t1.id)[0];
    })

    const lut = ref(ColorUtils.createLUT([], ColorUtils.defaultHeatmapGradients));
    watchEffect(() => {
      if (selectedFeatureData.value) {
        lut.value = ColorUtils.createLUT(selectedFeatureData.value.values, ColorUtils.defaultHeatmapGradients);
      }
    });

    exported.wellColorFunction = function (well) {
      if (!selectedFeatureData.value) return WellUtils.getWellTypeColor("EMPTY");
      const wellNr = WellUtils.getWellNr(well.row, well.column, props.plate.columns);
      return lut.value.getColor(selectedFeatureData.value.values[wellNr - 1]);
    }

    exported.wellLabelFunctions = [
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
