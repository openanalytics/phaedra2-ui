<template>
  <component
    :is="component.component"
    v-bind="{ ...componentProps }"
    @updated="() => (component.updated ? component.updated(e) : null)"
    @selection="(e) => (component.selection ? component.selection(e) : null)"
    @open="(e) => (component.open ? component.open(e) : null)"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["component"]);
const componentProps = computed(() => props.component.props);
</script>
