<template>
  <SettingsModal
    :modal="settingsModal"
    @update="handleFeatureSelection"
    :selectFields="settingsFieldsFiltered"
  />
  <div v-show="displayChartCondition" ref="chart" />
  <div v-show="displayErrorCondition" class="absolute-center">
    <q-badge color="negative" class="q-pa-md text-weight-bold">{{
      errorMessage
    }}</q-badge>
  </div>
  <div v-show="displayWarningCondition" class="absolute-center">
    <q-badge color="warning" class="q-pa-md text-weight-bold">{{
      warningMessage
    }}</q-badge>
  </div>
</template>

<script setup>
import Plotly from "plotly.js-cartesian-dist-min";
import { computed, onMounted, ref, watch } from "vue";
import useScatterChartData from "@/composable/scatterChartData";
import useBoxPlotData from "@/composable/boxPlotData";
import useHistogramData from "@/composable/histogramData";
import SettingsModal from "./SettingsModal.vue";
import { useCustomChartIcon } from "@/composable/charts/customIcon";

const props = defineProps([
  "width",
  "chartId",
  "update",
  "chartView",
  "protocols",
  "selectedPlate", //plateId
  "selectedWells",
]);

const emit = defineEmits(["selection"]);

const settingsModal = ref(false);
function openSettings(val) {
  settingsModal.value = val;
}

const settingsFields = computed(() => [
  {
    initialValue: selectedProtocol.value,
    options: plateProtocols.value,
    label: "Protocol",
    optionValue: "id",
    optionLabel: "name",
  },
  {
    initialValue: selectedXAxisOption.value,
    options: plotValueOptions.value,
    label: "x values",
    optionLabel: "label",
  },
  {
    initialValue: selectedYAxisOption.value,
    options: plotValueOptions.value,
    label: "y values",
    optionLabel: "label",
  },
  {
    initialValue: groupBy.value,
    options: groupByOptions.value,
    label: "Group by",
    optionValue: "value",
    optionLabel: "label",
  },
]);

const settingsFieldsFiltered = computed(() => {
  return settingsFields.value.filter((value) => {
    if (value.label == "Select x values") {
      if (showXAxisSelector.value) {
        return value;
      } else {
        return;
      }
    } else if (value.label == "Select y values") {
      if (showYAxisSelector.value) {
        return value;
      } else {
        return;
      }
    } else return value;
  });
});
const displayChartCondition = computed(
  () =>
    JSON.stringify(props.selectedPlate) !== "{}" &&
    JSON.stringify(chartPlot.value.data) !== "[]"
);
const displayWarningCondition = computed(
  () =>
    JSON.stringify(props.selectedPlate) !== "{}" &&
    JSON.stringify(chartPlot.value.data) === "[]"
);

const displayErrorCondition = computed(
  () => JSON.stringify(props.selectedPlate) === "{}"
);
const warningMessage = "No feature data available";
const errorMessage = "No plate selected";

const showXAxisSelector = computed(
  () =>
    props.chartView.type === "scatter" || props.chartView.type === "histogram"
);
const showYAxisSelector = computed(
  () => props.chartView.type === "scatter" || props.chartView.type === "box"
);

const chart = ref(null);
const plateProtocols = ref([]);
const plotValueOptions = ref();
const selectedProtocol = ref({});
const selectedXAxisOption = ref();
const selectedYAxisOption = ref();

function handleSelection(val) {
  if (selectedXAxisOption.value != val["xvalues"]) {
    selectedXAxisOption.value = val["xvalues"];
  }
  if (selectedYAxisOption.value != val["yvalues"]) {
    selectedYAxisOption.value = val["yvalues"];
  }
  if (groupBy.value != val["Groupby"]) {
    groupBy.value = val["Groupby"];
  }
  selectionHandler();
}

function handleFeatureSelection(val) {
  if (selectedProtocol.value != val["Protocol"]) {
    selectedProtocol.value = val["Protocol"];
    handleProtocolSelection();
  }
  handleSelection(val);
  openSettings(false);
  console.log("Update chart for selected feature ");
  // updateChartTraces();
}

