import projectAPI from '@/api/projects.js'

const state = () => ({
    projects: [],
    recentProjects: []
})

const getters = {
    getById: (state) => (id) => {
        return state.projects.find(project => project.id === id)
    },
    getAll: (state) => () => {
        return state.projects
    },
    isLoaded: (state) => (id) => {
        return state.projects.find(project => project.id === id)
    },
    getRecentProjects: (state) => () => {
        return state.recentProjects
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
    },
    loadRecentProjects(ctx) {
        const projects = projectAPI.getNRecentProjects(3)
        ctx.commit('cacheNRecentProjects', projects)
    }
}

const mutations = {
    cacheProject(state, project) {
        let index = state.projects.indexOf(project)
        if (index === -1) state.projects.push(project)
    },
    cacheAllProjects(state, projects) {
        state.projects = projects;
    },
    cacheNRecentProjects(state, projects) {
        state.recentProjects = projects
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
