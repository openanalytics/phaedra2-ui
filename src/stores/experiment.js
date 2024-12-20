import { defineStore } from "pinia";
import projectsGraphQlAPI from "@/api/graphql/projects";
import experimentAPI from "@/api/experiments.js";
import plateAPI from "@/api/plates";
import { computed, ref, watch } from "vue";
import { useProjectStore } from "@/stores/project";
import {
  addTag,
  deleteTag,
  addProperty,
  deleteProperty,
} from "@/lib/MetadataUtils";

export const useExperimentStore = defineStore("experiment", () => {
  const projectStore = useProjectStore();

  const experiment = ref({});
  const plates = ref([]);

  const isMetadataUpdate = ref(false);

  const isOpen = computed(() => experiment.value.status === "OPEN");
  const isClosed = computed(() => experiment.value.status === "CLOSED");

  async function loadExperiment(experimentId) {
    if (experimentId) {
      const data = await projectsGraphQlAPI.experimentById(experimentId);
      experiment.value = data.experiment;
      plates.value = data.plates;
    }
  }

  async function reloadExperiment(id) {
    id ? await loadExperiment(id) : await loadExperiment(experiment.value.id)
  }

  function isLoaded(experimentId) {
    return experiment.value.id === `${experimentId}`;
  }

  async function editExperiment(id, newVal) {
    await experimentAPI.editExperiment({ id: id, ...newVal });
  }

  async function openExperiments(ids) {
    for (const id of ids) {
      await experimentAPI
        .editExperiment({
          id: id,
          status: "OPEN",
        })
        .then(() => {
          console.log("exp closed");
        });
    }
  }

  async function closeExperiments(ids) {
    for (const id of ids) {
      await experimentAPI
        .editExperiment({
          id: id,
          status: "CLOSED",
        })
        .then(() => {
          console.log("exp closed");
        });
    }
  }

  async function deleteExperiment(id) {
    await experimentAPI.deleteExperiment(id);
    reset();
  }

  async function deleteExperiments(ids) {
    await experimentAPI.deleteExperiments(ids);
    reset();
  }

  async function addPlate(id, plate) {
    plate["experimentId"] = id;
    await plateAPI.addPlate(plate);
  }

  async function addPlates(id, plates) {
    plates = plates.map((plate) => (plate = { ...plate, experimentId: id }));
    await Promise.all(plates.map((plate) => plateAPI.addPlate(plate)));
  }

  async function setPlateLayout(plates, templateId) {
    await plateAPI.setPlateLayout(plates, templateId);
  }

  async function validatePlates(plates) {
    const plateIds = plates.map((plate) => plate.id);
    await plateAPI.validatePlates(plateIds);
  }

  async function invalidatePlates(plates, reason) {
    const plateIds = plates.map((plate) => plate.id);
    await plateAPI.invalidatePlates(plateIds, reason);
  }

  async function approvePlates(plates) {
    const plateIds = plates.map((plate) => plate.id);
    await plateAPI.approvePlates(plateIds);
  }

  async function disapprovePlates(plates, reason) {
    const plateIds = plates.map((plate) => plate.id);
    await plateAPI.disapprovePlates(plateIds, reason);
  }

  async function resetPlateValidations(plates) {
    const plateIds = plates.map((plate) => plate.id);
    await plateAPI.resetPlateValidations(plateIds);
  }

  async function deletePlate(plateId) {
    await plateAPI.deletePlateById(plateId);
  }

  async function deletePlates(plates) {
    const plateIds = plates.map((plate) => plate.id);
    await plateAPI.deletePlates(plateIds);
  }

  async function clonePlates(plates) {
    await plateAPI.clonePlates(plates);
  }

  async function movePlates(plates, experimentId) {
    await plateAPI.movePlates(plates, experimentId);
    await reloadExperiment(experimentId);
  }

  async function linkMeasurement(plates, measurementId) {
    const plateIds = plates.map((plate) => plate.id);
    await plateAPI.linkMeasurement(plateIds, measurementId);
  }

  async function handleAddTag(id, newTag) {
    isMetadataUpdate.value = true;
    await addTag(id, "EXPERIMENT", newTag, reloadExperiment);
  }

  async function handleDeleteTag(id, tag) {
    isMetadataUpdate.value = true;
    await deleteTag(id, "EXPERIMENT", tag, reloadExperiment);
  }

  async function handleAddProperty(id, newProperty) {
    isMetadataUpdate.value = true;
    await addProperty(id, "EXPERIMENT", newProperty, () => {});
  }

  async function handleDeleteProperty(id, property) {
    isMetadataUpdate.value = true;
    await deleteProperty(id, "EXPERIMENT", property, () => {});
  }

  function reset() {
    experiment.value = {};
  }

  // watch(experiment, async () => {
  //   if (!isMetadataUpdate.value) {
  //     await projectStore.loadProject(experiment.value.projectId);
  //   }
  //   isMetadataUpdate.value = false;
  // });

  return {
    experiment,
    isOpen,
    isClosed,
    plates,
    loadExperiment,
    isLoaded,
    closeExperiments,
    openExperiments,
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
    reset,
    editExperiment,
    reloadExperiment,
    deleteExperiments,
  };
});
