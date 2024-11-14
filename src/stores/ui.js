import { defineStore } from "pinia";
import projectsGraphQlAPI from "@/api/graphql/projects";
import resultdataGraphQlAPI from "@/api/graphql/resultdata";
import resultDataGraphQlAPI from "@/api/graphql/resultdata";
import curvesGraphQlAPI from "@/api/graphql/curvedata";
import ColorUtils from "@/lib/ColorUtils";
import { ref } from "vue";

export const useUIStore = defineStore("ui", {
  state: () => ({
    // Selection Handling
    selectedProject: null,

    selectedExperiment: null,
    selectedExperiments: [],

    showQuickHeatmap: false,

    selectedPlate: null,
    selectedPlates: [],

    showChartViewer: false,
    chartViews: [],

    showDRCView: false,
    selectedDRCurves: [],

    selectedWell: null,
    selectedWells: ref([]),
    selectedSubstances: new Map([]),

    showImageView: false,
    imageRenderSettings: {
      scale: 0.25,
      channels: [],
      baseRenderConfigId: null,
    },
  }),
  getters: {
    wells: (state) => {
      return state.selectedPlate?.wells ?? [];
    },
    measurements: (state) => {
      return state.selectedPlate?.measurements ?? [];
    },
    protocols: (state) => {
      return state.selectedPlate?.protocols ?? [];
    },
    getChartView: (state) => {
      return (chartId) => state.chartViews.find((cv) => cv.id == chartId);
    },
    getSelectedWells: (state) => () => {
      return [...state.selectedWells];
    },
    getSelectedSubstances: (state) => () => {
      return [...state.selectedSubstances.keys()];
    },
    isPlateSelected: (state) => () => {
      return state.selectedPlates.length > 0;
    },
    isExperimentSelected: (state) => () => {
      return (
        state.selectedExperiments.length > 0 ||
        state.selectedExperiments !== null
      );
    },
  },
  actions: {
    async loadSelectedPlate(plateId) {
      const data = await projectsGraphQlAPI.plateById(plateId);
      this.selectedPlate = data.plate;
      this.selectedPlate["wells"] = data.wells;

      await this.loadPlateCalculations(plateId);
      await this.loadPlateProtocols(plateId);

      // const { onResult, onError } = await projectsGraphQlAPI.plateById(plateId);
      // onResult(({ data }) => {
      //   this.selectedPlate = data.plate;
      //   this.selectedPlate["wells"] = data.wells;
      //
      //   this.loadPlateCalculations(plateId);
      //   this.loadPlateProtocols(plateId);
      // });
    },
    async loadPlateMeasurements(plateId) {
      const data = await projectsGraphQlAPI.measurementsByPlateId(plateId);
      this.selectedPlate["measurements"] = data.plateMeasurements;
      // const { onResult, onError } = await projectsGraphQlAPI.measurementsByPlateId(plateId);
      // onResult(({ data }) => {
      //   this.selectedPlate["measurements"] = data.plateMeasurements;
      // });
    },
    async loadPlateCalculations(plateId) {
      const data = resultdataGraphQlAPI.resultSetsByPlateId(plateId)
      this.selectedPlate["resultSets"] = data.resultSets
      // const { onResult, onError } =
      //   resultdataGraphQlAPI.resultSetsByPlateId(plateId);
      // onResult(({ data }) => {
      //   this.selectedPlate["resultSets"] = data.resultSets;
      // });
    },
    async loadPlateProtocols(plateId) {
      const data = await resultDataGraphQlAPI.protocolsByPlateId(plateId)
      this.selectedPlate["protocols"] = data.protocols;
      // const { onResult, onError } = await resultDataGraphQlAPI.protocolsByPlateId(plateId);
      // onResult(({ data }) => {
      //   this.selectedPlate["protocols"] = data.protocols;
      // });
    },
    async loadPlateCurves(plateId) {
      const data = await curvesGraphQlAPI.curvesByPlateId(plateId)
      const colorList = ColorUtils.getColorList(data.curves?.length);
      const curves = data.curves?.map((curve, index) => {
        curve["color"] = colorList[index];
        return curve;
      });
      this.selectedPlate["curves"] = curves;
      // const { onResult, onError } = curvesGraphQlAPI.curvesByPlateId(plateId);
      // onResult(({ data }) => {
      //   const colorList = ColorUtils.getColorList(data.curves?.length);
      //   const curves = data.curves?.map((curve, index) => {
      //     curve["color"] = colorList[index];
      //     return curve;
      //   });
      //   this.selectedPlate["curves"] = curves;
      // });
    },
    addDRCure(curve, event) {
      if (event && (event.ctrlKey || event.metaKey)) {
        const index = this.selectedDRCurves.findIndex((c) => c.id === curve.id);
        index < 0
          ? this.selectedDRCurves.push(curve)
          : this.selectedDRCurves.splice(index, 1);
        this.selectedDRCurves = [...this.selectedDRCurves];
      } else {
        this.selectedDRCurves = [curve];
      }
    },
    addChartView(chart) {
      this.chartViews.push({ id: new Date().getTime(), ...chart });
      this.showChartViewer = true;
    },
    removeChartView(chartId) {
      this.chartViews = this.chartViews.filter(
        (chartView) => chartView.id !== chartId
      );
      this.chartViews.length > 0
        ? (this.showChartViewer = true)
        : (this.showChartViewer = false);
    },
    updateImageRenderSettings(newSettings) {
      this.imageRenderSettings = {
        ...this.imageRenderSettings,
        ...newSettings,
      };
    },
  },
});