onMounted(() => initSelectedValues());
const initSelectedValues = () => {
  plateProtocols.value = props.protocols;
  if (
    !selectedProtocol.value ||
    !plateProtocols.value
      .map((plateProtocol) => plateProtocol.id)
      .includes(selectedProtocol.value.id)
  ) {
    selectedProtocol.value = plateProtocols.value[0];
  }
  updatePlotValueOptions();
  handleChartUpdate();

  let isPlotlyClick = false;
  Plotly.react(
    chart.value,
    chartPlot.value?.data,
    layout(props.chartView),
    config
  );
  chart.value.on("plotly_click", (data) => {
    isPlotlyClick = true;
    const selectedWells =
      data?.points
        ?.filter((p) => p.data?.type === "scatter")
        .map((p) => p.customdata) ?? [];
    emit("selection", selectedWells);
  });

  chart.value.on("plotly_selected", (data) => {
    const selectedWells = data?.points?.map((p) => p.customdata) ?? [];
    emit("selection", selectedWells);
  });

  chart.value.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
  });
  chart.value.addEventListener("click", (ev) => {
    if (!isPlotlyClick) {
      emit("selection", []);
      Plotly.restyle(chart.value, "selectedpoints", null, config);
    } else {
      isPlotlyClick = false;
    }
  });
};

const updatePlotValueOptions = () => {
  plotValueOptions.value = [
    { type: "WELL_PROPERTY", label: "Well ID", value: "wellId" },
    { type: "WELL_PROPERTY", label: "Well Number", value: "wellNr" },
    { type: "WELL_PROPERTY", label: "Well Row", value: "row" },
    { type: "WELL_PROPERTY", label: "Well Column", value: "column" },
    { type: "WELL_PROPERTY", label: "Well Type", value: "wellType" },
    { type: "WELL_PROPERTY", label: "Well Substance", value: "wellSubstance" },
    ...generateFeatureOptions(),
  ];

  if (
    !selectedXAxisOption.value ||
    !plotValueOptions.value
      .map((plotValueOption) => plotValueOption.value)
      .includes(selectedXAxisOption.value.value)
  ) {
    selectedXAxisOption.value = plotValueOptions.value[0];
  }
  if (
    !selectedYAxisOption.value ||
    !plotValueOptions.value
      .map((plotValueOption) => plotValueOption.value)
      .includes(selectedYAxisOption.value.value)
  ) {
    selectedYAxisOption.value = plotValueOptions.value[1];
  }
};

const generateFeatureOptions = () => {
  return (
    selectedProtocol.value?.features.map((feature) => ({
      type: "FEATURE_ID",
      label: `${feature.name}`,
      value: feature.id,
    })) ?? []
  );
};

const groupByOptions = ref([
  { label: "No grouping", value: "none" },
  { label: "Group by well row", value: "row" },
  { label: "Group by well column", value: "column" },
  { label: "Group by well type", value: "welltype" },
  { label: "Group by well status", value: "status" },
  { label: "Group by substance", value: "substance" },
]);
const groupBy = ref(groupByOptions.value[0]);

const chartPlot = ref([]);

