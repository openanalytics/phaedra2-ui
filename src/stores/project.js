import { defineStore } from "pinia"
import projectsGraphQlAPI from "@/api/graphql/projects"
import projectAPI from "@/api/projects";
import experimentAPI from "@/api/experiments";

export const useProjectStore = defineStore("project" , {
    state: () => ({
        project: {},
        experiments: [],
        projectAccess: []
    }),
    actions: {
        async loadProject(projectId) {
            // if (!this.isLoaded(projectId)) {
                console.log("ProjectStore: current project has different projectId!")
                const {onResult, onError} = projectsGraphQlAPI.projectById(projectId)

                onResult(({data}) => {
                    this.project = data.project
                    this.experiments = data.experiments
                    this.projectAccess = data.projectAccess
                })
            // }
        },
        isLoaded(projectId) {
            return this.project.id === `${projectId}`
        },
        async createNewProject(newProject) {
            const createdProject = await projectAPI.createNewProject(newProject)
            this.project = createdProject

            await this.createProjectAccess({ projectId: createdProject.id, teamName: newProject.adminTeam, accessLevel: "Admin" })
        },
        async renameProject(newName) {
            await projectAPI.editProject({ id: this.project.id, name: newName })
            this.project.name = newName
        },
        async editProjectDescription(newDescription) {
            await projectAPI.editProject({id: this.project.id, description: newDescription})
            this.project.description = newDescription
        },
        async deleteProject() {
            await projectAPI.deleteProject(this.project.id)
        },
        async addExperiment(experiment) {
            experiment['projectId'] = this.project.id
            const createdExperiment = await experimentAPI.createExperiment(experiment);
            this.experiments.push(createdExperiment)
        },
        async openExperiment(experimentId) {
            await experimentAPI.editExperiment({ id: experimentId, status: 'OPEN' })
            const index = this.experiments.findIndex((e) => {
                return e.id === experimentId
            })
            this.experiments[index].status = 'OPEN'
        },
        async closeExperiment(experimentId) {
            await experimentAPI.editExperiment({ id: experimentId, status: 'CLOSED' })
            const index = this.experiments.findIndex((e) => {
                return e.id === experimentId
            })
            this.experiments[index].status = 'CLOSED'
        },
        async deleteExperiment(experimentId) {
            await experimentAPI.deleteExperiment(experimentId);
            const index = this.experiments.findIndex((e) => {
                return e.id === experimentId
            })
            this.experiments.splice(index, 1)
        },
        async createProjectAccess(newAccess) {
            newAccess['projectId'] = this.project.id;
            const response = await projectAPI.createProjectAccess(newAccess)
            this.projectAccess.push(response)
        },
        async deleteProjectAccess(access) {
            await projectAPI.deleteProjectAccess(access.id);
            const index = this.projectAccess.findIndex((pa) => {
                return pa.id === access.id
            })
            this.projectAccess.splice(index, 1)
        },
    }
})
