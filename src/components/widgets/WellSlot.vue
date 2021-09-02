<template>
    <div class="well">
        {{wellCoordinate}}
        <br/>
        {{well.wellType}}
    </div>
</template>

<style scoped>
    .well {
        border: 1px solid black;
        margin: 1px;
        width: v-bind(wellSizePx);
        height: v-bind(wellSizePx);
        font-size: 65%;
        text-align: center;
        background-color: v-bind(wellTypeColor);
    }
</style>

<script>
  import WellUtils from "@/lib/WellUtils.js"

  export default {
      props: {
          well: Object,
          wellSize: Number
      },
      setup(props) {
          return {
              wellSizePx: props.wellSize + "px",
              wellTypeColor: WellUtils.getWellTypeColor(props.well.wellType),
              wellCoordinate: WellUtils.getWellCoordinate(props.well.row, props.well.column),
          }
      }
  }
</script>