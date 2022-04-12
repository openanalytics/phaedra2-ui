<template>
  <div>
    <div class="oa-section-title2">
      <div class="row items-center">
        <q-icon name="view_module" size="24px" class="q-mr-sm"/>
        <router-link :to="'/plate/' + plate.id" class="nav-link">{{ plate.barcode }}</router-link>
      </div>
    </div>
    <div class="q-pa-xs oa-section-body">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<style>

</style>

<script>
import {ref, computed, watchEffect} from 'vue'
import {useStore} from 'vuex'
import WellUtils from "@/lib/WellUtils.js"
import ColorUtils from "@/lib/ColorUtils.js"

export default {
  props: {
    plate: Object,
    plateResult: Object,
    feature: Object
  },
  setup(props) {
    const store = useStore();

    const canvas = ref(null);

    const wells = computed(() => store.getters['wells/getWells'](props.plate.id) || []);
    watchEffect(() => {
      if (props?.plate?.id && !store.getters['wells/areWellsLoaded'](props.plate.id)) {
        store.dispatch('wells/fetchByPlateId', props.plate.id);
      }
    })

    const lut = ref(ColorUtils.createLUT([], ColorUtils.defaultHeatmapGradients));
    watchEffect(() => {
      if (!props.plateResult || !props.feature) return;

      const rsDataValues = props.plateResult.find(rs => rs.featureId == props.feature.id)?.values || [];
      lut.value = ColorUtils.createLUT(rsDataValues, ColorUtils.defaultHeatmapGradients);
      
      setTimeout(draw());
    });

    const wellColorFunction = (well) => {
      if (!props.plateResult || !props.feature) return WellUtils.getWellTypeColor("EMPTY");

      const rsDataValues = props.plateResult.find(rs => rs.featureId == props.feature.id)?.values;
      if (!rsDataValues) return WellUtils.getWellTypeColor("EMPTY");

      const wellNr = WellUtils.getWellNr(well.row, well.column, props.plate.columns);
      return lut.value.getColor(rsDataValues[wellNr - 1]);
    }

    function draw() {
      console.log("MiniHeatmap Draw")

      if (canvas.value === null) {
        return;
      }

      let ctx = canvas.value.getContext('2d')

      let parent = canvas.value.parentElement
      let parentStyle = getComputedStyle(parent)
      let parentPaddingH = parseInt(parentStyle.paddingLeft) + parseInt(parentStyle.paddingRight)
      let availableWidth = parent.clientWidth - parentPaddingH

      let wellWidth = Math.floor(availableWidth / props.plate.columns) - 2
      let wellSize = [wellWidth, wellWidth]

      canvas.value.width = (wellWidth + 2) * props.plate.columns
      canvas.value.height = (wellWidth + 2) * props.plate.rows

      for (var r = 0; r < props.plate.rows; r++) {
        for (var c = 0; c < props.plate.columns; c++) {
          //Note: getWell takes ~1sec for 1536 wells
          // let well = WellUtils.getWell(wells.value, r + 1, c + 1)
          // This optimization assumes wells are always sorted by number:
          let wellNr = WellUtils.getWellNr(r + 1, c + 1, props.plate.columns);
          let well = wells.value[wellNr - 1];
          if (!well) continue;
          
          let x = c * (wellSize[0] + 2)
          let y = r * (wellSize[1] + 2)

          ctx.fillStyle = wellColorFunction(well)
          ctx.fillRect(x, y, wellSize[0], wellSize[1])

          if (well.status == "REJECTED") {
            ctx.strokeStyle = "yellow"
            ctx.moveTo(x, y);
            ctx.lineTo(x + wellWidth, y + wellWidth);
            ctx.stroke();
            ctx.moveTo(x + wellWidth, y);
            ctx.lineTo(x, y + wellWidth);
            ctx.stroke();
          }
        }
      }
    }

    return {
      canvas
    }
  }
}
</script>
