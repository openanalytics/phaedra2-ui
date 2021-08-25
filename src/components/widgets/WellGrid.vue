<template>
  <div class="gridContainer">
      <WellSlot :well="well" v-for="well in plate.wells" :key="well.nr"></WellSlot>
  </div>
</template>

<style>
    .gridContainer {
        display: grid;
        grid-template-columns: v-bind(gridColumnStyle);
    }
</style>

<script>
import WellSlot from "@/components/widgets/WellSlot.vue"
import WellUtils from "@/lib/WellUtils.js"

export default {
    props: {
        plate: Object
    },
    data() {
        return {
            gridColumnStyle: "repeat(" + this.plate.columns + ", 52px)"
        }
    },
    components: {
        WellSlot
    },
    methods: {
        getWell(row, column) {
            let wellNr = WellUtils.getWellNr(row, column, this.plate.columns);
            return this.plate.wells[wellNr - 1];
        }
    },
}
</script>