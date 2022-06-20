<template>
  <div class="column well" :class="{ highlight: isSelected, skipped: well.skipped }" v-ripple
       :style="{ color: well.skipped ? '#e52323':fgColor, backgroundColor: bgColor }"
  >
    <div v-if="well.status === 'REJECTED'" class="absolute-center">
      <img src="/rejected_cross.svg" class="vertical-middle" style="width: 100%; height: 100%;"/>
    </div>
    <span v-for="wellLabelFunction in wellLabelFunctions" :key="wellLabelFunction" class="wellLabel" style="white-space: pre;">
        {{ wellLabelFunction(well) }}
    </span>

    <q-popup-proxy>
      <WellInspector minimal :wells="[well]"></WellInspector>
    </q-popup-proxy>

<!--      <WellActions :wells="[well]"></WellActions>-->
    <q-menu touch-position context-menu>
      <q-list style="min-width: 100px">
        <q-item clickable v-close-popup>
          <q-item-section>Approve</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>Reject</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>Show info</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
<!--    <q-tooltip :delay="3000" class="bg-secondary q-pa-xs">-->
<!--      <div class="tooltipContainer">-->
<!--        <WellInspector minimal :wells="[well]"></WellInspector>-->
<!--      </div>-->
<!--    </q-tooltip>-->
  </div>
</template>

<style scoped>
.well {
  border: 1px solid black;
  margin: 1px;
  text-align: center;
  position: relative;
  cursor: pointer;
}

.highlight {
  border-color: #9ecaed;
  box-shadow: 0 0 5px #9ecaed;
  /* animation: blink-animation 1s linear infinite; */
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
      #0F0F0F 11px,
      #0F0F0F 12px
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
  },
  components: {
    WellInspector
  },
  setup(props) {
    const bgColor = computed(() => props.wellColorFunction(props.well))
    const fgColor = computed(() => ColorUtils.calculateTextColor(bgColor.value))
    const isSelected = computed(() => props.selectedWells.find(w => props.well.row == w.row && props.well.column == w.column))
    return {
      bgColor,
      fgColor,
      isSelected
    }
  }
}
</script>
