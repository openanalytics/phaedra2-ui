<template>
  <q-toolbar
    id="workbench-toolbar"
    class="text-primary q-my-sm border-primary bg-white flex justify-between"
    style="border: solid 1px"
  >
    <q-btn-dropdown
      stretch
      flat
      label="add pane"
      size="s"
      class="oa-button bg-white text-primary"
    >
      <q-list v-for="(item, i) in items" :key="i">
        <q-item-label header>{{ item.category }}</q-item-label>
        <WorkbenchMenuItem
          v-for="(pane, i) in item.panes"
          :key="i"
          :name="pane.name"
          :id="pane.id"
        />
        <q-separator inset spaced />
      </q-list>
    </q-btn-dropdown>
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
import WorkbenchMenuItem from "./WorkbenchMenuItem.vue";
import { usePanesStore } from "@/stores/panes";

const items = [
  {
    category: "PROJECTS",
    panes: [
      {
        name: "Browser",
        id: "project-list-pane",
      },
      {
        name: "Details",
        id: "project-details-pane",
      },
      {
        name: "New Project",
        id: "create-project-form-pane",
      },
    ],
  },
  {
    category: "EXPERIMENTS",
    panes: [
      {
        name: "Experiments",
        id: "experiments-list-pane",
      },
    ],
  },
];

const panesStore = usePanesStore();
function closeAllTabs() {
  panesStore.closeAllTabs();
}
</script>

<style>
#workbench-toolbar.q-toolbar {
  min-height: 20px !important;
}
</style>
