<template>
  <SettingsModal
    :modal="settingsModal"
    @update="handleFeatureSelection"
    :selectFields="settingsFields"
  />
  <div class="col oa-section-body">
    <div id="chart" />
  </div>
</template>

<script setup>
import Plotly from "plotly.js-cartesian-dist-min";
import usePlateTrendChartData from "@/composable/plateTrendChartData";
import { computed, onMounted, ref, watch } from "vue";
import { useExperimentStore } from "@/stores/experiment";
import SettingsModal from "./SettingsModal.vue";
import { useCustomChartIcon } from "@/composable/charts/customIcon";

const props = defineProps(["chartId", "update", "selectedExperiments"]);

const settingsModal = ref(false);
function openSettings(val) {
  settingsModal.value = val;
}

const settingsFields = computed(() => [
  {
    initialValue: selectedFeature.value,
    options: featureOptions.value,
    label: "Feature",
  },
  {
    initialValue: selectedStat.value,
    options: statOptions.value,
    label: "Statistic",
  },
]);

const chartData = ref([]);
const plates = ref([]);
const featureStatValues = ref([]);
const pcMeanValues = ref([]);
const ncMeanValues = ref([]);
const pcStDevValues = ref([]);
const ncStDevValues = ref([]);
const sampleMeanValues = ref([]);
const sampleStDevValues = ref([]);

const featureOptions = ref([]);
const selectedFeature = ref(null);
const statOptions = ref([]);
const selectedStat = ref(null);

const experimentStore = useExperimentStore();
const plateTrendChartData = usePlateTrendChartData();

watch(
  () => [props.selectedExperiments, props.update],
  (newVal, oldVal) => {
    const newValExp = newVal[0].length ? newVal[0][0]?.id : undefined;
    const oldValExp = oldVal[0].length ? oldVal[0][0]?.id : undefined;
    if (newValExp != oldValExp) {
      loadTrendChart();
    }
  }
);

onMounted(() => {
  loadTrendChart();
});

function loadTrendChart() {
  plateTrendChartData
    .getChartData(
      props.selectedExperiments[0]?.id ?? experimentStore.experiment?.id
    )
    .then((data) => {
      chartData.value = data;
      plates.value = chartData.value.map((cd) => "Plate" + cd.barcode);
      featureOptions.value =
        [
          ...new Set(
            chartData.value.flatMap((cd) =>
              cd.featureStats?.map((fs) => fs.featureId)
            )
          ),
        ] ?? [];
      selectedFeature.value = featureOptions.value[0] ?? null;
      statOptions.value =
        [
          ...new Set(
            chartData.value.flatMap((cd) =>
              cd.featureStats
                ?.filter((fs) => !fs.wellType)
                .map((fs) => fs.statName)
            )
          ),
        ] ?? [];
      selectedStat.value = statOptions.value[0] ?? null;
    });
}

function handleFeatureSelection(val) {
  selectedFeature.value = val["Feature"];
  selectedStat.value = val["Statistic"];
  openSettings(false);
  console.log("Update chart for selected feature " + selectedStat.value);
  updateChartTraces();
}

const extractStats = (statName, wellType) => {
  return (
    chartData.value?.flatMap((cd) =>
      cd.featureStats
        ?.filter(
          (fs) =>
            fs.statName === statName &&
            fs.wellType === wellType &&
            fs.featureId === selectedFeature.value
        )
        .map((fs) => fs.statValue)
    ) ?? []
  );
};

