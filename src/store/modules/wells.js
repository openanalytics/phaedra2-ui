import wellAPI from '@/api/wells.js'

const state = () => ({
    wellsByPlate: {}
})

const getters = {
    getWells: (state) => (plateId) => {
        return state.wellsByPlate[plateId];
    },
    areWellsLoaded: (state) => (plateId) => {
        return state.wellsByPlate[plateId] != null;
    },
}

const actions = {
    async fetchByPlateId(ctx, plateId) {
        const wells = await wellAPI.getWellsByPlateId(plateId);
        ctx.commit('addWells', { plateId, wells });
    },
}

const mutations = {
    addWells(state, args) {
        state.wellsByPlate[args.plateId] = args.wells;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
