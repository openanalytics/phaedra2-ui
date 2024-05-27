<template>
  <div class="oa-section-title2">
    <div class="row items-center">
      <q-icon name="view_module" size="24px" class="q-mr-sm"/>
      <router-link :to="'/plate/' + plate?.id" class="nav-link">
        {{ plate?.barcode }}
      </router-link>
    </div>
    <canvas ref="canvas" class="q-pa-xs oa-section-body"/>
  </div>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import WellUtils from "@/lib/WellUtils.js"
import ColorUtils from "@/lib/ColorUtils.js"

const props = defineProps(['plate', 'plateData']);

const plate = computed(() => props.plate)
const plateData = computed(() => props.plateData)

const canvas = ref(null);
const lut = ref(ColorUtils.createLUT([], ColorUtils.defaultHeatmapGradients));

watch([plateData], () => {
  if (plateData.value.values) {
    lut.value = ColorUtils.createLUT(plateData.value.values, ColorUtils.defaultHeatmapGradients);
  }
  setTimeout(draw());
});

const wellColorFunction = (index) => {
  if (plateData.value.values)
    return lut.value.getColor(plateData.value.values[index]);
  return WellUtils.getWellTypeColor("EMPTY");
}

function draw() {
  if (canvas.value === null) return

  const ctx = canvas.value.getContext('2d')

  const parent = canvas.value.parentElement
  const parentStyle = getComputedStyle(parent)
  const parentPaddingH = parseInt(parentStyle.paddingLeft) + parseInt(parentStyle.paddingRight)
  const availableWidth = parent.clientWidth - parentPaddingH

  const wellWidth = Math.floor(availableWidth / plate.value.columns) - 2
  const wellSize = [wellWidth, wellWidth]

  canvas.value.width = (wellWidth + 2) * plate.value.columns
  canvas.value.height = (wellWidth + 2) * plate.value.rows

  for (let r = 0; r < plate.value.rows; r++) {
    for (let c = 0; c < plate.value.columns; c++) {
      //Note: getWell takes ~1sec for 1536 wells
      // let well = WellUtils.getWell(wells.value, r + 1, c + 1)
      // This optimization assumes wells are always sorted by number:
      const wellNr = WellUtils.getWellNr(r + 1, c + 1, props.plate.columns);
      // let well = wells.value[wellNr - 1];
      // if (!well) continue;

      const x = c * (wellSize[0] + 2)
      const y = r * (wellSize[1] + 2)

      ctx.fillStyle = wellColorFunction(wellNr - 1)
      ctx.fillRect(x, y, wellSize[0], wellSize[1])

      // TODO: enable the rejected status again
      // if (well.status === "REJECTED") {
      //     ctx.strokeStyle = "yellow"
      //     ctx.moveTo(x, y);
      //     ctx.lineTo(x + wellWidth, y + wellWidth);
      //     ctx.stroke();
      //     ctx.moveTo(x + wellWidth, y);
      //     ctx.lineTo(x, y + wellWidth);
      //     ctx.stroke();
      // }
    }
  }
}
</script>
