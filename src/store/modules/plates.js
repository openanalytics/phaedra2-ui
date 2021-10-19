import plateAPI from '@/api/plates.js'

const state = () => ({
    plates: [],
    platesInExperiment: {}
})

const getters = {
    getByExperimentId: (state) => (id) => {
        // return state.plates.filter(plate => plate.experimentId == id);
        return state.platesInExperiment[id];
    },
    getById: (state) => (id) => {
        return state.plates.find(plate => plate.id == id)
    },
    isLoaded: (state) => (id) => {
        return state.plates.find(plate => plate.id == id) != null
    },
    isExperimentLoaded: (state) => (experimentId) => {
        return state.platesInExperiment[experimentId] !== undefined
    }
}

const actions = {
    async loadByExperimentId(ctx, id) {
        if (ctx.getters['isExperimentLoaded'](id)) {
            return;
        }
        const plates = await plateAPI.getPlatesByExperimentId(id)
        ctx.commit('cachePlates', plates)
        ctx.commit('cachePlatesInExperiment', {experimentId: id, plates})
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
            if (!state.plates.find(it => it.id === plate.id)) {
                state.plates.push(plate)
            }
        });
    },
    cachePlatesInExperiment(state, args) {
        state.platesInExperiment[args.experimentId] = args.plates;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}