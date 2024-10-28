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
  const editProject = async (id, newVal) => {
    await projectAPI.editProject({ id: id, ...newVal });
  };

  const deleteProject = async (id) => {
    await projectAPI.deleteProject(id);
    await reset();
  };

  const deleteProjects = async (ids) => {
    await projectAPI.deleteProjects(ids);
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
  const createProjectAccess = async (id, newAccess) => {
    newAccess["projectId"] = id;
    await projectAPI.createProjectAccess(newAccess);
  };
  const deleteProjectAccess = async (access) => {
    await projectAPI.deleteProjectAccess(access.id);
  };
  const handleAddTag = async (id, newTag) => {
    await addTag(id, "PROJECT", newTag, null);
  };
  const handleDeleteTag = async (id, tag) => {
    await deleteTag(id, "PROJECT", tag, null);
  };
  const handleAddProperty = async (id, newProperty) => {
    await addProperty(id, "PROJECT", newProperty, null);
  };
  const handleDeleteProperty = async (id, property) => {
    await deleteProperty(id, "PROJECT", property, null);
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
    editProject,
    reloadProject,
  };
});
