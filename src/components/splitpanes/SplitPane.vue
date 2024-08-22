<template>
  <Pane min-size="5">
    <template
      v-if="panes && panes.length > 0"
      style="position: relative; width: 100%; height: 100%"
    >
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
          :id="`${component.id}`"
          draggable="true"
          v-on:dragstart="dragStart(component)"
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
        style="position: relative; width: 100%; height: 100%"
      >
        <q-tab-panel
          style="
            position: relative;
            width: 100%;
            display: flex;
            max-width: 100%;
            height: 100%;
          "
          v-for="component in panes"
          :key="component.id"
          :name="component.title"
        >
          <component
            :is="component.component"
            :key="component.id"
            style="position: relative; width: 100%; max-width: 100%"
          />
          <DropArea position="left" @dropped="drop('left')" />
          <DropArea position="top" @dropped="drop('top')" />
          <DropArea position="right" @dropped="drop('right')" />
          <DropArea position="bottom" @dropped="drop('bottom')" />
          <DropArea position="center" @dropped="drop('center')" />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </Pane>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { usePanesStore } from "../../stores/panes";
import DropArea from "./DropArea.vue";

const props = defineProps(["panes"]);
const activeTab = ref();

const panesStore = usePanesStore();

function dragStart(component) {
  panesStore.draggedElement = component.id;
}

function drop(position) {
  panesStore.addItem(panesStore.draggedElement, props.panes[0].id, position);
  panesStore.draggedElement = undefined;
}

onMounted(() => {
  activeTab.value = props.panes[0].title;
});

watch(
  () => props.panes,
  () => {
    if (props.panes.length == 1) {
      activeTab.value = props.panes[0].title;
    }
  }
);
</script>

<style>
.dashboard {
  width: 100%;
  height: 100%;
}
</style>
