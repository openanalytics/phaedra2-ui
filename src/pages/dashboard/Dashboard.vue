<template>
  <q-page class="oa-root-div">
    <Splitpanes class="default-theme dashboard">
      <SplitPane :panes="panesStore.leftPaneComponents" paneId="left" />
      <pane>
        <Splitpanes horizontal>
          <SplitPane :panes="panesStore.centerPaneComponents" paneId="center" />
          <SplitPane :panes="panesStore.bottomPaneComponents" paneId="bottom" />
        </Splitpanes>
      </pane>
      <SplitPane :panes="panesStore.rightPaneComponents" paneId="right" />
    </Splitpanes>
  </q-page>
</template>

<script setup>
import SplitPane from "@/components/splitpanes/SplitPane";
import { usePanesStore } from "@/stores/panes";

const panesStore = usePanesStore();
</script>

<style>
.dashboard {
  width: 100%;
  height: 100%;
}
</style>
