<template>
  <div class="column well" :class="{ blink: isSelected, skipped: tab==='overview'&&well.skipped}" v-ripple
       :style="{ color: (tab==='overview'&&well.skipped)?'#e52323':fgColor, backgroundColor: bgColor }"
       @click="$emit('wellSelection', well)"
  >
    <div v-if="well.status === 'REJECTED'" class="absolute-center">
      <img src="/rejected_cross.svg" class="vertical-middle" style="width: 100%; height: 100%;"/>
    </div>
    <span v-for="wellLabelFunction in wellLabelFunctions" :key="wellLabelFunction" class="wellLabel" style="white-space: pre;">
        {{ wellLabelFunction(well) }}
    </span>
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
  font-size: 85%;
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

.skipped {
  background: repeating-linear-gradient(
      -45deg,
      #E5E5E5,
      #E5E5E5 10px,
      #0F0F0F 10px,
      #0F0F0F 15px
  );
}
</style>

<script>
import {computed} from 'vue'
import ColorUtils from "@/lib/ColorUtils.js"

import WellInspector from "@/components/widgets/WellInspector.vue"

export default {
  props: {
    well: Object,
    selectedWells: Array,
    wellColorFunction: Function,
    wellLabelFunctions: Array,
    tab: String
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
      isSelected
    }
  }
}
</script>