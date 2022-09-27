
const state = () => ({
    // Side Panel
    showSidePanel: false,
    openSideViews: [],
    sideViewConfigs: [
        { id: 'wellImage', label: 'Well Image', icon: 'image', componentPath: 'image/WellImageViewer.vue' },
        { id: 'chart', label: 'Chart', icon: 'chart', componentPath: 'chart/ChartViewer.vue' },
    ],
    // Selection Handling
    selectedWells: []
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
        ctx.commit('setSelectedWells', wells);
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
