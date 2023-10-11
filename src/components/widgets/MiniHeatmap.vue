<template>
    <div>
        <div class="oa-section-title2">
            <div class="row items-center">
                <q-icon name="view_module" size="24px" class="q-mr-sm"/>
                <router-link :to="'/project/' + projectId + '/experiment/' + experimentId + '/plate/' + plate?.id" class="nav-link">
                  {{ plate?.barcode }}
                </router-link>
            </div>
        </div>
        <div class="q-pa-xs oa-section-body">
            <canvas ref="canvas"/>
        </div>
    </div>
</template>

<script setup>
import {ref, computed, watch, onMounted} from 'vue'
import WellUtils from "@/lib/WellUtils.js"
import ColorUtils from "@/lib/ColorUtils.js"
import {useRoute} from "vue-router";

const route = useRoute();
const props = defineProps(['plate', 'plateData']);

const plate = computed(() => props.plate)
const plateData = computed(() => props.plateData)

const projectId = parseInt(route.params.projectId)
const experimentId = parseInt(route.params.experimentId);

const canvas = ref(null);
const lut = ref(ColorUtils.createLUT([], ColorUtils.defaultHeatmapGradients));

onMounted(() => {
  draw()
})

watch([plateData], () => {
  if (plateData.value && plateData.value.length > 0) {
    lut.value = ColorUtils.createLUT(plateData.value[0].values, ColorUtils.defaultHeatmapGradients);
  }
  setTimeout(draw());
});

const wellColorFunction = (index) => {
  if (plateData.value && plateData.value.length > 0 && plateData.value[0].values)
    return lut.value.getColor(plateData.value[0].values[index]);
  return WellUtils.getWellTypeColor("EMPTY");
}

function draw() {
  if (canvas.value === null) return

  let ctx = canvas.value.getContext('2d')

  let parent = canvas.value.parentElement
  let parentStyle = getComputedStyle(parent)
  let parentPaddingH = parseInt(parentStyle.paddingLeft) + parseInt(parentStyle.paddingRight)
  let availableWidth = parent.clientWidth - parentPaddingH

  let wellWidth = Math.floor(availableWidth / plate.value.columns) - 2
  let wellSize = [wellWidth, wellWidth]

  canvas.value.width = (wellWidth + 2) * plate.value.columns
  canvas.value.height = (wellWidth + 2) * plate.value.rows

  for (let r = 0; r < plate.value.rows; r++) {
    for (let c = 0; c < plate.value.columns; c++) {
      //Note: getWell takes ~1sec for 1536 wells
      // let well = WellUtils.getWell(wells.value, r + 1, c + 1)
      // This optimization assumes wells are always sorted by number:
      let wellNr = WellUtils.getWellNr(r + 1, c + 1, props.plate.columns);
      // let well = wells.value[wellNr - 1];
      // if (!well) continue;

      let x = c * (wellSize[0] + 2)
      let y = r * (wellSize[1] + 2)

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
