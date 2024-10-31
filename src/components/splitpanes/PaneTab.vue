<template>
  <component
    :is="component.component"
    v-bind="{ ...componentProps }"
    @updated="() => (component.updated ? component.updated(e) : null)"
    @selection="(e) => (component.selection ? component.selection(e) : null)"
    @open="(e) => panesStore.openTab(e)"
  />
</template>

<script setup>
import { computed } from "vue";
import { usePanesStore } from "@/stores/panes";

const panesStore = usePanesStore();

const props = defineProps(["component"]);
const componentProps = computed(() => props.component.props);
</script>
