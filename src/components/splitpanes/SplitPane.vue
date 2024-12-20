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
        class="oa-section"
      >
        <q-tab
          v-for="component in panes"
          :key="component.id"
          :name="component.title"
          :id="`${component.id}`"
          draggable="true"
          v-on:dragstart="dragStart(component)"
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div>
              <q-icon :name="component.icon" style="margin-right: 5px" /><span>
                {{ component.label || component.title }}</span
              >
            </div>
            <q-icon
              name="close"
              style="margin-left: 15px"
              @click.stop="panesStore.removeItem(component.id)"
            />
          </div>
        </q-tab>
      </q-tabs>

      <q-tab-panels
        v-model="activeTab"
        animated
        swipeable
        vertical
        transition-prev="jump-up"
        transition-next="jump-up"
        style="position: relative; width: 100%; height: calc(100% - 30px)"
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
          <PaneTab :component="component" />
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
import PaneTab from "./PaneTab.vue";

const props = defineProps(["panes"]);
const activeTab = ref();

const panesStore = usePanesStore();

watch(
  () => props.panes,
  (newVal, oldVal) => {
    if (newVal[newVal.length - 1].title != oldVal[oldVal.length - 1].title)
      activeTab.value = newVal[newVal.length - 1].title;
  }
);

watch(
  () => panesStore.newestOpenPaneKey,
  () => {
    const newPane = props.panes.find(
      (pane) => pane.id == panesStore.newestOpenPane
    );
    if (newPane) {
      activeTab.value = newPane.title;
    }
  }
);

function dragStart(component) {
  panesStore.draggedElement = component.id;
}

function drop(position) {
  panesStore.moveItem(panesStore.draggedElement, props.panes[0].id, position);
  panesStore.draggedElement = undefined;
}

onMounted(() => {
  activeTab.value = props.panes[props.panes.length - 1].title;
});
</script>

<style>
.dashboard {
  width: 100%;
  height: 100%;
}
</style>
