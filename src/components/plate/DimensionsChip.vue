<template>
  <span v-if="label" style="font-size: 10px; color: rgba(0, 0, 0, 0.6)">
    {{ label }}:
  </span>
  <span v-else style="font-size: 10px; color: rgba(0, 0, 0, 0.6)">
    Dimensions:
  </span>
  <q-chip dense size="12px">
    <q-avatar font-size="1em" icon="calculate" />
    {{ rows }} x {{ columns }}
    <span v-if="calculate"> ({{ rows * columns }} wells) </span>
    <q-tooltip v-if="onHoverMessage" :offset="[10, 10]">
      {{ onHoverMessage }}
    </q-tooltip>
  </q-chip>
</template>

<script setup>
const props = defineProps({
  rows: String,
  columns: String,
  onHoverMessage: String,
  calculate: Boolean,
  label: String,
});
</script>
