<template>
  <div ref="chart" />
  <div class="col oa-section-body">
    <q-select
      class="q-pa-xs"
      v-model="selectedProtocol"
      :options="plateProtocols"
      :option-value="'id'"
      :option-label="'name'"
      label="Select protocol"
      @update:model-value="handleProtocolSelection"
      dense
    />
    <q-select
      class="q-pa-xs"
      v-if="showXAxisSelector"
      v-model="selectedXAxisOption"
      :options="plotValueOptions"
      :option-label="'label'"
      label="Select x values"
      @update:model-value="selectionHandler"
      dense
    />
    <q-select
      class="q-pa-xs"
      v-if="showYAxisSelector"
      v-model="selectedYAxisOption"
      :options="plotValueOptions"
      :option-label="'label'"
      label="Select y values"
      @update:model-value="selectionHandler"
      dense
    />
    <q-select
      class="q-pa-xs"
      v-model="groupBy"
      :options="groupByOptions"
      :option-value="'value'"
      :option-label="'label'"
      @update:model-value="selectionHandler"
      label="Group by"
      dense
    />
  </div>
</template>

<script setup>
import Plotly from "plotly.js-cartesian-dist-min";
import { computed, onMounted, ref, watch } from "vue";
import { useUIStore } from "@/stores/ui";
import useScatterChartData from "@/composable/scatterChartData";
import useBoxPlotData from "@/composable/boxPlotData";
import useHistogramData from "@/composable/histogramData";

const uiStore = useUIStore();
const props = defineProps(["width", "chartId", "update", "chartView"]);

// const chartView = computed(() => uiStore.getChartView(props.chartId))
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

onMounted(() => initSelectedValues());
const initSelectedValues = () => {
  plateProtocols.value = uiStore.protocols;
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
  Plotly.react(chart.value, chartPlot.value?.data, layout(props.chartView), {
    displaylogo: false,
  });
  chart.value.on("plotly_click", (data) => {
    isPlotlyClick = true;
    const selectedWells =
      data?.points
        ?.filter((p) => p.data?.type === "scatter")
        .map((p) => p.customdata) ?? [];
    uiStore.selectedWells = selectedWells;
  });

  chart.value.on("plotly_selected", (data) => {
    const selectedWells = data?.points?.map((p) => p.customdata) ?? [];
    uiStore.selectedWells = selectedWells;
  });

  chart.value.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
  });
  chart.value.addEventListener("click", (ev) => {
    if (!isPlotlyClick) {
      uiStore.selectedWells = [];
      Plotly.restyle(chart.value, "selectedpoints", null);
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
  // const chartView = computed(() => uiStore.getChartView(props.chartId))
  if (props.chartView.type === "scatter") {
    const scatterChartData = useScatterChartData();
    scatterChartData
      .getChartData(
        uiStore.selectedPlate?.id,
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
        uiStore.selectedPlate?.id,
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
        uiStore.selectedPlate?.id,
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

const handlePlotUpdate = () => {
  console.log("handleUpdatePlot: chart has been updated!");
  if (chartPlot.value.data) {
    Plotly.react(chart.value, chartPlot.value.data, layout(props.chartView), {
      displaylogo: false,
    });

    const selectedWellIds = uiStore.selectedWells.map((well) =>
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
    Plotly.restyle(chart.value, "selectedpoints", selectedpoints);
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
watch(() => uiStore.selectedPlate, handleChartUpdate);
watch(() => uiStore.selectedWells, handlePlotUpdate, { deep: true });

const handleProtocolSelection = () => {
  updatePlotValueOptions();
  handleChartUpdate();
};

const createSelectionHandler = () => () => handleChartUpdate();
const selectionHandler = createSelectionHandler();
</script>
