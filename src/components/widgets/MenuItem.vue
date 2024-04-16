<script setup>
import {computed, ref} from "vue";

  const props = defineProps(['icon', 'color', 'label'])
  const emits = defineEmits(['click'])
</script>

<template>
  <q-item dense clickable @click="emits('click')">
    <q-item-section avatar>
      <q-icon :color="props.color" :name="props.icon"/>
    </q-item-section>
    <q-item-section>{{ props.label }}</q-item-section>
  </q-item>
</template>

<style scoped>

</style>
