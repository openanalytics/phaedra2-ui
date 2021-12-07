import projectAPI from '@/api/projects.js'
import axios from "axios";

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
    getNRecentProjects: (state) => () => {
        return state.recentProjects
    }
}

const actions = {
    async loadById(ctx, id) {
        await projectAPI.getProjectById(id)
            .then(response => {
                ctx.commit('cacheProject', response)
            })
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
    async loadProjectsTags(ctx, projectId) {
        await axios.get('http://localhost:6020/phaedra/metadata-service/tagged_objects/PROJECT',
            {params: {objectId: projectId}})
            .then(response => {
                ctx.commit('addTags', response.data)
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
        ctx.commit('updateProject', args)
    },
    tagProject(ctx, tagInfo) {
        axios.post('http://localhost:6020/phaedra/metadata-service/tags', tagInfo)
            .then(response => {
                if (response.status === 201) {
                    ctx.commit('addTag', tagInfo);
                }
                console.log(response)
            })
    },
    removeTag(ctx, projectTag) {
        axios.delete('http://localhost:6020/phaedra/metadata-service/tags', { data : projectTag })
            .then(response => {
                if (response.status === 200) {
                    ctx.commit('removeTag', projectTag);
                }
                console.log(response)
            })
    },
    addProperty(ctx, propertyInfo) {
        axios.post('http://localhost:6020/phaedra/metadata-service/properties', propertyInfo)
            .then(response => {
                if (response.status === 201) {
                    ctx.commit('addProperty', propertyInfo);
                }
                console.log(response)
            })
    }
}

const mutations = {
    cacheProject(state, project) {
        state.currentProject = project;
        if (!containsProject(state,project)) state.projects.push(project)
    },

    uncacheProject(state, projectId) {
        let match = state.projects.find(p => p.id === projectId)
        if (match) state.projects.splice(state.projects.indexOf(match), 1)
    },
    updateProject(state, args) {
        let project = state.projects.find(p => p.id === args.id)
        if (project) {
            project.name = args.name
            state.currentProject = project
        }
    },
    cacheAllProjects(state, projects) {
        state.projects = projects;
    },
    cacheNRecentProjects(state, payload) {
        state.recentProjects = payload.projects
        state.recentProjects = state.recentProjects.sort((p1, p2) => {
            let p1Time = new Date(p1.createdOn).getTime()
            let p2Time = new Date(p2.createdOn).getTime()
            return p1Time - p2Time;
        }).slice(0, payload.n)
    },
    addTags(state, tags) {
        for (let i = 0; i < tags.length; i++) {
            // var project = state.projects.find(project => project.id === tags[i].objectId);
            if (!containsTagInfo(state.currentProject, tags[i]))
                state.currentProject.tags !== undefined ? state.currentProject.tags.push(tags[i]) : state.currentProject.tags = [ tags[i] ];
        }
    },
    addTag(state, tagInfo) {
        // var project = state.projects.find(project => project.id === tagInfo.objectId);
        if (!containsTagInfo(state.currentProject, tagInfo))
            state.currentProject.tags !== undefined ? state.currentProject.tags.push(tagInfo) : state.currentProject.tags = [ tagInfo ];
    },
    removeTag(state, tagInfo) {
        // var project = state.projects.find(project => project.id === tagInfo.objectId)
        if (containsTagInfo(state.currentProject, tagInfo)) {
            let i = state.currentProject.tags.findIndex(t => t.tag === tagInfo.tag);
            state.currentProject.tags.splice(i, 1);
        }
    },
    addProperty(state, propertyInfo) {
        if (!containsPropertyInfo(state.currentProject, propertyInfo)) {
            state.currentProject.properties !== undefined ? state.currentProject.properties.push(propertyInfo) : state.currentProject.properties = [ propertyInfo ];
        }
    },
    addProperties(state, properties) {
        for (let i = 0; i < properties.length; i++) {
            if (!containsPropertyInfo(state.currentPorject, properties[i])) {
                state.currentProject.properties !== undefined ? state.currentProject.properties.push(properties[i]) : state.currentProject.properties = [ properties[i] ];
            }
        }
    },
    removeProperty(state, propertyInfo) {
        if (containsPropertyInfo(state.currentProject, propertyInfo)) {
            let i = state.currentProject.properties.findIndex(p => p.propertyName === propertyInfo.propertyName);
            state.currentProject.properties.splice(i, 1);
        }
    }
}

// function containsProject(state, project) {
//     for (var i = 0; i < state.projects.length; i++) {
//         if (state.projects[i].id === project.id) {
//             return true;
//         }
//     }
//     return false;
// }

function containsProject(state,project) {
    return state.projects !== undefined
        && state.projects.findIndex(t => t.id === project.id) > -1;
}

function containsTagInfo(project, tagInfo) {
    return project.tags !== undefined
        && project.tags.findIndex(t => t.tag === tagInfo.tag) > -1;
}

function containsPropertyInfo(project, propertyInfo) {
    return project.properties !== undefined
        && project.properties.findIndex(p => p.propertyName === propertyInfo.propertyName) > -1;
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
