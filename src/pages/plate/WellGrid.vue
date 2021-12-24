<template>
  <div v-if="plate" class="row" ref="rootElement" style="width: 100%;" @mouseup="selectionBoxSupport.dragEnd">
    <div class="col-9 gridContainer oa-section" @mousedown="selectionBoxSupport.dragStart"
          @mousemove="selectionBoxSupport.dragMove">
      <div class="loadingAnimation" v-if="loading">
        <q-spinner-pie color="info" size="10em"/>
      </div>
      <WellSlot :ref="refWellSlot" v-for="well in plate.wells" :key="well.nr"
                :well="well"
                :wellColorFunction="wellColorFunction"
                :wellLabelFunctions="wellLabelFunctions"
                @wellSelection="handleWellSelection"
                :selectedWells="selectedWells"
                :gridType="gridType"
                :tab="tab"
      ></WellSlot>
    </div>
    <div class="col-3 q-pa-sm" v-if="gridType == GRID_TYPE_LAYOUT">
      <WellTypeLegend :plate=plate :gridType="gridType"></WellTypeLegend>
      <WellInspector :wells=selectedWells :gridType="gridType"></WellInspector>
    </div>
    <div class="col-3 q-pa-sm" v-if="gridType == GRID_TYPE_TEMPLATE">
      <WellEditor :wells="selectedWells" :plateId="plate.id" :tab="tab"></WellEditor>
    </div>
    <div class="col-3 q-pl-md q-pt-sm" v-if="gridType == GRID_TYPE_HEATMAP">
      <FeatureSelector
          :protocols=protocols
          @featureSelection="handleFeatureSelection"
      ></FeatureSelector>
    </div>
  </div>
</template>

<style scoped>
.loadingAnimation {
  position: absolute;
  z-index: 10;
  justify-self: center;
  align-self: center;
}

.gridContainer {
  display: grid;
  grid-template-columns: v-bind(gridColumnStyle);
  min-height: 400px;
  overflow: scroll;
}
</style>

<script>
import {ref, computed} from 'vue'
import {useStore} from 'vuex'

import WellUtils from "@/lib/WellUtils.js"
import ColorUtils from "@/lib/ColorUtils.js"
import SelectionBoxHelper from "@/lib/SelectionBoxHelper.js"

import WellSlot from "@/components/widgets/WellSlot.vue"
import FeatureSelector from "@/components/widgets/FeatureSelector.vue"
import WellTypeLegend from "@/components/widgets/WellTypeLegend.vue"
import WellInspector from "@/components/widgets/WellInspector.vue"
import WellEditor from "../../components/widgets/WellEditor";

const GRID_TYPE_HEATMAP = "heatmap"
const GRID_TYPE_LAYOUT = "layout"
const GRID_TYPE_IMAGES = "images"
const GRID_TYPE_TEMPLATE = "well-templates"

