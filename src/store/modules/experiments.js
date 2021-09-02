import experimentAPI from '@/api/experiments.js'

const state = () => ({
    experiments: []
})

const getters = {
    getByProjectId: (state) => (id) => {
        return state.experiments.filter(exp => exp.projectId == id);
    },
    getById: (state) => (id) => {
        return state.experiments.find(exp => exp.id == id)
    },
    isLoaded: (state) => (id) => {
        return state.experiments.find(exp => exp.id == id) != null
    }
}

const actions = {
    async loadByProjectId(ctx, id) {
        const experiments = await experimentAPI.getExperimentsByProjectId(id)
        ctx.commit('cacheExperiments', experiments)
    },
    async loadById(ctx, id) {
        const experiment = await experimentAPI.getExperimentById(id)
        ctx.commit('cacheExperiment', experiment)
    },
}

const mutations = {
    cacheExperiment (state, experiment) {
        let index = state.experiments.indexOf(experiment)
        if (index === -1) state.experiments.push(experiment)
    },
    cacheExperiments(state, experiments) {
        experiments.forEach(exp => {
            let index = state.experiments.indexOf(exp)
            if (index === -1) state.experiments.push(exp)
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