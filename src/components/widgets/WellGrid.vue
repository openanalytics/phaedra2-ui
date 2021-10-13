<template>
    <div class="row" ref="rootElement">
        <div class="col gridContainer" @mousedown="selectionBoxSupport.dragStart" @mouseup="selectionBoxSupport.dragEnd" @mousemove="selectionBoxSupport.dragMove">
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
        <div class="col-3 q-pl-md q-pt-sm" v-if="gridType == GRID_TYPE_LAYOUT">
            <div class="q-pb-sm">
                <WellTypeLegend :plate=plate></WellTypeLegend>
            </div>
            <div>
                <WellInspector :wells=selectedWells></WellInspector>
            </div>
        </div>
        <div class="col-3 q-pl-md q-pt-sm" v-if="gridType == GRID_TYPE_HEATMAP">
            <FeatureSelector
                :plate=plate
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
    }
</style>

<script>
    import { ref, computed, watch } from 'vue'
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
            
            const selectedFeature = ref(null)
            watch(selectedFeature, () => {
                if (selectedFeature.value) store.dispatch('resultdata/loadResultDataById', { resultSetId: 1, featureId: selectedFeature.value.id })
            })
            
            const selectedFeatureData = computed(() => {
                if (!selectedFeature.value) return undefined
                return store.getters['resultdata/getResultDataById'](1, selectedFeature.value.id)
            })
            watch(selectedFeatureData, () => {
                if (selectedFeatureData.value) loading.value = false
            })

            // WellSlot colors and labels
            const wellTypeColorFunction = function(well) {
                return WellUtils.getWellTypeColor(well.wellType)
            }
            const heatmapGradients = ColorUtils.createMultiGradients([
                { red: 50, green: 50, blue: 150},
                { red: 255, green: 255, blue: 255},
                { red: 150, green: 50, blue: 50}
            ], 200)
            const featureValueColorFunction = function(well) {
                if (!selectedFeatureData.value) return WellUtils.getWellTypeColor("EMPTY")
                let value = selectedFeatureData.value.values[well.nr - 1]
                let index = ColorUtils.findGradientIndex(value, selectedFeatureData.value.values, heatmapGradients)
                if (index == -1) return WellUtils.getWellTypeColor("EMPTY")
                return heatmapGradients[index]
            }
            const wellColorFunction = (props.gridType === GRID_TYPE_LAYOUT) ? wellTypeColorFunction : featureValueColorFunction

            const wellLabelFunctions = [
                function(well) { return WellUtils.getWellCoordinate(well.row, well.column) },
                (props.gridType === GRID_TYPE_LAYOUT) ?
                    function(well) { return well.wellType } :
                    function(well) { return (selectedFeatureData.value) ? (Math.round(selectedFeatureData.value.values[well.nr - 1] * 100) / 100) : "" }
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
                loading.value = true
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