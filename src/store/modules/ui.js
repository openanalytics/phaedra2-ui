import resultDataGraphQLAPI from "@/api/graphql/resultdata";

const state = () => ({
  // Side Panel
  showSidePanel: false,
  openSideViews: [],
  sideViewConfigs: [
    {
      id: "wellImage",
      label: "Well Image",
      icon: "image",
      componentPath: "image/WellImageViewer.vue",
    },
    {
      id: "chart",
      label: "Chart",
      icon: "chart",
      componentPath: "chart/ChartViewer.vue",
    },
    {
      id: "doseResponseCurve",
      label: "Dose Response Curve",
      icon: "show_chart",
      componentPath: "curve/DRCView.vue",
    },
  ],
  // Selection Handling
  selectedWells: [],
  chartType: null,
  chartViews: [],
  selectedSubstances: new Map([]),
});

const getters = {
  isShowSidePanel: (state) => () => {
    return state.showSidePanel;
  },
  getOpenSideViews: (state) => () => {
    return state.openSideViews;
  },
  isSideViewOpen: (state) => (id) => {
    return state.openSideViews.find((el) => el === id);
  },
  getSideViewConfig: (state) => (id) => {
    return state.sideViewConfigs.find((el) => el.id === id);
  },
  getSelectedWells: (state) => () => {
    return [...state.selectedWells];
  },
  getSelectedSubstances: (state) => () => {
    return [...state.selectedSubstances.keys()];
  },
  getSelectedPlates: (state) => () => {
    return [...new Set(state.selectedSubstances.values())];
  },
  getSelectedWellIds: (state) => () => {
    return state.selectedWells.map((el) => el.id);
  },
  getChartType: (state) => () => {
    return state.chartType;
  },
  getChartView: (state) => (chartId) => {
    return state.chartViews.find((cv) => cv.id == chartId);
  },
  getChartViews: (state) => () => {
    return state.chartViews;
  },
};

const actions = {
  toggleSidePanel: (ctx, newShowState) => {
    let currentShowState = ctx.getters.isShowSidePanel();
    if (newShowState !== currentShowState)
      ctx.commit("setShowSidePanel", newShowState);
  },
  openSideView: (ctx, viewID) => {
    let openSideViews = ctx.getters.getOpenSideViews();
    if (openSideViews.find((el) => el === viewID)) return;
    if (openSideViews.length === 0) ctx.commit("setShowSidePanel", true);
    ctx.commit("addOpenSideView", viewID);
  },
  closeSideView: (ctx, viewID) => {
    let openSideViews = ctx.getters.getOpenSideViews();
    if (!openSideViews.find((el) => el === viewID)) return;
    if (openSideViews.length === 1) ctx.commit("setShowSidePanel", false);
    ctx.commit("removeOpenSideView", viewID);
  },
  selectWells: (ctx, wells) => {
    ctx.commit("setSelectedWells", wells);

    const selectedSubstances = wells
      ?.filter(
        (well) =>
          well.wellSubstance !== undefined && well.wellSubstance !== null
      )
      .map((well) => {
        return { name: well.wellSubstance.name, plates: well.plateId };
      });
    ctx.commit("clearSelectedSubstance");
    ctx.commit("addSelectedSubstances", selectedSubstances);
    ctx.commit("setSelectedWells", wells);
  },
  setChartType: (ctx, type) => {
    ctx.commit("setChartType", type);
  },
  async addChartView(ctx, chart) {
    ctx.commit("addChartView", chart);
  },
  removeChartView: (ctx, chartId) => {
    ctx.commit("removeChartView", chartId);
  },
  updateChartViewWidth: (ctx, updates) => {
    ctx.commit("updateChartViewWidth", updates);
  },
  // async updateChartViewXAxisData(ctx, {chartId, plateId, xFeature})  {
  //     // TODO:  implement onError handler
  //     const {onResult, onError} = resultDataGraphQLAPI.featureValuesByPlateIdAndFeatureId(plateId, xFeature.featureId)
  //     onResult(({data}) => {
  //         const xValues = data.featureValues
  //         ctx.commit('updateChartViewXAxisData', {'chartId': chartId, 'xFeature': xFeature, 'xValues': xValues})
  //     })
  // },
  // async updateChartViewYAxisData(ctx, {chartId, plateId, yFeature}) {
  //     // TODO:  implement onError handler
  //     const {onResult, onError} = resultDataGraphQLAPI.featureValuesByPlateIdAndFeatureId(plateId, yFeature.featureId)
  //     onResult(({data}) => {
  //         const yValues = data.featureValues
  //         ctx.commit('updateChartViewYAxisData', {'chartId': chartId, 'yFeature': yFeature, 'yValues': yValues.value})
  //     })
  //
  // },
  // //TODO: Add selectSubstance functionupdateChartViewXAxisData
  // selectSubstance: (ctx,  substance) => {
  //
  // }
};

const mutations = {
  setShowSidePanel: (state, newShowState) => {
    state.showSidePanel = newShowState;
  },
  addOpenSideView: (state, viewID) => {
    state.openSideViews.push(viewID);
  },
  removeOpenSideView: (state, viewID) => {
    let index = state.openSideViews.findIndex((el) => el === viewID);
    state.openSideViews.splice(index, 1);
  },
  setSelectedWells: (state, wells) => {
    state.selectedWells = [...wells];
  },
  addSelectedWells: (state, wells) => {
    state.selectedWells.push([...wells]);
  },
  removeSelectedWells: (state, wells) => {
    wells.forEach(
      (selectedWell) =>
        (state.selectedWells = state.selectedWells.filter(
          (well) => well.id === selectedWell.id
        ))
    );
  },
  setChartType: (state, type) => {
    state.chartType = type;
  },
  addChartView: (state, chart) => {
    state.chartViews.push({ id: state.chartViews.length, ...chart });
  },
  removeChartView: (state, chartId) => {
    const index = state.chartViews.findIndex(
      (chartView) => chartView.id === chartId
    );
    if (index > -1) {
      state.chartViews.splice(index, 1);
    }
  },
  updateChartViewWidth: (state, updates) => {
    state.chartViews.forEach((chartView, index) => {
      chartView["size"] = updates[index];
    });
  },
  updateChartViewXAxisData: (state, { chartId, xFeature, xValues }) => {
    const index = state.chartViews.findIndex((cv) => cv.id == chartId);
    state.chartViews[index].xFeature = xFeature;
    state.chartViews[index].xValues = xValues;
  },
  updateChartViewYAxisData: (state, { chartId, yFeature, yValues }) => {
    const index = state.chartViews.findIndex((cv) => cv.id == chartId);
    state.chartViews[index].yFeature = yFeature;
    state.chartViews[index].yValues = yValues;
  },
  addSelectedSubstances: (state, substances) => {
    substances.forEach((substance) => {
      state.selectedSubstances.set(substance.name, substance.plates);
    });
  },
  removeSelectedSubstances: (state, substances) => {
    substances.forEach((substance) => {
      state.selectedSubstances.delete(substance.name, substance.plates);
    });
  },
  clearSelectedSubstance: (state) => {
    state.selectedSubstances = new Map([]);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
