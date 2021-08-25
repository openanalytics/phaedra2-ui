<template>
  <div class="well">
        {{wellCoordinate}}
        <br/>
        {{well.wellType}}
  </div>
</template>

<style>
  .well {
    border: 1px solid black;
    margin: 1px;
    width: 50px;
    height: 50px;
    font-size: 75%;
    text-align: center;
    background-color: v-bind(wellTypeColor);
  }
</style>

<script>
import WellUtils from "@/lib/WellUtils.js"
export default {
    props: {
        well: Object
    },
    data() {
        return {
            wellTypeColor: WellUtils.getWellTypeColor(this.well.wellType),
            wellCoordinate: WellUtils.getWellCoordinate(this.well.row, this.well.column),
        }
    }
}
</script>