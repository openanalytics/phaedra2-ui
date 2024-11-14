<template>
  <component
    :is="component.component"
    v-bind="{ ...componentProps }"
    v-on="componentEvents"
    @open="(e) => panesStore.openTab(e)"
  />
</template>

<script setup>
import { computed } from "vue";
import { usePanesStore } from "@/stores/panes";

const panesStore = usePanesStore();

const props = defineProps(["component"]);
const componentProps = computed(() => props.component.props);
const componentEvents = computed(() => props.component.events);
</script>
