import axios from "axios";
import metadataAPI from '@/api/metadata.js'

const state = () => ({
    currentPorject: {},
    projects: [],
    recentProjects: []
})

const getters = {
    getById: (state) => (id) => {
        return state.projects.find(project => project.id === id)
    },
    getCurrentProject: (state) => () => {
        return state.currentPorject;
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
    loadById(ctx, projectId) {
        // Load project by id
        axios.get('http://localhost:6010/phaedra/plate-service/project/' + projectId)
            .then(response => {
                ctx.commit('loadProject', response.data)
            })

        // Load all properties if any
        metadataAPI.getObjectProperties(projectId, 'PROJECT')
            .then(result => {
                ctx.commit('loadProperties', result);
            })

        // Load all tags if any
        metadataAPI.getObjectTags(projectId, 'PROJECT')
            .then(result => {
                ctx.commit('loadTags', result);
            })
    },
    loadAll(ctx) {
        axios.get('http://localhost:6010/phaedra/plate-service/projects')
            .then(response => {
                ctx.commit('cacheAllProjects', response.data)
            })
    },
    loadRecentProjects(ctx) {
        axios.get('http://localhost:6010/phaedra/plate-service/projects')
            .then(response => {
                ctx.commit('cacheNRecentProjects', response.data)
            })
    },
    async createNewProject(ctx, newProject) {
        const response = await axios.post('http://localhost:6010/phaedra/plate-service/project', newProject)
        const createdProject = response.data
        ctx.commit('loadProject', createdProject)
        return createdProject
    },
    async deleteProject(ctx, projectId) {
        await axios.delete('http://localhost:6010/phaedra/plate-service/project/' + projectId)
            .then(() => {
                ctx.commit('uncacheProject', projectId)
            })
    },
    async renameProject(ctx, args) {
        await axios.put('http://localhost:6010/phaedra/plate-service/project', args)
        ctx.commit('updateProject', args)
    },
    tagProject(ctx, tag) {
        metadataAPI.addTag(tag)
            .then(result => {
                const isCreated = result;
                isCreated ? ctx.commit('addTag', tag) : console.log("TODO: Show error message");
            })
    },
    removeTag(ctx, tag) {
        metadataAPI.removeTag(tag)
            .then(result => {
                const isDeleted = result;
                isDeleted ? ctx.commit('removeTag', tag) : console.log("TODO: Show error message");
            });
    },
    addProperty(ctx, property) {
        axios.post('http://localhost:6020/phaedra/metadata-service/property', property)
            .then(response => {
                if (response.status === 201) {
                    ctx.commit('addProperty', property);
                }
                console.log(response)
            })
    },
    removeProperty(ctx, property) {
        metadataAPI.removeProperty(property)
            .then(result => {
                const isDeleted = result;
                isDeleted ? ctx.commit('removeProperty', property) : console.log("TODO: Show error message");
            });
    }
}

const mutations = {
    loadProject(state, project) {
        state.currentPorject = project;
        // if (!containsProject(state, project))
        //     state.projects.push(project)
    },
    uncacheProject(state, projectId) {
        let match = state.projects.find(p => p.id === projectId)
        if (match) state.projects.splice(state.projects.indexOf(match), 1)
    },
    updateProject(state, args) {
        let project = state.projects.find(p => p.id === args.id)
        if (project) project.name = args.name
    },
    cacheAllProjects(state, projects) {
        state.projects = projects;
    },
    cacheNRecentProjects(state, projects) {
        state.recentProjects = projects.sort((p1, p2) => {
            let p1Time = new Date(p1.createdOn).getTime()
            let p2Time = new Date(p2.createdOn).getTime()
            return p1Time - p2Time;
        });
    },
    loadTags(state, tags) {
        for (let i = 0; i < tags.length; i++) {
            if (!containsTag(state.currentPorject, tags[i]))
                state.currentPorject.tags !== undefined ? state.currentPorject.tags.push(tags[i]) : state.currentPorject.tags = [tags[i]];
        }
    },
    addTag(state, tag) {
        // var project = state.projects.find(project => project.id === tagInfo.objectId);
        if (!containsTag(state.currentPorject, tag))
            state.currentPorject.tags !== undefined ? state.currentPorject.tags.push(tag) : state.currentPorject.tags = [tag];
    },
    removeTag(state, tagInfo) {
        if (containsTag(state.currentPorject, tagInfo)) {
            let i = state.currentPorject.tags.findIndex(t => t.tag === tagInfo.tag);
            state.currentPorject.tags.splice(i, 1);
        }
    },
    addProperty(state, propertyInfo) {
        if (!containsPropertyInfo(state.currentPorject, propertyInfo)) {
            state.currentPorject.properties !== undefined ? state.currentPorject.properties.push(propertyInfo) : state.currentPorject.properties = [propertyInfo];
        }
    },
    loadProperties(state, properties) {
        for (let i = 0; i < properties.length; i++) {
            if (!containsPropertyInfo(state.currentPorject, properties[i])) {
                state.currentPorject.properties !== undefined ? state.currentPorject.properties.push(properties[i]) : state.currentPorject.properties = [properties[i]];
            }
        }
    },
    removeProperty(state, propertyInfo) {
        if (containsPropertyInfo(state.currentPorject, propertyInfo)) {
            let i = state.currentPorject.properties.findIndex(p => p.propertyName === propertyInfo.propertyName);
            state.currentPorject.properties.splice(i, 1);
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
