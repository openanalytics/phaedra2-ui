<template>
    <div class="row">
        <div class="gridContainer">
            <WellSlot :well="well" :wellSize="wellSize" v-for="well in plate.wells" :key="well.nr"></WellSlot>
        </div>
        <div class="q-pl-md q-pt-sm" v-show="showSettings">
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
    import WellSlot from "@/components/widgets/WellSlot.vue"
    import FeatureSelector from "@/components/widgets/FeatureSelector.vue"

    export default {
        props: {
            plate: Object,
            showSettings: Boolean
        },
        components: {
            WellSlot,
            FeatureSelector
        },
        setup(props) {
            const wellSize = 40

            return {
                wellSize,
                gridColumnStyle: "repeat(" + props.plate.columns + ", " + (wellSize + 2) + "px)"
            }
        },
    }
</script>