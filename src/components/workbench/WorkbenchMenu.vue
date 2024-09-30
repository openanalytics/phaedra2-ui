<template>
  <q-toolbar
    id="workbench-toolbar"
    class="text-primary q-my-sm border-primary bg-white"
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
</script>

<style>
#workbench-toolbar.q-toolbar {
  min-height: 20px !important;
}
</style>
