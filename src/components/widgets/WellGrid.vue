<template>
  <div class="gridContainer">
      <WellSlot :well="well" :wellSize="wellSize" v-for="well in plate.wells" :key="well.nr"></WellSlot>
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

    export default {
        props: {
            plate: Object
        },
        components: {
            WellSlot
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