const updateChartTraces = () => {
  featureStatValues.value = extractStats(selectedStat.value);
  pcMeanValues.value = extractStats("mean", "PC");
  ncMeanValues.value = extractStats("mean", "NC");
  sampleMeanValues.value = extractStats("mean", "SAMPLE");
  pcStDevValues.value = extractStats("stdev", "PC");
  ncStDevValues.value = extractStats("stdev", "NC");
  sampleStDevValues.value = extractStats("stdev", "SAMPLE");

  const plateStats = {
    x: plates.value,
    y: featureStatValues.value,
    name: selectedStat.value,
    marker: { color: "rgb(116, 251, 253)" },
    type: "bar",
  };

  const pcWellStats = {
    x: plates.value,
    y: pcMeanValues.value,
    error_y: {
      type: "data",
      array: pcStDevValues.value.map((value) => value * 3),
      visible: true,
    },
    yaxis: "y2",
    mode: "line",
    line: { color: "rgb(0, 255, 0)" },
    name: "PC",
    legendgroup: "PC",
    type: "scatter",
  };

  const pcUpper =
    pcMeanValues.value?.map((val, idx) => val + 3 * pcStDevValues.value[idx]) ??
    [];
  const pcLower =
    pcMeanValues.value?.map((val, idx) => val - 3 * pcStDevValues.value[idx]) ??
    [];

  const stDevPC = {
    x: [...plates.value, ...plates.value.reverse()],
    y: [...pcUpper.reverse(), ...pcLower],
    yaxis: "y2",
    fill: "tozeroy",
    fillcolor: "rgba(0, 255, 0, 0.2)",
    line: { color: "transparent" },
    legendgroup: "PC",
    showlegend: false,
    type: "scatter",
  };

  const ncUpper =
    ncMeanValues.value?.map((val, idx) => val + 3 * ncStDevValues.value[idx]) ??
    [];
  const ncLower =
    ncMeanValues.value?.map((val, idx) => val - 3 * ncStDevValues.value[idx]) ??
    [];

  const ncWellStats = {
    x: plates.value,
    y: ncMeanValues.value,
    error_y: {
      type: "data",
      array: ncStDevValues.value.map((value) => value * 3),
      visible: true,
    },
    yaxis: "y2",
    mode: "line",
    line: { color: "rgb(255, 0, 0)" },
    name: "NC",
    legendgroup: "NC",
    type: "scatter",
  };

  const stDevNC = {
    x: [...plates.value, ...plates.value.reverse()],
    y: [...ncUpper, ...ncLower.reverse()],
    yaxis: "y2",
    fill: "tozeroy",
    fillcolor: "rgba(255, 0, 0, 0.2)",
    line: { color: "transparent" },
    legendgroup: "NC",
    showlegend: false,
    type: "scatter",
  };

  const sampleWellStats = {
    x: plates.value,
    y: sampleMeanValues.value,
    error_y: {
      type: "data",
      array: sampleStDevValues.value.map((value) => value * 3),
      visible: true,
    },
    yaxis: "y2",
    mode: "line",
    line: { color: "rgb(0, 0, 255)" },
    name: "SAMPLE",
    legendgroup: "sampleMean",
    type: "scatter",
    visible: "legendonly",
  };

  const sampleUpper =
    sampleMeanValues.value?.map(
      (val, idx) => val + 3 * sampleStDevValues.value[idx]
    ) ?? [];
  const sampleLower =
    sampleMeanValues.value?.map(
      (val, idx) => val - 3 * sampleStDevValues.value[idx]
    ) ?? [];

  const stDevSAMPLE = {
    x: [...plates.value, ...plates.value.reverse()],
    y: [...sampleUpper.reverse(), ...sampleLower],
    yaxis: "y2",
    fill: "tozeroy",
    fillcolor: "rgba(0, 0, 255, 0.2)",
    line: { color: "transparent" },
    legendgroup: "sampleMean",
    showlegend: false,
    type: "scatter",
    visible: "legendonly",
  };

  var layout = {
    autosize: true,
    title: "Plate Trend Chart",
    yaxis: {
      title: selectedStat.value,
      side: "right",
    },
    yaxis2: {
      title: selectedFeature.value,
      titlefont: { color: "rgb(148, 103, 189)" },
      tickfont: { color: "rgb(148, 103, 189)" },
      overlaying: "y",
      side: "left",
    },
    legend: { orientation: "h" },
  };

  const { tuneIcon } = useCustomChartIcon();

  const config = {
    autosize: true,
    displaylogo: false,
    modeBarButtonsToAdd: [
      {
        name: "settings",
        icon: tuneIcon,
        direction: "up",
        click: function (gd) {
          openSettings(true);
        },
      },
    ],
  };

  const data = [
    plateStats,
    pcWellStats,
    stDevPC,
    ncWellStats,
    stDevNC,
    sampleWellStats,
    stDevSAMPLE,
  ];

  Plotly.react("chart", data, layout, config);
};

watch(
  () => chartData.value,
  () => {
    updateChartTraces();
  }
);
</script>

<style scoped></style>
