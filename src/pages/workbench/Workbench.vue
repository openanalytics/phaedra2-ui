<template>
  <q-page class="oa-root-div">
    <WorkbenchMenu />
    <PanesDashboard
      style="height: calc(100vh - 96px)"
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
import { onBeforeMount } from "vue";
import { useSelectionStore } from "../../stores/selection";
import projectsGraphQlAPI from "@/api/graphql/projects";

const panesStore = usePanesStore();
const selectionStore = useSelectionStore();

onBeforeMount(() => {
  const { onResult, onError } = projectsGraphQlAPI.projects();
  onResult(({ data }) => {
    selectionStore.projects = data.projects;
  });
});
</script>

<style>
.dashboard {
  width: 100%;
  height: 100%;
}
</style>
