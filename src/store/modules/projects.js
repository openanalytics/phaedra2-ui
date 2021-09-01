import projectAPI from '@/api/projects.js'

const state = () => ({
    projects: []
})

const getters = {
    getById: (state) => (id) => {
        return state.projects.find(project => project.id == id)
    },
    getAll: (state) => () => {
        return state.projects
    },
    isLoaded: (state) => (id) => {
        return state.projects.find(project => project.id == id) != null
    }
}

const actions = {
    async loadById(ctx, id) {
        const project = await projectAPI.getProjectById(id)
        ctx.commit('cacheProject', project)
    },
    async loadAll(ctx) {
        const projects = await projectAPI.getAllProjects()
        ctx.commit('cacheAllProjects', projects)
    }
}

const mutations = {
    cacheProject (state, project) {
        let index = state.projects.indexOf(project)
        if (index === -1) state.projects.push(project)
    },
    cacheAllProjects (state, projects) {
        state.projects = projects;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}