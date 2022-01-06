import projectAPI from '@/api/projects.js'

const state = () => ({
    currentProject: {},
    projects: [],
    recentProjects: []
})

const getters = {
    getById: (state) => (id) => {
        return state.projects.find(project => project.id === id)
    },
    getCurrentProject: (state) => () => {
        return state.currentProject;
    },
    getAll: (state) => () => {
        return state.projects
    },
    isLoaded: (state) => (id) => {
        return state.projects.find(project => project.id === id)
    },
    getNRecentProjects: (state) => (n) => {
        return state.recentProjects.slice(0, n)
    }
}

const actions = {
    async loadById(ctx, projectId) {
        let project = ctx.getters.getById(projectId);
        if (project) {
            ctx.commit('loadProject', project)
        } else {
            try {
                project = await projectAPI.getProjectById(projectId);
                ctx.commit('loadProject', project)
            } catch (err) {
                console.error(err);
            }
        }

        ctx.dispatch('metadata/loadMetadata', { objectId: projectId, objectClass: 'PROJECT' }, {root:true});
    },
    async loadAll(ctx) {
        await projectAPI.getAllProjects()
            .then(response => {
                ctx.commit('cacheAllProjects', response)
            })
    },
    async loadRecentProjects(ctx, n) {
        await projectAPI.loadRecentProjects()
            .then(response => {
                ctx.commit('cacheNRecentProjects', {projects: response,n: n})
            })
    },
    async createNewProject(ctx, newProject) {
        await projectAPI.createNewProject(newProject)
            .then((response) => {
                ctx.commit('cacheProject', response)
                return response
            })
    },
    async deleteProject(ctx, projectId) {
        await projectAPI.deleteProject(projectId)
            .then(() => {
                ctx.commit('uncacheProject', projectId)
            })
    },
    async renameProject(ctx, args) {
        await projectAPI.editProject(args)
        ctx.commit('updateProjectName', args)
    },
    async editProjectDescription(ctx, args) {
        await projectAPI.editProject(args)
        ctx.commit('updateProjectDescription', args)
    }
}

const mutations = {
    loadProject(state, project) {
        state.currentProject = project;
    },
    cacheProject(state, project) {
        if(!containsProject(state,project)){
            state.projects.push(project)
        }
    },
    uncacheProject(state, projectId) {
        let match = state.projects.find(p => p.id === projectId)
        if (match) state.projects.splice(state.projects.indexOf(match), 1)
    },
    updateProjectName(state, args) {
        let project = state.projects.find(p => p.id === args.id)
        if (project) {
            project.name = args.name
            state.currentProject = project
        }
    },
    updateProjectDescription(state, args) {
        let project = state.projects.find(p => p.id === args.id)
        if (project) {
            project.description = args.description
            state.currentProject = project
        }
    },
    cacheAllProjects(state, projects) {
        state.projects = projects;
    },
    cacheNRecentProjects(state, payload) {
        state.recentProjects = payload.projects
        state.recentProjects = state.recentProjects.sort((p1, p2) => {
            let p1Time = new Date((p1.updatedOn)?p1.updatedOn:p1.createdOn).getTime()
            let p2Time = new Date((p2.updatedOn)?p2.updatedOn:p2.createdOn).getTime()
            return  p2Time - p1Time;
        })
    }
}

function containsProject(state, project) {
    return state.projects !== undefined
        && state.projects.findIndex(t => t.id === project.id) > -1;
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
