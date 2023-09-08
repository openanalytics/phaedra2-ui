import { defineStore } from "pinia"
import projectsGraphQlAPI from "@/api/graphql/projects"
import projectAPI from "@/api/projects";
import experimentAPI from "@/api/experiments";

export const useProjectStore = defineStore("project" , {
    state: () => ({
        project: {},
        experiments: []
    }),
    actions: {
        loadProject(projectId) {
            console.log("Execute projectsGraphQlAPI.projectById(projectId)")
            const {project, experiments} = projectsGraphQlAPI.projectById(projectId)
            console.log("Result of  projectsGraphQlAPI.projectById(projectId)" + JSON.stringify(project.value))
            console.log("Result of  projectsGraphQlAPI.projectById(projectId)" + JSON.stringify(experiments.value))
            this.project = project
            this.experiments = experiments
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
            this.project = {}
        },
        async addExperiment(experiment) {
            experiment['projectId'] = this.project.id
            const createdExperiment = await experimentAPI.createExperiment(experiment);
            this.experiments.push(createdExperiment)
        },
        async createNewProject(newProject) {
            const createdProject = await projectAPI.createNewProject(newProject)
            this.project = createdProject
        },
        async deleteExperiment(experimentId) {
            await experimentAPI.deleteExperiment(experimentId);
            const index = this.experiments.findIndex((e) => {
                return e.id === experimentId
            })
            this.experiments.splice(index, 1)
        }
    }
})
