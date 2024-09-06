<template>
  <q-page class="oa-root-div">
    <WorkbenchMenu />
    <PanesDashboard
      style="height: calc(100vh - 50px)"
      :dynamicPanes="panesStore.dynamicPanes"
      class="dashboard"
      :splitKey="1"
    ></PanesDashboard>
  </q-page>
</template>

<script setup>
import { usePanesStore } from "@/stores/panes";
import PanesDashboard from "@/components/splitpanes/PanesDashboard.vue";
import WorkbenchMenu from "@/components/workbench/WorkbenchMenu.vue";

const panesStore = usePanesStore();
</script>

<style>
.dashboard {
  width: 100%;
  height: 100%;
}
</style>
