<template>
  <div
    :class="{ 'cursor-pointer': props.editable }"
    :style="{ width: '25px', border: '1px solid grey', backgroundColor: color }"
  >
    &nbsp;
    <q-popup-proxy
      v-if="props.editable"
      cover
      transition-show="scale"
      transition-hide="scale"
    >
      <q-color v-model="color" @change="doEmitValue" />
    </q-popup-proxy>
    <q-tooltip v-if="props.tooltip">
      {{ props.tooltip }}
    </q-tooltip>
  </div>
</template>

<script setup>
import { computed } from "vue";
import ColorUtils from "@/lib/ColorUtils";

const props = defineProps({
  rgb: Number,
  tooltip: String,
  editable: { type: Boolean, default: true },
});
const emit = defineEmits(["update:rgb"]);

const color = computed({
  get: () => ColorUtils.asCSSColor(props.rgb),
  set: (val) => {}, // Do nothing here, as this setter appears to get called twice (mouseDown, mouseUp)
});

const doEmitValue = (val) => emit("update:rgb", ColorUtils.asColorInteger(val));
</script>
