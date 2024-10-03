<template>
  <component
    :is="component.component"
    v-bind="{ ...componentProps }"
    @selection="(e) => (component.selection ? component.selection(e) : null)"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["component"]);
const componentProps = computed(() => props.component.props);
</script>
