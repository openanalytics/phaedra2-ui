<template>
    <div class="row">
        <div class="col gridContainer">
            <WellSlot v-for="well in plate.wells" :key="well.nr"
                :well="well"
                :wellColorFunction="wellColorFunction"
                :wellLabelFunctions="wellLabelFunctions"
                @wellSelection="handleWellSelection"
                :selectedWells="selectedWells"
            ></WellSlot>
        </div>
        <div class="col-3 q-pl-md q-pt-sm" v-if="gridType == GRID_TYPE_LAYOUT">
            <WellTypeLegend :plate=plate></WellTypeLegend>
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
    .gridContainer {
        display: grid;
        grid-template-columns: v-bind(gridColumnStyle);
    }
</style>

<script>
    import { ref, computed } from 'vue'

    import WellUtils from "@/lib/WellUtils.js"
    import ColorUtils from "@/lib/ColorUtils.js"

    import WellSlot from "@/components/widgets/WellSlot.vue"
    import FeatureSelector from "@/components/widgets/FeatureSelector.vue"
    import WellTypeLegend from "@/components/widgets/WellTypeLegend.vue"

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
            FeatureSelector
        },
        setup(props) {
            const selectedFeature = ref(null)
            const selectedFeatureData = computed(() => {
                const wellCount = props.plate.wells.length;
                const values = [];
                for (var i=0; i<wellCount; i++) {
                    if (selectedFeature.value) values.push(Math.random())
                    // if (selectedFeature.value) values.push(i)
                    else values.push(NaN)
                }
                return values;
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
                let value = selectedFeatureData.value[well.nr - 1]
                let index = ColorUtils.findGradientIndex(value, selectedFeatureData.value, heatmapGradients)
                if (index == -1) return WellUtils.getWellTypeColor("EMPTY")
                return heatmapGradients[index]
            }
            const wellColorFunction = (props.gridType === GRID_TYPE_LAYOUT) ? wellTypeColorFunction : featureValueColorFunction
            const wellLabelFunctions = [
                function(well) { return WellUtils.getWellCoordinate(well.row, well.column) },
                (props.gridType === GRID_TYPE_LAYOUT) ?
                    function(well) { return well.wellType } :
                    function(well) { return well.nr }
            ]

            // Well selection handling
            const selectedWells = ref([])
            const handleWellSelection = function(well) {
                selectedWells.value.splice(0)
                selectedWells.value.push(well.nr)
            }

            // Feature selection handling
            const handleFeatureSelection = function(feature) {
                selectedFeature.value = feature
            }

            return {
                GRID_TYPE_LAYOUT,
                GRID_TYPE_HEATMAP,
                GRID_TYPE_IMAGES,
                wellColorFunction,
                wellLabelFunctions,
                selectedWells,
                handleWellSelection,
                handleFeatureSelection,
                gridColumnStyle: "repeat(" + props.plate.columns + ", 1fr)"
            }
        },
    }
</script>