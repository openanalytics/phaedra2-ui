import plateAPI from '@/api/plates.js'

const state = () => ({
    plates: []
})

const getters = {
    getByExperimentId: (state) => (id) => {
        return state.plates.filter(plate => plate.experimentId == id);
    },
    getById: (state) => (id) => {
        return state.plates.find(plate => plate.id == id)
    },
    isLoaded: (state) => (id) => {
        return state.plates.find(plate => plate.id == id) != null
    }
}

const actions = {
    async loadByExperimentId(ctx, id) {
        const plates = await plateAPI.getPlatesByExperimentId(id)
        ctx.commit('cachePlates', plates)
    },
    async loadById(ctx, id) {
        const plate = await plateAPI.getPlateById(id)
        ctx.commit('cachePlate', plate)
    },
}

const mutations = {
    cachePlate (state, plate) {
        let index = state.plates.indexOf(plate)
        if (index === -1) state.plates.push(plate)
    },
    cachePlates(state, plates) {
        plates.forEach(plate => {
            let index = state.plates.indexOf(plate)
            if (index === -1) state.plates.push(plate)
        });
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}