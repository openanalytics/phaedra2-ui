import projectAPI from '@/api/projects.js'
import projectsGraphQlAPI from '@/api/graphql/projects.js'

const state = () => ({
    // currentProject: {},
    // projects: [],
    // projectAccess: {},
})

const getters = {
    // getById: (state) => (id) => {
    //     return state.projects.find(project => project.id === id)
    // },
    // getProjectAccess: (state) => (id) => {
    //     return state.projectAccess[id];
    // },
    // getCurrentProject: (state) => () => {
    //     return state.currentProject;
    // },
    // getAll: (state) => () => {
    //     return state.projects
    // },
    // // isLoaded: (state) => (id) => {
    // //     return state.projects.find(project => project.id === id)
    // // },
    // getRecentProjects: (state) => (n) => {
    //     return [...state.projects].sort((p1, p2) => p2.createdOn.localeCompare(p1.createdOn)).slice(0, n);
    // }
}

const actions = {
    // async loadById(ctx, projectId) {
    //     let project = ctx.getters.getById(projectId);
    //     if (project) {
    //         ctx.commit('loadProject', project)
    //     } else {
    //         try {
    //             project = projectsGraphQlAPI.projectById(projectId)
    //             ctx.commit('loadProject', project)
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }
    //
    //     ctx.dispatch('loadProjectAccess', projectId);
    //     ctx.dispatch('metadata/loadMetadata', { objectId: projectId, objectClass: 'PROJECT' }, {root:true});
    // },
    // async loadProjectAccess(ctx, projectId) {
    //     const response = await projectAPI.getProjectAccess(projectId);
    //     ctx.commit('cacheProjectAccess', { id: projectId, projectAccess: response });
    // },
    // async createProjectAccess(ctx, projectAccess) {
    //     const response = await projectAPI.createProjectAccess(projectAccess);
    //     ctx.commit('cacheProjectAccess', { id: projectAccess.projectId, projectAccess: response });
    // },
    // async deleteProjectAccess(ctx, projectAccessId) {
    //     await projectAPI.deleteProjectAccess(projectAccessId);
    //     ctx.commit('uncacheProjectAccess', projectAccessId);
    // },
    // async loadAll(ctx) {
    //     const projects = await projectAPI.getAllProjects();
    //     ctx.commit('cacheAllProjects', projects);
    //
    //     const projectIds = projects.map(p => p.id);
    //     ctx.dispatch('metadata/loadMetadata', { objectId: projectIds, objectClass: 'PROJECT' }, {root:true});
    // },
    // async createNewProject(ctx, newProject) {
    //     const createdProject = await projectAPI.createNewProject(newProject);
    //     ctx.commit('cacheProject', createdProject);
    //
    //     ctx.dispatch('createProjectAccess', {
    //         projectId: createdProject.id,
    //         teamName: newProject.adminTeam,
    //         accessLevel: "Admin"
    //     });
    //
    //     return createdProject;
    // },
    // async deleteProject(ctx, projectId) {
    //     await projectAPI.deleteProject(projectId)
    //         .then(() => {
    //             ctx.commit('uncacheProject', projectId)
    //         })
    // },
    // async renameProject(ctx, args) {
    //     await projectAPI.editProject(args)
    //     ctx.commit('updateProjectName', args)
    // },
    // async editProjectDescription(ctx, args) {
    //     await projectAPI.editProject(args)
    //     ctx.commit('updateProjectDescription', args)
    // }
}

const mutations = {
    // loadProject(state, project) {
    //     state.currentProject = project;
    //     if (!containsProject(state,project)) state.projects.push(project)
    // },
    // cacheProject(state, project) {
    //     if(!containsProject(state,project)){
    //         state.projects.push(project)
    //     }
    // },
    // cacheProjectAccess(state, args) {
    //     if (args.projectAccess.id) {
    //         // Add a single projectAccess entry for a project
    //         if (!state.projectAccess[args.id]) {
    //             state.projectAccess[args.id] = [];
    //         }
    //         state.projectAccess[args.id].push(args.projectAccess);
    //     } else {
    //         // Cache an entire projectAccess array for a project
    //         state.projectAccess[args.id] = args.projectAccess;
    //     }
    // },
    // uncacheProjectAccess(state, projectAccessId) {
    //     for (let projectId of Object.keys(state.projectAccess)) {
    //         let index = state.projectAccess[projectId].findIndex(pa => pa.id === projectAccessId);
    //         if (index >= 0) state.projectAccess[projectId].splice(index, 1);
    //     }
    // },
    // uncacheProject(state, projectId) {
    //     let match = state.projects.find(p => p.id === projectId)
    //     if (match) state.projects.splice(state.projects.indexOf(match), 1)
    // },
    // updateProjectName(state, args) {
    //     let project = state.projects.find(p => p.id === args.id)
    //     if (project) {
    //         project.name = args.name
    //         state.currentProject = project
    //     }
    // },
    // updateProjectDescription(state, args) {
    //     let project = state.projects.find(p => p.id === args.id)
    //     if (project) {
    //         project.description = args.description
    //         state.currentProject = project
    //     }
    // },
    // cacheAllProjects(state, projects) {
    //     state.projects = projects;
    // },
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
