<template>
    <div class="row relative-position" ref="rootElement" style="width: 100%;">
        <div class="col gridContainer oa-section" @mousedown="selectionBoxSupport.dragStart" @mouseup="selectionBoxSupport.dragEnd" @mousemove="selectionBoxSupport.dragMove">
            <div class="loadingAnimation" v-if="loading">
                <q-spinner-pie color="info" size="10em" />
            </div>
            <WellSlot :ref="refWellSlot" v-for="well in plate.wells" :key="well.nr"
                :well="well"
                :wellColorFunction="wellColorFunction"
                :wellLabelFunctions="wellLabelFunctions"
                @wellSelection="handleWellSelection"
                :selectedWells="selectedWells"
            ></WellSlot>
        </div>
        <div class="col-3 q-pa-sm" v-if="gridType == GRID_TYPE_LAYOUT">
            <WellTypeLegend :plate=plate></WellTypeLegend>
            <WellInspector :wells=selectedWells></WellInspector>
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
    }
</style>

<script>
    import { ref, computed } from 'vue'
    import { useStore } from 'vuex'

    import WellUtils from "@/lib/WellUtils.js"
    import ColorUtils from "@/lib/ColorUtils.js"
    import SelectionBoxHelper from "@/lib/SelectionBoxHelper.js"

    import WellSlot from "@/components/widgets/WellSlot.vue"
    import FeatureSelector from "@/components/widgets/FeatureSelector.vue"
    import WellTypeLegend from "@/components/widgets/WellTypeLegend.vue"
    import WellInspector from "@/components/widgets/WellInspector.vue"

    const GRID_TYPE_HEATMAP = "heatmap"
    const GRID_TYPE_LAYOUT = "layout"
    const GRID_TYPE_IMAGES = "images"

    export default {
        GRID_TYPE_LAYOUT,
        GRID_TYPE_HEATMAP,
        GRID_TYPE_IMAGES,

        props: {
            plate: Object,
            gridType: String
        },
        components: {
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
                    let protocolIds = [... new Set(plateResults.value.map(rs => rs.protocolId))]
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
            const wellTypeColorFunction = function(well) {
                return WellUtils.getWellTypeColor(well.wellType)
            }
            const featureValueColorFunction = function(well) {
                if (!selectedFeatureData.value) return WellUtils.getWellTypeColor("EMPTY")
                let value = selectedFeatureData.value.values[WellUtils.getWellNr(well.row, well.column, props.plate.columns) - 1]
                let index = ColorUtils.findGradientIndex(value, selectedFeatureData.value.values, ColorUtils.defaultHeatmapGradients)
                if (index == -1) return WellUtils.getWellTypeColor("EMPTY")
                return ColorUtils.defaultHeatmapGradients[index]
            }
            const wellColorFunction = (props.gridType === GRID_TYPE_LAYOUT) ? wellTypeColorFunction : featureValueColorFunction

            const wellLabelFunctions = [
                function(well) { return WellUtils.getWellCoordinate(well.row, well.column) },
                (props.gridType === GRID_TYPE_LAYOUT) ?
                    function(well) { return well.wellType } :
                    function(well) {
                        let wellNr = WellUtils.getWellNr(well.row, well.column, props.plate.columns);
                        return (selectedFeatureData.value) ? (Math.round(selectedFeatureData.value.values[wellNr - 1] * 100) / 100) : ""
                    }
            ]

            const onKeyNav = function(event) {
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
            const handleWellSelection = function(well) {
                if (!well) return
                selectedWells.value.splice(0)
                selectedWells.value.push(well)
            }

            // Feature selection handling
            const handleFeatureSelection = function(feature) {
                selectedFeature.value = feature
                // loading.value = true
            }

            // Well multi-selection
            const rootElement = ref(null)
            const wellSlots = ref([])
            const refWellSlot = function(slot) {
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
