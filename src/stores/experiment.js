import {defineStore} from "pinia";
import projectsGraphQlAPI from "@/api/graphql/projects"
import experimentAPI from '@/api/experiments.js'
import plateAPI from "@/api/plates";
import {computed, ref, watch} from "vue";
import {useProjectStore} from "@/stores/project";
import {addTag, deleteTag, addProperty, deleteProperty} from "@/lib/MetadataUtils";

export const useExperimentStore = defineStore("experiment", () => {
  const projectStore = useProjectStore()

  const experiment = ref({})
  const plates = ref([])

  const isMetadataUpdate = ref(false)

  const isOpen = computed(() => experiment.value.status === 'OPEN')
  const isClosed = computed(() => experiment.value.status === 'CLOSED')

  function getPlateByPlateId(plateId) {
    return plates.value.find(p => p.id === plateId) ?? {}
  }

  async function loadExperiment(experimentId) {
    if (experimentId) {
      const {onResult, onError} = projectsGraphQlAPI.experimentById(
          experimentId)
      onResult(({data}) => {
        experiment.value = data.experiment
        plates.value = data.plates
      })

      onError((error) => {
        console.error(error)
      })
    }
  }

  async function reloadExperiment() {
    await loadExperiment(experiment.value.id)
  }

  function isLoaded(experimentId) {
    return experiment.value.id === `${experimentId}`
  }

  async function renameExperiment(newName) {
    await experimentAPI.editExperiment({id: experiment.value.id, name: newName})
    await reloadExperiment()
  }

  async function editExperimentDescription(newDescription) {
    await experimentAPI.editExperiment(
        {id: experiment.value.id, description: newDescription})
    await reloadExperiment()
  }

  async function openExperiment() {
    await experimentAPI.editExperiment(
        {id: experiment.value.id, status: 'OPEN'})
    await reloadExperiment()
  }

  async function closeExperiment() {
    await experimentAPI.editExperiment(
        {id: experiment.value.id, status: 'CLOSED'})
    await reloadExperiment()
  }

  async function deleteExperiment() {
    await experimentAPI.deleteExperiment(experiment.value.id);
    reset()
  }

  async function addPlate(plate) {
    plate['experimentId'] = experiment.value.id
    await plateAPI.addPlate(plate)
    await reloadExperiment()
  }

  async function addPlates(plates) {
    await Promise.all(plates.map(plate => plateAPI.addPlate(plate)));
    await reloadExperiment()
  }

  async function setPlateLayout(plates, templateId) {
    await plateAPI.setPlateLayout(plates, templateId)
    await reloadExperiment()
  }

  async function validatePlates(plates) {
    const plateIds = plates.map(plate => plate.id)
    await plateAPI.validatePlates(plateIds)
    await reloadExperiment()
  }

  async function invalidatePlates(plates, reason) {
    const plateIds = plates.map(plate => plate.id)
    await plateAPI.invalidatePlates(plateIds, reason)
    await reloadExperiment()
  }

  async function approvePlates(plates) {
    const plateIds = plates.map(plate => plate.id)
    await plateAPI.approvePlates(plateIds)
    await reloadExperiment()
  }

  async function disapprovePlates(plates, reason) {
    const plateIds = plates.map(plate => plate.id)
    await plateAPI.disapprovePlates(plateIds, reason)
    await reloadExperiment()
  }

  async function resetPlateValidations(plates) {
    const plateIds = plates.map(plate => plate.id)
    await plateAPI.resetPlateValidations(plateIds)
    await reloadExperiment()
  }

  async function deletePlate(plateId) {
    await plateAPI.deletePlateById(plateId)
    await reloadExperiment()
  }

  async function deletePlates(plates) {
    const plateIds = plates.map(plate => plate.id)
    await plateAPI.deletePlates(plateIds)
    await reloadExperiment()
  }

  async function clonePlates(plates) {
    await plateAPI.clonePlates(plates)
    await reloadExperiment()
  }

  async function movePlates(plates, experimentId) {
    await plateAPI.movePlates(plates, experimentId)
    await reloadExperiment()
  }

  async function linkMeasurement(plates, measurementId) {
    const plateIds = plates.map(plate => plate.id)
    await plateAPI.linkMeasurement(plateIds, measurementId)
    await reloadExperiment()
  }

  async function handleAddTag(newTag) {
    isMetadataUpdate.value = true
    await addTag(experiment.value.id, 'EXPERIMENT', newTag, reloadExperiment)
  }

  async function handleDeleteTag(tag) {
    isMetadataUpdate.value = true
    await deleteTag(experiment.value.id, 'EXPERIMENT', tag, reloadExperiment)
  }

  async function handleAddProperty(newProperty) {
    isMetadataUpdate.value = true
    await addProperty(experiment.value.id, 'EXPERIMENT', newProperty, reloadExperiment)
  }

  async function handleDeleteProperty(property) {
    isMetadataUpdate.value = true
    await deleteProperty(experiment.value.id, 'EXPERIMENT', property, reloadExperiment)
  }

  function reset() {
    experiment.value = {}
  }

  watch(experiment, () => {
    if (!isMetadataUpdate.value) {
      projectStore.loadProject(experiment.value.projectId)
    }
    isMetadataUpdate.value = false
  })

  return {
    experiment,
    isOpen,
    isClosed,
    getPlateByPlateId,
    plates,
    loadExperiment,
    isLoaded,
    renameExperiment,
    editExperimentDescription,
    openExperiment,
    closeExperiment,
    deleteExperiment,
    addPlate,
    addPlates,
    setPlateLayout,
    validatePlates,
    invalidatePlates,
    approvePlates,
    disapprovePlates,
    resetPlateValidations,
    deletePlate,
    deletePlates,
    clonePlates,
    movePlates,
    linkMeasurement,
    handleAddTag,
    handleDeleteTag,
    handleAddProperty,
    handleDeleteProperty,
    reset
  }
})

