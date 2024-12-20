<template>
  <div ref="chartViewer">
    <q-toolbar class="oa-section-title">
      <q-tabs
        v-model="activeTab"
        inline-label
        dense
        align="left"
        no-caps
        class="oa-section-title"
      >
        <q-tab
          v-for="chart in uiStore.chartViews"
          :key="chart.id"
          :name="chart.id"
        >
          <div class="flex flex-center">
            <div class="q-pr-sm">{{ chart.label }}</div>
            <q-btn
              icon="close"
              size="xs"
              @click="closeTab(chart.id)"
              round
              flat
            />
          </div>
        </q-tab>
      </q-tabs>
      <q-space />
      <q-btn
        v-if="horizontal"
        icon="view_stream"
        @click="changeOrientation"
        class="q-pa-xs"
        size="md"
        flat
      >
        <q-tooltip>Show vertical view</q-tooltip>
      </q-btn>
      <q-btn
        v-if="!horizontal"
        icon="view_column"
        @click="changeOrientation"
        class="q-pa-xs"
        size="md"
        flat
      >
        <q-tooltip>Show horizontal view</q-tooltip>
      </q-btn>
    </q-toolbar>
    <div class="oa-section-body">
      <q-tab-panels v-model="activeTab">
        <q-tab-panel
          v-for="chart in uiStore.chartViews"
          :key="chart.id"
          :name="chart.id"
        >
          <Chart
            v-if="chart.type !== 'trend'"
            :chartId="chart.id"
            :update="update"
            :chartView="getChartView(chart.id)"
            :selectedPlate="uiStore.selectedPlate"
            :selectedWells="uiStore.selectedWells"
            :protocols="uiStore.protocols"
            @selection="handleSelection"
          />
          <TrendChart
            v-if="chart.type === 'trend'"
            :chartId="chart.id"
            :update="update"
            :selectedExperiments="uiStore.selectedExperiments"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>

  <WellActionMenu
    :well="uiStore.selectedWells[0]"
    context-menu
    @acceptWells="handleAcceptWells"
    @rejectWells="handleRejectWells"
  />
</template>

<script setup>
import { onUpdated, ref } from "vue";
import Chart from "./Chart";
import TrendChart from "@/components/chart/TrendChart.vue";
import WellActionMenu from "@/components/well/WellActionMenu";
import { useUIStore } from "@/stores/ui";
import { usePlateStore } from "@/stores/plate";

const uiStore = useUIStore();
const plateStore = usePlateStore();

const props = defineProps(["chartTemplate", "update"]);
const emits = defineEmits(["changeOrientation", "wellStatusChanged"]);

const activeTab = ref(uiStore.chartViews[0].id);
const update = ref(Date.now());

onUpdated(() => handleChartResize());

const handleChartResize = () => {
  update.value = Date.now();
};

const closeTab = (chartId) => {
  uiStore.removeChartView(chartId);
  if (uiStore.chartViews.length > 0) activeTab.value = uiStore.chartViews[0].id;
  update.value = Date.now();
};

const horizontal = ref(true);
const changeOrientation = () => {
  horizontal.value = !horizontal.value;
  emits("changeOrientation");
};

const handleRejectWells = () => {
  console.log(
    "Reject selected wells: " + JSON.stringify(uiStore.selectedWells)
  );
  if (uiStore.selectedWells.length > 0) {
    plateStore
      .rejectWells(
        uiStore.selectedWells,
        "REJECTED_PHAEDRA",
        "Well rejection from chart!"
      )
      .then(() => {
        emits("wellStatusChanged");
      });
  }
};

const handleAcceptWells = () => {
  console.log(
    "Accept selected wells: " + JSON.stringify(uiStore.selectedWells)
  );
  if (uiStore.selectedWells.length > 0) {
    plateStore.acceptWells(uiStore.selectedWells).then(() => {
      emits("wellStatusChanged");
    });
  }
};

function getChartView(id) {
  return uiStore.getChartView(id);
}

function handleSelection(wells) {
  uiStore.selectedWells = wells;
}
</script>

<style></style>
