<template>
  <q-toolbar
    id="workbench-toolbar"
    class="text-primary q-my-sm border-primary bg-white flex justify-between"
    style="border: solid 1px"
  >
    <q-btn
      label="Add Pane"
      flat
      class="oa-button bg-white text-primary"
      :icon-right="addPaneIcon"
    >
      <q-menu @update:model-value="openMenu">
        <q-list style="min-width: 100px">
          <q-item v-for="(item, i) in items" :key="i" clickable>
            <q-item-section>{{ item.category }}</q-item-section>
            <q-item-section side>
              <q-icon name="keyboard_arrow_right" />
            </q-item-section>

            <q-menu anchor="top end" self="top start">
              <q-list>
                <WorkbenchMenuItem
                  v-for="(pane, i) in item.panes"
                  :key="i"
                  :name="pane.title"
                  :id="pane.id"
                />
              </q-list>
            </q-menu>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-btn @click="closeAllTabs" icon="close" round flat color="primary">
      <q-tooltip anchor="center left" self="center end"
        >Close all tabs</q-tooltip
      >
    </q-btn>
  </q-toolbar>
</template>

<style lang="scss">
.nav-link {
  text-decoration: none;
  color: black;
}
</style>

<script setup>
import { usePanesList } from "@/maps/panes/panesList";
import WorkbenchMenuItem from "./WorkbenchMenuItem.vue";
import { usePanesStore } from "@/stores/panes";
import { ref } from "vue";

const { panesList } = usePanesList();

const items = [
  {
    category: "PROJECTS",
    panes: [
      panesList.value.find((pane) => pane.id == "project-list-pane"),
      panesList.value.find((pane) => pane.id == "project-details-pane"),
    ],
  },
  {
    category: "EXPERIMENTS",
    panes: [
      panesList.value.find((pane) => pane.id == "experiment-list-pane"),
      // panesList.value.find((pane) => pane.id == "experiment-details-pane")
      panesList.value.find((pane) => pane.id == "experiment-chart-pane"),
    ],
  },
  {
    category: "PLATES",
    panes: [
      panesList.value.find((pane) => pane.id == "plates-list-pane"),
      // panesList.value.find((pane) => pane.id == "experiment-details-pane")
      panesList.value.find((pane) => pane.id == "scatterplot-chart-pane"),
      panesList.value.find((pane) => pane.id == "boxplot-chart-pane"),
      panesList.value.find((pane) => pane.id == "histogram-chart-pane"),
    ],
  },
  {
    category: "WELLS",
    panes: [
      panesList.value.find((pane) => pane.id == "wells-list-pane"),
      panesList.value.find((pane) => pane.id == "heatmap-chart-pane"),
    ],
  },
];

const panesStore = usePanesStore();
function closeAllTabs() {
  panesStore.closeAllTabs();
}

const addPaneIcon = ref("keyboard_arrow_down");
function openMenu(newVal) {
  if (newVal) {
    addPaneIcon.value = "keyboard_arrow_up";
  } else {
    addPaneIcon.value = "keyboard_arrow_down";
  }
}
</script>

<style>
#workbench-toolbar.q-toolbar {
  min-height: 20px !important;
}
</style>
