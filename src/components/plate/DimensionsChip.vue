<template>
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
});
</script>
