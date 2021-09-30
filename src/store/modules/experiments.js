import experimentAPI from '@/api/experiments.js'

const state = () => ({
    experiments: [],
    recentExperiments: []
})

const getters = {
    getByProjectId: (state) => (id) => {
        return state.experiments.filter(exp => exp.projectId === id);
    },
    getById: (state) => (id) => {
        return state.experiments.find(exp => exp.id === id)
    },
    isLoaded: (state) => (id) => {
        return state.experiments.find(exp => exp.id === id)
    },
    getRecentExperiments: (state) => () => {
        return state.recentExperiments
    }
}

const actions = {
    loadByProjectId(ctx, id) {
        const experiments = experimentAPI.getExperimentsByProjectId(id)
        ctx.commit('cacheExperiments', experiments)
    },
    async loadById(ctx, id) {
        const experiment = await experimentAPI.getExperimentById(id)
        ctx.commit('cacheExperiment', experiment)
    },
    loadRecentExperiments(ctx) {
        const experiments = experimentAPI.getRecentExperiments()
        ctx.commit('cacheRecentExperiments', experiments)
    }
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
    },
    cacheRecentExperiments(state, recentExperiments) {
        recentExperiments.forEach(rexp => {
            let index = state.recentExperiments.indexOf(rexp)
            if (index === -1) state.recentExperiments.push(rexp)
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
