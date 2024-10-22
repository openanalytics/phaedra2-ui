<template>
  <q-page class="oa-root-div">
    <PanesDashboard
      style="height: calc(100vh - 50px)"
      :dynamicPanes="panesMap.get('dashboard').value"
      class="dashboard"
      :splitKey="1"
    ></PanesDashboard>
  </q-page>
</template>

<script setup>
import PanesDashboard from "@/components/splitpanes/PanesDashboard.vue";
import { panesMap } from "@/maps/panes/panesMap";
</script>

<style>
.dashboard {
  width: 100%;
  height: 100%;
}
</style>
