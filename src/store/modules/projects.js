import projectAPI from '@/api/projects.js'
import metadataAPI from '@/api/metadata.js'

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
        // Load project by id
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

        // Load all properties if any
        if (project && !project.properties) {
            metadataAPI.getObjectProperties(projectId, 'PROJECT')
                .then(result => {
                    ctx.commit('loadProperties', result);
                })
        }

        // Load all tags if any
        if (project && !project.tags) {
            metadataAPI.getObjectTags(projectId, 'PROJECT')
                .then(result => {
                    ctx.commit('loadTags', result);
                })
        }
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
    },
    async tagProject(ctx, tag) {
        await metadataAPI.addTag(tag)
            .then(isAdded => {
                isAdded ? ctx.commit('addTag', tag) : console.log("TODO: Show error message");
            });
    },
    async removeTag(ctx, tag) {
       await metadataAPI.removeTag(tag)
            .then(isDeleted => {
                isDeleted ? ctx.commit('removeTag', tag) : console.log("TODO: Show error message");
            })
    },
    async addProperty(ctx, property) {
        await metadataAPI.addProperty(property)
            .then(isAdded => {
                isAdded ? ctx.commit('addProperty', property) : console.log("TODO: Show error message");
            });
    },
    async removeProperty(ctx, property) {
        await metadataAPI.removeProperty(property)
            .then(isDeleted => {
                isDeleted ? ctx.commit('removeProperty', property) : console.log("TODO: Show error message");
            });
    }
}

const mutations = {
    loadProject(state, project) {
        state.currentProject = project;
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
    },
    loadTags(state, tags) {
        for (let i = 0; i < tags.length; i++) {
            if (!containsTag(state.currentProject, tags[i]))
                state.currentProject.tags !== undefined ? state.currentProject.tags.push(tags[i]) : state.currentProject.tags = [tags[i]];
        }
    },
    addTag(state, tag) {
        // var project = state.projects.find(project => project.id === tagInfo.objectId);
        if (!containsTag(state.currentProject, tag))
            state.currentProject.tags !== undefined ? state.currentProject.tags.push(tag) : state.currentProject.tags = [tag];
    },
    removeTag(state, tagInfo) {
        if (containsTag(state.currentProject, tagInfo)) {
            let i = state.currentProject.tags.findIndex(t => t.tag === tagInfo.tag);
            state.currentProject.tags.splice(i, 1);
        }
    },
    addProperty(state, propertyInfo) {
        if (!containsPropertyInfo(state.currentProject, propertyInfo)) {
            state.currentProject.properties !== undefined ? state.currentProject.properties.push(propertyInfo) : state.currentProject.properties = [propertyInfo];
        }
    },
    loadProperties(state, properties) {
        for (let i = 0; i < properties.length; i++) {
            if (!containsPropertyInfo(state.currentProject, properties[i])) {
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

function containsTag(project, tagInfo) {
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
