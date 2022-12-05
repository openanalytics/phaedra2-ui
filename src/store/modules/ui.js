
const state = () => ({
    // Side Panel
    showSidePanel: false,
    openSideViews: [],
    sideViewConfigs: [
        { id: 'wellImage', label: 'Well Image', icon: 'image', componentPath: 'image/WellImageViewer.vue' },
        { id: 'chart', label: 'Chart', icon: 'chart', componentPath: 'chart/ChartViewer.vue' },
        { id: 'doseResponseCurve', label: 'Dose Response Curve', icon: 'show_chart', componentPath: 'curve/DoseResponseCurve.vue' }
    ],
    // Selection Handling
    selectedWells: [],
    chartType: null,
    selectedSubstances: new Map([]),
})

const getters = {
    isShowSidePanel: (state) => () => {
        return state.showSidePanel;
    },
    getOpenSideViews: (state) => () => {
        return state.openSideViews;
    },
    isSideViewOpen: (state) => (id) => {
        return state.openSideViews.find(el => el == id);
    },
    getSideViewConfig: (state) => (id) => {
        return state.sideViewConfigs.find(el => el.id == id);
    },
    getSelectedWells: (state) => () => {
        return [...state.selectedWells];
    },
    getSelectedSubstances: (state) => () => {
        return [...state.selectedSubstances.keys()];
    },
    getSelectedPlates: (state) => () => {
        return [...new Set(state.selectedSubstances.values())]
    },
    getSelectedWellIds: (state) => () => {
        return state.selectedWells.map(el => el.id);
    },
    getChartType: (state) => () => {
        return state.chartType;
    }
}

const actions = {
    toggleSidePanel: (ctx, newShowState) => {
        let currentShowState = ctx.getters.isShowSidePanel();
        if (newShowState != currentShowState) ctx.commit('setShowSidePanel', newShowState);
    },
    openSideView: (ctx, viewID) => {
        let openSideViews = ctx.getters.getOpenSideViews();
        if (openSideViews.find(el => el == viewID)) return;
        if (openSideViews.length == 0) ctx.commit('setShowSidePanel', true);
        ctx.commit('addOpenSideView', viewID);
    },
    closeSideView: (ctx, viewID) => {
        let openSideViews = ctx.getters.getOpenSideViews();
        if (!openSideViews.find(el => el == viewID)) return;
        if (openSideViews.length == 1) ctx.commit('setShowSidePanel', false);
        ctx.commit('removeOpenSideView', viewID);
    },
    selectWells: (ctx, wells) => {
        ctx.commit('setSelectedWells', wells)

        const selectedSubstances = wells?.filter(well => well.wellSubstance !== undefined)
            .map(well => { return { "name": well.wellSubstance.name, "plates": well.plateId }})
        ctx.commit('clearSelectedSubstance')
        ctx.commit('addSelectedSubstances', selectedSubstances)
        ctx.commit('setSelectedWells', wells);
    },
    setChartType: (ctx, type) => {
        console.log('change type to', type)
        ctx.commit('setChartType', type);
    }
}

const mutations = {
    setShowSidePanel: (state, newShowState) => {
        state.showSidePanel = newShowState;
    },
    addOpenSideView: (state, viewID) => {
        state.openSideViews.push(viewID);
    },
    removeOpenSideView: (state, viewID) => {
        let index = state.openSideViews.findIndex(el => el == viewID);
        state.openSideViews.splice(index, 1);
    },
    setSelectedWells: (state, wells) => {
        state.selectedWells = [...wells];
    },
    setChartType: (state, type) => {
        state.chartType = type;
    },
    addSelectedSubstances: (state, substances) => {
        substances.forEach(substance => {
            state.selectedSubstances.set(substance.name, substance.plates)
        })
    },
    removeSelectedSubstances: (state, substances) => {
        substances.forEach(substance => {
            state.selectedSubstances.delete(substance.name, substance.plates)
        })
    },
    clearSelectedSubstance: (state) => {
        state.selectedSubstances = new Map([])
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
