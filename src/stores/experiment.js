import {defineStore} from "pinia";
import projectsGraphQlAPI from "@/api/graphql/projects"
import experimentAPI from '@/api/experiments.js'
import plateAPI from "@/api/plates";
import metadataAPI from "@/api/metadata";
import {computed, ref} from "vue";

export const useExperimentStore = defineStore("experiment", () => {
  const experiment = ref({})

  const isOpen = computed(() => experiment.value.status === 'OPEN')
  const isClosed = computed(() => experiment.value.status === 'CLOSED')
  const plates = computed(() => experiment.value.plates ?? [])

  function getPlateByPlateId(plateId) {
    return experiment.value.plates.find(p => p.id === plateId) ?? {}
  }

  function loadExperiment(experimentId) {
    if (experimentId) {
      const {onResult, onError} = projectsGraphQlAPI.experimentById(
          experimentId)
      onResult(({data}) => {
        experiment.value = {...data.experiment, plates: data.plates}
      })

      onError((error) => {
        console.error(error)
      })
    }
  }

  function isLoaded(experimentId) {
    return experiment.value.id === `${experimentId}`
  }

  async function renameExperiment(newName) {
    await experimentAPI.editExperiment({id: experiment.value.id, name: newName})
    loadExperiment(experiment.value.id)
  }

  async function editExperimentDescription(newDescription) {
    await experimentAPI.editExperiment(
        {id: experiment.value.id, description: newDescription})
    loadExperiment(experiment.value.id)
  }

  async function openExperiment() {
    await experimentAPI.editExperiment(
        {id: experiment.value.id, status: 'OPEN'})
    loadExperiment(experiment.value.id)
  }

  async function closeExperiment() {
    await experimentAPI.editExperiment(
        {id: experiment.value.id, status: 'CLOSED'})
    loadExperiment(experiment.value.id)
  }

  async function deleteExperiment() {
    await experimentAPI.deleteExperiment(experiment.value.id);
    reset()
  }

  async function addPlate(plate) {
    plate['experimentId'] = experiment.value.id
    await plateAPI.addPlate(plate)
    loadExperiment(experiment.value.id)
  }

  async function addPlates(plates) {
    await Promise.all(plates.map(plate => plateAPI.addPlate(plate)));
    loadExperiment(experiment.value.id)
  }

  async function setPlateLayout(plates, templateId) {
    await plateAPI.setPlateLayout(plates, templateId)
    loadExperiment(experiment.value?.id)
  }

  async function validatePlates(plates) {
    const plateIds = plates.map(plate => plate.id)
    await plateAPI.validatePlates(plateIds)
    loadExperiment(experiment.value.id)
  }

  async function invalidatePlates(plates, reason) {
    const plateIds = plates.map(plate => plate.id)
    await plateAPI.invalidatePlates(plateIds, reason)
    loadExperiment(experiment.value.id)
  }

  async function approvePlates(plates) {
    const plateIds = plates.map(plate => plate.id)
    await plateAPI.approvePlates(plateIds)
    loadExperiment(experiment.value.id)
  }

  async function disapprovePlates(plates, reason) {
    const plateIds = plates.map(plate => plate.id)
    await plateAPI.disapprovePlates(plateIds, reason)
    loadExperiment(experiment.value.id)
  }

  async function resetPlateValidations(plates) {
    const plateIds = plates.map(plate => plate.id)
    await plateAPI.resetPlateValidations(plateIds)
    loadExperiment(experiment.value.id)
  }

  async function deletePlate(plateId) {
    await plateAPI.deletePlateById(plateId)
    loadExperiment(experiment.value.id)
  }

  async function deletePlates(plates) {
    const plateIds = plates.map(plate => plate.id)
    await plateAPI.deletePlates(plateIds)
    loadExperiment(experiment.value.id)
  }

  async function clonePlates(plates) {
    await plateAPI.clonePlates(plates)
    loadExperiment(experiment.value.id)
  }

  async function movePlates(plates, experimentId) {
    await plateAPI.movePlates(plates, experimentId)
    loadExperiment(experiment.value.id)
  }

  async function linkMeasurement(plates, measurementId) {
    const plateIds = plates.map(plate => plate.id)
    await plateAPI.linkMeasurement(plateIds, measurementId)
    loadExperiment(experiment.value.id)
  }

  async function addTag(newTag) {
    await metadataAPI.addTag({
      'objectId': experiment.value.id,
      'objectClass': 'EXPERIMENT',
      'tag': newTag
    })
    loadExperiment(experiment.value.id)
  }

  async function deleteTag(tag) {
    await metadataAPI.removeTag({
      'objectId': experiment.value.id,
      'objectClass': 'EXPERIMENT',
      'tag': tag
    })
    loadExperiment(experiment.value.id)
  }

  async function addProperty({name, value}) {
    const newProperty = {
      objectId: experiment.value.id,
      objectClass: 'EXPERIMENT',
      propertyName: name,
      propertyValue: value
    }
    await metadataAPI.addProperty(newProperty);
    loadExperiment(experiment.value.id)
  }

  async function deleteProperty(property) {
    await metadataAPI.removeProperty({
      objectId: experiment.value.id,
      objectClass: 'EXPERIMENT',
      propertyName: property.propertyName
    })
    loadExperiment(experiment.value.id)
  }

  function reset() {
    experiment.value = {}
  }

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
    addTag,
    deleteTag,
    addProperty,
    deleteProperty,
    reset
  }
})

