import projectAPI from '@/api/projects.js'

const state = () => ({
    projects: {}
})

const getters = {
    getById: (state) => (id) => {
        return state.projects[id];
    },
    isLoaded: (state) => (id) => {
        return state.projects[id] != null;
    }
}

const actions = {
    async loadById(ctx, id) {
        const project = await projectAPI.getProjectById(id)
        ctx.commit('cacheProject', project)
    }
}

const mutations = {
    cacheProject (state, project) {
        state.projects[project.id] = project
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}