const handleChartUpdate = () => {
  if (props.chartView.type === "scatter") {
    const scatterChartData = useScatterChartData();
    scatterChartData
      .getChartData(
        props.selectedPlate?.id,
        selectedProtocol.value?.id,
        selectedXAxisOption.value.value,
        selectedXAxisOption.value.type,
        selectedYAxisOption.value.value,
        selectedYAxisOption.value.type,
        groupBy.value.value
      )
      .then((scatterData) => {
        console.log("Scatter Chart Data: " + Object.keys(scatterData));
        const traces = Object.keys(scatterData).map((groupByKey) => {
          return {
            type: "scatter",
            x: scatterData[groupByKey].xvalues,
            y: scatterData[groupByKey].yvalues,
            customdata: scatterData[groupByKey].customdata,
            mode: "markers",
            marker: {
              size: 12,
              symbol: scatterData[groupByKey].markerSymbol,
            },
            name: groupByKey,
          };
        });
        traces.forEach((trace) => {
          // trace['marker'] = {size: 12}
          if (trace.name === "PC") trace.marker["color"] = "rgb(33,186,69)";
          if (trace.name === "NC") trace.marker["color"] = "rgb(229,35,35)";
        });
        chartPlot.value = {
          data: traces,
          layout: {
            chartTitle: "Plate Scatter Plot",
            xAxisLabel: selectedXAxisOption.value?.label ?? "",
            yAxisLabel: selectedYAxisOption.value?.label ?? "",
          },
        };
      });
  } else if (props.chartView.type === "box") {
    const boxPlotData = useBoxPlotData();
    boxPlotData
      .getChartData(
        props.selectedPlate?.id,
        selectedProtocol.value?.id,
        selectedYAxisOption.value.value,
        selectedYAxisOption.value.type,
        groupBy.value.value
      )
      .then((boxPlotData) => {
        console.log("Box Plot Data: " + JSON.stringify(boxPlotData));
        const traces = Object.keys(boxPlotData).map((groupByKey) => {
          return {
            y: boxPlotData[groupByKey].yvalues,
            type: "box",
            name: groupByKey,
          };
        });
        chartPlot.value = {
          data: traces,
          layout: {
            chartTitle: "Plate Box Plot",
            yAxisLabel: selectedYAxisOption.value?.label ?? "",
          },
        };
      });
  } else if (props.chartView.type === "histogram") {
    const histogramData = useHistogramData();
    histogramData
      .getChartData(
        props.selectedPlate?.id,
        selectedProtocol.value?.id,
        selectedXAxisOption.value.value,
        selectedXAxisOption.value.type,
        groupBy.value.value
      )
      .then((histogramData) => {
        console.log("Histogram Data: " + JSON.stringify(histogramData));
        const traces = Object.keys(histogramData).map((groupByKey) => {
          return {
            x: histogramData[groupByKey].xvalues,
            type: "histogram",
            name: groupByKey,
          };
        });
        chartPlot.value = {
          data: traces,
          layout: {
            chartTitle: "Plate Histogram Plot",
            yAxisLabel: selectedXAxisOption.value?.label ?? "",
          },
        };
      });
  }
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

const handlePlotUpdate = () => {
  console.log("handleUpdatePlot: chart has been updated!");
  if (chartPlot.value.data) {
    Plotly.react(
      chart.value,
      chartPlot.value.data,
      layout(props.chartView),
      config
    );

    const selectedWellIds = props.selectedWells.map((well) =>
      Number.parseInt(well.id)
    );
    const selectedpoints = [];
    if (selectedWellIds.length > 0) {
      chartPlot.value.data.forEach((dataArr) => {
        const wellIndices = dataArr.customdata.map((well, wIndex) => ({
          wellId: well.id,
          wellIndex: wIndex,
        }));
        const selectedWellIndices = wellIndices
          .filter((wIndex) => selectedWellIds.includes(wIndex.wellId))
          .map((wIndex) => wIndex.wellIndex);
        selectedpoints.push(selectedWellIndices);
      });
    }
    Plotly.restyle(chart.value, "selectedpoints", selectedpoints, config);
  }
};

const layout = (chartView) => {
  return {
    autosize: true,
    width: chartView.size ? chartView.size : null,
    title: chartPlot.value?.layout?.chartTitle ?? "",
    xaxis: {
      title: {
        text: chartPlot.value?.layout?.xAxisLabel ?? "",
      },
    },
    yaxis: {
      title: {
        text: chartPlot.value?.layout?.yAxisLabel ?? "",
      },
    },
  };
};

watch(() => props.update, handlePlotUpdate);
watch(() => chartPlot.value, handlePlotUpdate);
watch(() => props.selectedPlate, handleChartUpdate);
watch(() => props.selectedWells, handlePlotUpdate, { deep: true });

const handleProtocolSelection = () => {
  updatePlotValueOptions();
  handleChartUpdate();
};

const createSelectionHandler = () => () => handleChartUpdate();
const selectionHandler = createSelectionHandler();
</script>
