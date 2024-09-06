<template>
  <q-item clickable v-close-popup @click="openPane">
    <q-item-section>{{ name }}</q-item-section>
  </q-item>
</template>

<style lang="scss">
.nav-link {
  text-decoration: none;
  color: black;
}
</style>

<script setup>
import { usePanesStore } from "@/stores/panes";

const props = defineProps(["id", "name"]);
const panesStore = usePanesStore();

function openPane() {
  panesStore.addMenuItem(props.id);
}
</script>
