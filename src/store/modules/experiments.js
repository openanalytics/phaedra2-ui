import experimentAPI from '@/api/experiments.js'

const state = () => ({
    experiments: []
})

const getters = {
    getByProjectId: (state) => (id) => {
        return state.experiments.filter(exp => exp.projectId == id);
    },
}

const actions = {
    async loadByProjectId(ctx, id) {
        const experiments = await experimentAPI.getExperimentsByProjectId(id)
        ctx.commit('cacheExperiments', experiments)
    }
}

const mutations = {
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