export default {
  GRID_TYPE_LAYOUT,
  GRID_TYPE_HEATMAP,
  GRID_TYPE_IMAGES,
  GRID_TYPE_TEMPLATE,

  props: {
    plate: Object,
    gridType: String,
    tab: String
  },
  components: {
    WellEditor,
    WellSlot,
    WellTypeLegend,
    FeatureSelector,
    WellInspector
  },
  setup(props) {
    const store = useStore()
    const loading = ref(props.gridType === GRID_TYPE_HEATMAP)

    const plateResults = ref([])
    const protocols = ref([])
    const selectedFeature = ref(null)

    // Initiate loading of resultdata
    if (props.gridType === GRID_TYPE_HEATMAP) {
      store.dispatch('resultdata/loadPlateResults', {plateId: props.plate.id}).then(() => {
        plateResults.value = store.getters['resultdata/getPlateResults'](props.plate.id)
        let protocolIds = [...new Set(plateResults.value.map(rs => rs.protocolId))]
        store.dispatch('protocols/loadByIds', protocolIds).then(() => {
          protocols.value = store.getters['protocols/getByIds'](protocolIds)
          loading.value = false
        })
      })
    }

    const selectedFeatureData = computed(() => {
      if (!selectedFeature.value) return undefined
      return plateResults.value.find(rs => (rs.featureId == selectedFeature.value.id));
    })

    // WellSlot colors and labels
    const wellTypeColorFunction = function (well) {
      return WellUtils.getWellTypeColor(well.wellType)
    }
    const featureValueColorFunction = function (well) {
      if (!selectedFeatureData.value) return WellUtils.getWellTypeColor("EMPTY")
      let value = selectedFeatureData.value.values[WellUtils.getWellNr(well.row, well.column, props.plate.columns) - 1]
      let index = ColorUtils.findGradientIndex(value, selectedFeatureData.value.values, ColorUtils.defaultHeatmapGradients)
      if (index == -1) return WellUtils.getWellTypeColor("EMPTY")
      return ColorUtils.defaultHeatmapGradients[index]
    }
    const wellColorFunction = (props.gridType === GRID_TYPE_LAYOUT || props.gridType === GRID_TYPE_TEMPLATE) ? wellTypeColorFunction : featureValueColorFunction

    const wellLabelFunctions = [
      function (well) {
        return WellUtils.getWellCoordinate(well.row, well.column)
      },
      (props.gridType === GRID_TYPE_LAYOUT || props.gridType === GRID_TYPE_TEMPLATE) ?
          function (well) {
            //Label based on templateTab
            switch (props.tab) {
              case 'overview': return;
              case 'substance': return (well.substanceName&&well.substanceType)?well.substanceName + "\n" + well.substanceType: (well.substanceName)? well.substanceName:well.substanceType;
              case 'concentration': return well.concentration
              default: return well.wellType;
            }
          } : function (well) {
                let wellNr = WellUtils.getWellNr(well.row, well.column, props.plate.columns);
                return (selectedFeatureData.value) ? (Math.round(selectedFeatureData.value.values[wellNr - 1] * 100) / 100) : ""
              }
    ]

    const onKeyNav = function (event) {
      if (selectedWells.value.length == 0) return
      let currentWell = selectedWells.value[0]
      switch (event.key) {
        case "ArrowUp":
          handleWellSelection(WellUtils.getWell(props.plate, currentWell.row - 1, currentWell.column))
          break
        case "ArrowDown":
          handleWellSelection(WellUtils.getWell(props.plate, currentWell.row + 1, currentWell.column))
          break
        case "ArrowLeft":
          handleWellSelection(WellUtils.getWell(props.plate, currentWell.row, currentWell.column - 1))
          break
        case "ArrowRight":
          handleWellSelection(WellUtils.getWell(props.plate, currentWell.row, currentWell.column + 1))
          break
      }
    }
    window.addEventListener('keyup', onKeyNav)

    // Well selection handling
    const selectedWells = ref([])
    const handleWellSelection = function (well) {
      if (!well) return
      selectedWells.value.splice(0)
      selectedWells.value.push(well)
    }

    // Feature selection handling
    const handleFeatureSelection = function (feature) {
      selectedFeature.value = feature
      // loading.value = true
    }

    // Well multi-selection
    const rootElement = ref(null)
    const wellSlots = ref([])
    const refWellSlot = function (slot) {
      wellSlots.value.push(slot)
    }
    const selectionBoxSupport = SelectionBoxHelper.addSelectionBoxSupport(rootElement, wellSlots, wells => {
      selectedWells.value.splice(0)
      wells.forEach(well => {
        selectedWells.value.push(well)
      })
    });

    return {
      GRID_TYPE_LAYOUT,
      GRID_TYPE_HEATMAP,
      GRID_TYPE_IMAGES,
      GRID_TYPE_TEMPLATE,
      loading,
      wellColorFunction,
      wellLabelFunctions,
      selectedWells,
      protocols,
      handleWellSelection,
      handleFeatureSelection,
      onKeyNav,
      gridColumnStyle: "repeat(" + props.plate.columns + ", 1fr)",
      rootElement,
      refWellSlot,
      selectionBoxSupport
    }
  },
}
</script>
