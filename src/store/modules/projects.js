import axios from "axios";

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
        return state.recentProjects.sort((p1, p2) => {
            let p1Time = new Date(p1.createdOn).getTime()
            let p2Time = new Date(p2.createdOn).getTime()
            return p1Time - p2Time;
        }).slice(0, n)
    }
}

const actions = {
    async loadById(ctx, id) {
        await axios.get('http://localhost:6010/phaedra/plate-service/project/' + id)
            .then(response => {
                ctx.commit('cacheProject', response.data)
            })
    },
    async loadAll(ctx) {
        await axios.get('http://localhost:6010/phaedra/plate-service/projects')
            .then(response => {
                ctx.commit('cacheAllProjects', response.data)
            })
    },
    async loadRecentProjects(ctx) {
        await axios.get('http://localhost:6010/phaedra/plate-service/projects')
            .then(response => {
                ctx.commit('cacheNRecentProjects', response.data)
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
        const response = await axios.post('http://localhost:6010/phaedra/plate-service/project', newProject)
        const createdProject = response.data
        ctx.commit('cacheProject', createdProject)
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
        state.recentProjects = projects
    },
    addTags(state, tags) {
        for (let i = 0; i < tags.length; i++) {
            // var project = state.projects.find(project => project.id === tags[i].objectId);
            if (!containsTagInfo(state.currentPorject, tags[i]))
                state.currentPorject.tags !== undefined ? state.currentPorject.tags.push(tags[i]) : state.currentPorject.tags = [ tags[i] ];
        }
    },
    addTag(state, tagInfo) {
        // var project = state.projects.find(project => project.id === tagInfo.objectId);
        if (!containsTagInfo(state.currentPorject, tagInfo))
            state.currentPorject.tags !== undefined ? state.currentPorject.tags.push(tagInfo) : state.currentPorject.tags = [ tagInfo ];
    },
    removeTag(state, tagInfo) {
        // var project = state.projects.find(project => project.id === tagInfo.objectId)
        if (containsTagInfo(state.currentPorject, tagInfo)) {
            let i = state.currentPorject.tags.findIndex(t => t.tag === tagInfo.tag);
            state.currentPorject.tags.splice(i, 1);
        }
    },
    addProperty(state, propertyInfo) {
        if (!containsPropertyInfo(state.currentPorject, propertyInfo)) {
            state.currentPorject.properties !== undefined ? state.currentPorject.properties.push(propertyInfo) : state.currentPorject.properties = [ propertyInfo ];
        }
    },
    addProperties(state, properties) {
        for (let i = 0; i < properties.length; i++) {
            if (!containsPropertyInfo(state.currentPorject, properties[i])) {
                state.currentPorject.properties !== undefined ? state.currentPorject.properties.push(properties[i]) : state.currentPorject.properties = [ properties[i] ];
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

// function containsProject(state, project) {
//     for (var i = 0; i < state.projects.length; i++) {
//         if (state.projects[i].id === project.id) {
//             return true;
//         }
//     }
//     return false;
// }

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
