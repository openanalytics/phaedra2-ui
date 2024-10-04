<template>
  <Splitpanes
    :horizontal="dynamicPanes[0] === 'H'"
    :push-other-panes="false"
    class="default-theme"
  >
    <template v-for="(pane, k) in dynamicPanes.slice(1)" :key="k">
      <Pane v-if="pane[0] === 'V' || pane[0] === 'H'">
        <PanesDashboard :dynamicPanes="pane" />
      </Pane>
      <SplitPane v-else :panes="panesStore.mapComponents(pane)" />
    </template>
  </Splitpanes>
</template>

<script setup>
import SplitPane from "@/components/splitpanes/SplitPane.vue";
import PanesDashboard from "@/components/splitpanes/PanesDashboard.vue";
import { usePanesStore } from "@/stores/panes";

defineProps(["dynamicPanes"]);

const panesStore = usePanesStore();
</script>

<style>
.splitpanes--vertical > .splitpanes__splitter {
  min-width: 6px;
  background: linear-gradient(90deg, #ccc, #32a6d3);
}

.splitpanes--horizontal > .splitpanes__splitter {
  min-height: 6px;
  background: linear-gradient(0deg, #ccc, #32a6d3);
}
</style>