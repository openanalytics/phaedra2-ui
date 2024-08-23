import { defineStore } from "pinia";
import projectsGraphQlAPI from "@/api/graphql/projects";
import projectAPI from "@/api/projects";
import experimentAPI from "@/api/experiments";
import metadataAPI from "@/api/metadata";
import { useUIStore } from "./ui";

export const useProjectStore = defineStore("project", {
  state: () => ({
    project: {},
  }),
  getters: {
    experiments: (state) => state.project.experiments,
    projectAccess: (state) => state.project.projectAccess,
  },
  actions: {
    loadProject(projectId) {
      const { onResult, onError } = projectsGraphQlAPI.projectById(projectId);
      onResult(({ data }) => {
        this.project = data.project;
        this.project["experiments"] = data.experiments;
        this.project["projectAccess"] = data.projectAccess;
        const uiStore = useUIStore();
        uiStore.selectedProject = this.project;
      });
    },
    isLoaded(projectId) {
      return this.project.id === `${projectId}`;
    },
    async createNewProject(newProject) {
      const createdProject = await projectAPI.createNewProject(newProject);
      this.project = createdProject;

      await this.createProjectAccess({
        projectId: createdProject.id,
        teamName: newProject.adminTeam,
        accessLevel: "Admin",
      });
    },
    async renameProject(newName) {
      await projectAPI.editProject({ id: this.project.id, name: newName });
      this.loadProject(this.project.id);
    },
    async editProjectDescription(newDescription) {
      await projectAPI.editProject({
        id: this.project.id,
        description: newDescription,
      });
      this.loadProject(this.project.id);
    },
    async deleteProject() {
      await projectAPI.deleteProject(this.project.id);
      this.reset();
    },
    async addExperiment(experiment) {
      experiment["projectId"] = this.project.id;
      await experimentAPI.createExperiment(experiment);
      this.loadProject(this.project.id);
    },
    async openExperiment(experimentId) {
      await experimentAPI.editExperiment({ id: experimentId, status: "OPEN" });
      this.loadProject(this.project.id);
    },
    async closeExperiment(experimentId) {
      await experimentAPI.editExperiment({
        id: experimentId,
        status: "CLOSED",
      });
      this.loadProject(this.project.id);
    },
    async deleteExperiment(experimentId) {
      await experimentAPI.deleteExperiment(experimentId);
      this.loadProject(this.project.id);
    },
    async createProjectAccess(newAccess) {
      newAccess["projectId"] = this.project.id;
      await projectAPI.createProjectAccess(newAccess);
      this.loadProject(this.project.id);
    },
    async deleteProjectAccess(access) {
      await projectAPI.deleteProjectAccess(access.id);
      this.loadProject(this.project.id);
    },
    async addTag(newTag) {
      await metadataAPI.addTag({
        objectId: this.project.id,
        objectClass: "PROJECT",
        tag: newTag,
      });
      this.loadProject(this.project.id);
    },
    async deleteTag(tag) {
      await metadataAPI.removeTag({
        objectId: this.project.id,
        objectClass: "PROJECT",
        tag: tag,
      });
      this.loadProject(this.project.id);
    },
    async addPropertty(newProperty) {
      await metadataAPI.addProperty({
        objectId: this.project.id,
        objectClass: "PROJECT",
        propertyName: newProperty.name,
        propertyValue: newProperty.value,
      });
      this.loadProject(this.project.id);
    },
    async deleteProperty(property) {
      await metadataAPI.removeProperty({
        objectId: this.project.id,
        objectClass: "PROJECT",
        propertyName: property.propertyName,
      });
      this.loadProject(this.project.id);
    },
    reset() {
      this.project = {};
    },
  },
});
