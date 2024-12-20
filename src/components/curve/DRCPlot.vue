<template>
  <div ref="plot" />
</template>

<script setup>
import { onMounted, onUpdated, ref, watch } from "vue";
import Plotly from "plotly.js-cartesian-dist-min";
import ArrayUtils from "@/lib/ArrayUtils";
import { useUIStore } from "@/stores/ui";
import { usePlateStore } from "@/stores/plate";

const props = defineProps([
  "width",
  "height",
  "curves",
  "update",
  "selectedWells",
]);
const emits = defineEmits(["wellSelection"]);
const plot = ref(null);

const uiStore = useUIStore();
const plateStore = usePlateStore();

const selectedWells = ref([]);

const updateDRCPlotView = () => {
  const config = { autosize: true, displaylogo: false };
  const layout = {
    yaxis: {
      title: "Feature",
    },
    xaxis: {
      title: "log10(Molar)",
    },
    margin: { t: 50, b: 50 },
    showlegend: false,
    width:
      plot.value.parentElement.offsetWidth > 0
        ? plot.value.parentElement.offsetWidth
        : props.width,
    height: props.height,
  };

  if (props.curves?.length === 1) {
    const top = props.curves[0].curveProperties.find(
      (cProp) => cProp.name == "Top"
    ).numericValue;
    const bottom = props.curves[0].curveProperties.find(
      (cProp) => cProp.name == "Bottom"
    ).numericValue;
    const minX = ArrayUtils.firstElement(props.curves[0].plotDoseData);
    const maxX = ArrayUtils.lastElement(props.curves[0].plotDoseData);

    layout["shapes"] = [
      {
        type: "line",
        x0: minX,
        x1: maxX,
        y0: top,
        y1: top,
        line: {
          color: "rgb(0, 255, 0)",
          width: 4,
          dash: "dot",
        },
      },
      {
        type: "line",
        x0: minX,
        x1: maxX,
        y0: bottom,
        y1: bottom,
        line: {
          color: "rgb(255, 0, 0)",
          width: 4,
          dash: "dot",
        },
      },
    ];
  }

  if (props.curves?.length > 0) {
    const curveData = props.curves?.map((curve) => {
      const spline = {
        x: curve.plotDoseData,
        y: curve.plotPredictionData,
        mode: "lines",
        line: {
          shape: "spline",
          color: curve.color,
        },
        hovertemplate: `${curve.substanceName} (${curve.featureName}) <extra></extra>`,
        showlegend: true,
        legendgroup: `${curve.substanceName} (${curve.featureId})`,
        name: `${curve.substanceName}`,
      };

      const markers = {
        x: curve.wellConcentrations.map((wc) => -wc),
        y: curve.featureValues,
        mode: "markers",
        marker: {
          size: curve.weights?.map((w) => (w + 1.0) * 10),
          color: curve.color,
          // symbol: []
        },
        wellIds: curve.wells,
        hovertemplate: "x = %{x}, y = %{y}<extra></extra>",
        showlegend: false,
        legendgroup: `${curve.substanceName} (${curve.featureId})`,
      };

      return {
        substanceName: curve.substanceName,
        curve: spline,
        datapoints: markers,
      };
    });

    const line = curveData.map((cData) => cData.curve);
    const scatter = curveData.map((cData) => cData.datapoints);
    const data = ref(line.concat(scatter));
    Plotly.react(plot?.value, data.value, layout, config);
  } else {
    const data = ref([]);
    Plotly.react(plot?.value, data.value, layout, config);
  }

  restylePlot(props.selectedWells);
};

const restylePlot = (wells) => {
  selectedWells.value = wells;
  const wellIds = selectedWells.value.map((well) => well.id);
  if (wellIds.length > 0) {
    plot.value.data.forEach((dataArr, index) => {
      if (dataArr.wellIds) {
        const wellIndices = dataArr.wellIds.map((wellId, wIndex) => ({
          wellId: wellId,
          wellIndex: wIndex,
        }));
        const selectedWellIndices = wellIndices
          .filter((wIndex) => wellIds.includes(wIndex.wellId))
          .map((wIndex) => wIndex.wellIndex);
        Plotly.restyle(
          plot.value,
          "selectedpoints",
          [selectedWellIndices],
          index
        );
      }
    });
  }
  emits("wellSelection", selectedWells.value);
};

const resizeDRCPlotView = () => {
  const update = {
    width: plot.value.offsetWidth - 10,
    height: props.height,
  };
  Plotly.relayout(plot?.value, update);
};

watch(() => props.curves, updateDRCPlotView);

onMounted(() => {
  updateDRCPlotView();

  let isPlotlyClick = false;
  plot.value?.on("plotly_click", (data) => {
    isPlotlyClick = true;
    const selectedWellIds = data.points.map(
      (p) => p.data.wellIds[p.pointIndex]
    );
    // uiStore.selectedWells = plateStore.wells.filter(well => selectedWellIds.includes(well.id))
    selectedWells.value = plateStore.wells.filter((well) =>
      selectedWellIds.includes(well.id)
    );
    restylePlot(selectedWells.value);
  });

  plot.value?.on("plotly_selected", (data) => {
    console.log(JSON.stringify(data));
  });

  plot.value.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
  });
  plot.value.addEventListener("click", (ev) => {
    if (!isPlotlyClick) {
      uiStore.selectedWells = [];
      Plotly.restyle(plot.value, "selectedpoints", null);
    } else {
      isPlotlyClick = false;
    }
  });
});
onUpdated(() => resizeDRCPlotView());
</script>
