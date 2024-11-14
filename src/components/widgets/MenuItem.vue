<script setup>
const props = defineProps(["icon", "color", "label"]);
const emits = defineEmits(["click"]);
</script>

<template>
  <q-item dense clickable @click="emits('click')">
    <q-item-section avatar v-if="icon">
      <q-icon :color="color" :name="icon" />
    </q-item-section>
    <q-item-section>{{ label }}</q-item-section>
  </q-item>
</template>

<style scoped></style>
