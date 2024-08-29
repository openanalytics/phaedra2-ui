import {defineStore} from "pinia"
import projectsGraphQlAPI from "@/api/graphql/projects"
import projectAPI from "@/api/projects";
import experimentAPI from "@/api/experiments";
import metadataAPI from "@/api/metadata";
import {computed, ref} from "vue";

export const useProjectStore = defineStore("project", () => {
  const project = ref({})
  const experiments = computed(() => project.value.experiments ?? [])
  const projectAccess = computed(() => project.value.projectAccess ?? [])

  const loadProject = (projectId) => {
    const {onResult, onError} = projectsGraphQlAPI.projectById(projectId)
    onResult(({data}) => {
      project.value = data.project
      project.value["experiments"] = data.experiments
      project.value["projectAccess"] = data.projectAccess
    })
  }
  const isLoaded = (projectId) => {
    return project.value.id === `${projectId}`
  }
  const createNewProject = async (newProject) => {
    const createdProject = await projectAPI.createNewProject(newProject)
    project.value = createdProject

    await createProjectAccess({
      projectId: createdProject.id,
      teamName: newProject.adminTeam,
      accessLevel: "Admin"
    })
  }
  const renameProject = async (newName) => {
    await projectAPI.editProject({id: project.value.id, name: newName})
    loadProject(project.value.id)
  }
  const editProjectDescription = async (newDescription) => {
    await projectAPI.editProject(
        {id: project.value.id, description: newDescription})
    loadProject(project.value.id)
  }
  const deleteProject = async () => {
    await projectAPI.deleteProject(project.value.id)
    await reset()
  }
  const addExperiment = async (experiment) => {
    experiment['projectId'] = project.value.id
    await experimentAPI.createExperiment(experiment);
    loadProject(project.value.id)
  }
  const openExperiment = async (experimentId) => {
    await experimentAPI.editExperiment({id: experimentId, status: 'OPEN'})
    loadProject(project.value.id)
  }
  const closeExperiment = async (experimentId) => {
    await experimentAPI.editExperiment({id: experimentId, status: 'CLOSED'})
    loadProject(project.value.id)
  }
  const deleteExperiment = async (experimentId) => {
    await experimentAPI.deleteExperiment(experimentId);
    loadProject(project.value.id)
  }
  const createProjectAccess = async (newAccess) => {
    newAccess['projectId'] = project.value.id;
    await projectAPI.createProjectAccess(newAccess)
    loadProject(project.value.id)
  }
  const deleteProjectAccess = async (access) => {
    await projectAPI.deleteProjectAccess(access.id);
    loadProject(project.value.id)
  }
  const addTag = async (newTag) => {
    await metadataAPI.addTag(
        {'objectId': project.value.id, 'objectClass': 'PROJECT', 'tag': newTag})
    loadProject(project.value.id)
  }
  const deleteTag = async (tag) => {
    await metadataAPI.removeTag(
        {'objectId': project.value.id, 'objectClass': 'PROJECT', 'tag': tag})
    loadProject(project.value.id)
  }
  const addPropertty = async (newProperty) => {
    await metadataAPI.addProperty({
      objectId: project.value.id,
      objectClass: 'PROJECT',
      propertyName: newProperty.name,
      propertyValue: newProperty.value
    })
    loadProject(project.value.id)
  }
  const deleteProperty = async (property) => {
    await metadataAPI.removeProperty({
      objectId: project.value.id,
      objectClass: 'PROJECT',
      propertyName: property.propertyName
    })
    loadProject(project.value.id)
  }
  const reset = () => {
    project.value = {}
  }

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
    addExperiment,
    closeExperiment,
    deleteExperiment,
    createProjectAccess,
    deleteProjectAccess,
    addTag,
    deleteTag,
    addPropertty,
    deleteProperty,
    reset
  }
})
