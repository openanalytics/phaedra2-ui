<script setup>

const emits = defineEmits(['showDRCView'])

</script>

<template>
  <q-menu touch-position context-menu>
    <q-list dense>
      <q-item clickable v-close-popup>
        <q-item-section @click="emits('showDRCView')">Show dose-response view</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>
