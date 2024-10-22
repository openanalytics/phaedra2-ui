import { defineStore } from "pinia";
import projectsGraphQlAPI from "@/api/graphql/projects";
import projectAPI from "@/api/projects";
import experimentAPI from "@/api/experiments";
import {
  addTag,
  deleteTag,
  addProperty,
  deleteProperty,
} from "@/lib/MetadataUtils";
import { ref } from "vue";

export const useProjectStore = defineStore("project", () => {
  const project = ref({});
  const experiments = ref([]);
  const projectAccess = ref([]);

  const loadProject = async (projectId) => {
    const { onResult, onError } = projectsGraphQlAPI.projectById(projectId);
    onResult(({ data }) => {
      project.value = data.project;
      experiments.value = data.experiments;
      projectAccess.value = data.projectAccess;
    });
  };

  const reloadProject = async () => {
    await loadProject(project.value.id);
  };

  const isLoaded = (projectId) => {
    return project.value.id === `${projectId}`;
  };

  const createNewProject = async (newProject) => {
    const createdProject = await projectAPI.createNewProject(newProject);
    project.value = createdProject;

    await createProjectAccess({
      projectId: createdProject.id,
      teamName: newProject.adminTeam,
      accessLevel: "Admin",
    });
  };
  const renameProject = async (newName) => {
    await projectAPI.editProject({ id: project.value.id, name: newName });
    await reloadProject();
  };
  const editProjectDescription = async (newDescription) => {
    await projectAPI.editProject({
      id: project.value.id,
      description: newDescription,
    });
    await reloadProject();
  };
  const deleteProject = async () => {
    await projectAPI.deleteProject(project.value.id);
    await reset();
  };
  const deleteProjects = async (projectsId) => {
    await projectAPI.deleteProjects(projectsId);
    await reset();
  };
  const addExperiment = async (experiment) => {
    experiment["projectId"] = project.value.id;
    await experimentAPI.createExperiment(experiment);
    await reloadProject();
  };
  const openExperiment = async (experimentId) => {
    await experimentAPI.editExperiment({ id: experimentId, status: "OPEN" });
    await reloadProject();
  };
  const closeExperiment = async (experimentId) => {
    await experimentAPI.editExperiment({ id: experimentId, status: "CLOSED" });
    await reloadProject();
  };
  const deleteExperiment = async (experimentId) => {
    await experimentAPI.deleteExperiment(experimentId);
    await reloadProject();
  };
  const createProjectAccess = async (newAccess) => {
    newAccess["projectId"] = project.value.id;
    await projectAPI.createProjectAccess(newAccess);
    await reloadProject();
  };
  const deleteProjectAccess = async (access) => {
    await projectAPI.deleteProjectAccess(access.id);
    await reloadProject();
  };
  const handleAddTag = async (newTag) => {
    await addTag(project.value.id, "PROJECT", newTag, reloadProject);
  };
  const handleDeleteTag = async (tag) => {
    await deleteTag(project.value.id, "PROJECT", tag, reloadProject);
  };
  const handleAddProperty = async (newProperty) => {
    await addProperty(project.value.id, "PROJECT", newProperty, reloadProject);
  };
  const handleDeleteProperty = async (property) => {
    await deleteProperty(project.value.id, "PROJECT", property, reloadProject);
  };
  const reset = () => {
    project.value = {};
  };

  return {
    project,
    experiments,
    projectAccess,
    loadProject,
    isLoaded,
    createNewProject,
    renameProject,
    editProjectDescription,
    deleteProject,
    deleteProjects,
    addExperiment,
    closeExperiment,
    deleteExperiment,
    createProjectAccess,
    deleteProjectAccess,
    handleAddTag,
    handleDeleteTag,
    handleAddProperty,
    handleDeleteProperty,
    reset,
  };
});
