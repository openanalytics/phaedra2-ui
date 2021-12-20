<template>
  <div class="column well" :class="{ blink: isSelected }" v-ripple
       :style="{ color: fgColor, backgroundColor: bgColor }"
       @click="$emit('wellSelection', well)"
  >
    <div v-if="well.status === 'REJECTED' || well.skipped === true" class="absolute-center">
      <img src="/rejected_cross.svg" class="vertical-middle" style="width: 100%; height: 100%;"/>
    </div>
    <div v-for="wellLabelFunction in wellLabelFunctions" :key="wellLabelFunction" class="wellLabel">
      {{ wellLabelFunction(well) }}
    </div>
    <q-tooltip :delay="1000" class="bg-secondary q-pa-xs">
      <div class="tooltipContainer">
        <WellInspector minimal :wells="[well]"></WellInspector>
      </div>
    </q-tooltip>
  </div>
</template>

<style scoped>
.well {
  border: 1px solid black;
  margin: 1px;
  font-size: 65%;
  text-align: center;
  position: relative;
  cursor: pointer;
}

.blink {
  animation: blink-animation 1s linear infinite;
}

@keyframes blink-animation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.wellLabel {
  z-index: 1;
}

.tooltipContainer {
  width: 200px;
}
</style>

<script>
import {computed} from 'vue'
import ColorUtils from "@/lib/ColorUtils.js"

import WellInspector from "@/components/widgets/WellInspector.vue"

const GRID_TYPE_TEMPLATE = "well-templates"

export default {
  props: {
    well: Object,
    selectedWells: Array,
    wellColorFunction: Function,
    wellLabelFunctions: Array,
    gridType: String
  },
  components: {
    WellInspector
  },
  emits: ['wellSelection'],
  setup(props) {
    const bgColor = computed(() => props.wellColorFunction(props.well))
    const fgColor = computed(() => ColorUtils.calculateTextColor(bgColor.value))
    const isSelected = computed(() => props.selectedWells.indexOf(props.well) >= 0)

    return {
      bgColor,
      fgColor,
      isSelected,
      GRID_TYPE_TEMPLATE
    }
  }
}
</script>