<template>
  <pane v-on:drop="drop($event, paneId)" v-on:dragover="allowDrop">
    <template v-if="panes && panes.length > 0">
      <q-tabs
        v-model="activeTab"
        inline-label
        dense
        align="left"
        no-caps
        class="oa-section-title"
      >
        <q-tab
          v-for="component in panes"
          :key="component.id"
          :name="component.title"
          :label="component.title"
          :icon="component.icon"
          draggable="true"
          v-on:drag="dragging"
          :id="`${component.id}`"
          v-on:dragstart="dragStart($event, component.component)"
        >
        </q-tab>
      </q-tabs>

      <q-tab-panels
        v-model="activeTab"
        animated
        swipeable
        vertical
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel
          v-for="component in panes"
          :key="component.id"
          :name="component.title"
        >
          <component :is="component.component" />
        </q-tab-panel>
      </q-tab-panels>

      <!-- <component
            :is="component.component"
            draggable="true"
            v-on:drag="dragging"
            :id="`${component.id}`"
            v-on:dragstart="dragStart($event, component.component)"
          /> -->
    </template>
    <EmptyPane v-else />
  </pane>
</template>

<script setup>
import EmptyPane from "@/components/dashboard/panes/EmptyPane";
import { usePanesStore } from "@/stores/panes";
import { ref } from "vue";

const props = defineProps(["panes", "paneId"]);

const activeTab = ref();

const panesStore = usePanesStore();

function dragStart(event, component) {
  panesStore.draggedElement = component;
  event.dataTransfer.setData("Text", event.target.id);
}

function dragging() {}
function allowDrop(event) {
  event.preventDefault();
}
function drop(event) {
  panesStore.addItem(panesStore.draggedElement, props.paneId);
  event.preventDefault();
}
</script>

<style>
.dashboard {
  width: 100%;
  height: 100%;
}
</style>
