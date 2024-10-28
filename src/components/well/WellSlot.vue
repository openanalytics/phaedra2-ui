<template>
  <div
    class="column well"
    :class="{ highlight: isSelected, skipped: well.skipped }"
    v-ripple
    :style="{
      color: well.skipped ? '#e52323' : fgColor,
      backgroundColor: bgColor,
    }"
  >
    <div v-if="well.status === 'REJECTED'" class="absolute-center">
      <img
        src="/rejected_cross.svg"
        class="vertical-middle"
        style="width: 100%; height: 100%"
      />
    </div>
    <div
      v-if="wellImageFunction"
      class="full-height row items-center justify-center"
    >
      <img :src="wellImageFunction(well)" />
    </div>
    <div v-if="wellLabelFunctions">
      <span
        v-for="wellLabelFunction in wellLabelFunctions"
        :key="wellLabelFunction"
        class="wellLabel"
        style="white-space: pre"
      >
        {{ wellLabelFunction(well) }}
      </span>
    </div>

    <q-tooltip :delay="3000" class="bg-secondary q-pa-xs">
      <div class="tooltipContainer">
        <WellInspector minimal :wells="[well]"></WellInspector>
      </div>
    </q-tooltip>

    <WellActionMenu
      :well="uiStore.selectedWells[0]"
      touch-position
      context-menu
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import ColorUtils from "@/lib/ColorUtils.js";
import WellInspector from "@/components/well/WellInspector.vue";
import WellActionMenu from "@/components/well/WellActionMenu.vue";

const props = defineProps({
  well: Object,
  selectedWells: Array,
  wellColorFunction: Function,
  wellImageFunction: Function,
  wellLabelFunctions: Array,
});

const bgColor = computed(() =>
  props.wellColorFunction ? props.wellColorFunction(props.well) : "#969696"
);
const fgColor = computed(() => ColorUtils.calculateTextColor(bgColor.value));
const isSelected = computed(() =>
  props.selectedWells.find(
    (w) => props.well.row === w.row && props.well.column === w.column
  )
);
</script>

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
    #e5e5e5,
    #e5e5e5 10px,
    #0f0f0f 11px,
    #0f0f0f 12px
  );
}
</style>
