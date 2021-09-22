<template>
    <div class="row">
        <div class="gridContainer">
            <WellSlot v-for="well in plate.wells" :key="well.nr"
                :well="well"
                :wellSize="wellSize"
                :wellColorFunction="wellColorFunction"
                :wellLabelFunctions="wellLabelFunctions"
                @wellSelection="handleWellSelection"
                :selectedWells="selectedWells"
            ></WellSlot>
        </div>
        <div class="q-pl-md q-pt-sm" v-if="gridType == GRID_TYPE_LAYOUT">
            <WellTypeLegend :plate=plate></WellTypeLegend>
        </div>
        <div class="q-pl-md q-pt-sm" v-if="gridType == GRID_TYPE_HEATMAP">
            <FeatureSelector></FeatureSelector>
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
    import { ref } from 'vue'

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
            const wellTypeColorFunction = function(well) {
                return WellUtils.getWellTypeColor(well.wellType)
            }
            const demoGradients = ColorUtils.createGradients([
                { red: 50, green: 50, blue: 150},
                { red: 255, green: 255, blue: 255},
                { red: 150, green: 50, blue: 50}
            ], 200)
            const featureValueColorFunction = function(well) {
                let index = Math.ceil((well.nr / props.plate.wells.length) * demoGradients.length) - 1
                return demoGradients[index]
            }
            
            const wellSize = 40
            const selectedWells = ref([])

            return {
                GRID_TYPE_LAYOUT,
                GRID_TYPE_HEATMAP,
                GRID_TYPE_IMAGES,

                wellSize,
                wellColorFunction: (props.gridType === GRID_TYPE_LAYOUT) ? wellTypeColorFunction : featureValueColorFunction,
                wellLabelFunctions: [
                    function(well) { return WellUtils.getWellCoordinate(well.row, well.column) },
                    (props.gridType === GRID_TYPE_LAYOUT) ?
                        function(well) { return well.wellType } :
                        function(well) { return well.nr }
                ],
                selectedWells,
                handleWellSelection: function(well) {
                    selectedWells.value.splice(0)
                    selectedWells.value.push(well.nr)
                },
                gridColumnStyle: "repeat(" + props.plate.columns + ", " + (wellSize + 2) + "px)"
            }
        },
    }
</script>