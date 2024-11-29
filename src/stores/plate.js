import { defineStore } from "pinia";
import calculationsAPI from "@/api/calculations";
import projectsGraphQlAPI from "@/api/graphql/projects";
import resultdataGraphQlAPI from "@/api/graphql/resultdata";
import plateAPI from "@/api/plates";
import resultDataGraphQlAPI from "@/api/graphql/resultdata";
import curvesGraphQlAPI from "@/api/graphql/curvedata";
import ColorUtils from "@/lib/ColorUtils";
import { computed, ref, watch } from "vue";
import { useExperimentStore } from "@/stores/experiment";
import {
  addTag,
  deleteTag,
  addProperty,
  deleteProperty,
} from "@/lib/MetadataUtils";

export const usePlateStore = defineStore("plate", () => {
  const experimentStore = useExperimentStore();

  const plate = ref(null);
  const wells = ref([]);
  const measurements = ref([]);
  const resultSets = ref([]);
  const protocols = ref([]);
  const curves = ref([]);
  const activeMeasurement = ref(null);
  const isMetadataUpdate = ref(false);
  const activeResultSet = computed(() => {
    const activeMeasId = activeMeasurement.value?.measurementId ?? null;
    return (
      resultSets.value.filter(
        (rs) => rs.measId === activeMeasId && rs.outcome === "SUCCESS"
      )[0] ?? null
    );
  });

  const featureById = computed(() => protocols.value.map((p) => p.features));
  const isApproved = computed(() => plate.value?.approvalStatus === "APPROVED");

  function featuresByProtocolId(protocolId) {
    return protocols.value.find((p) => p.id === protocolId)?.features;
  }

  function protocolById(protocolId) {
    return protocols.value.find((p) => p.id === protocolId) ?? null;
  }

  async function loadPlate(plateId) {
    const data = await projectsGraphQlAPI.plateById(plateId);
    plate.value = data.plate;
    wells.value = data.wells;
  }

  async function reloadPlate(id) {
    if (id) {
      await loadPlate(id);
    }
  }

  async function reloadPlateWells() {
    const data = await projectsGraphQlAPI.wellsByPlateId(plate.value.id);
    wells.value = data.wells;
  }

  async function loadPlateMeasurements(plateId) {
    const data = await projectsGraphQlAPI.measurementsByPlateId(plateId);
    measurements.value = data.plateMeasurements;
    activeMeasurement.value = measurements.value.filter(
      (m) => m.active === true
    )[0];
  }

  async function loadPlateCalculations(plateId) {
    const data = await resultdataGraphQlAPI.resultSetsByPlateId(plateId);
    resultSets.value = data.resultSets;
  }

  async function loadPlateProtocols(plateId) {
    const data = await resultDataGraphQlAPI.protocolsByPlateId(plateId);
    protocols.value = data.protocols;
  }

  async function loadPlateCurves(plateId) {
    const data = await curvesGraphQlAPI.curvesByPlateId(plateId);
    const colorList = ColorUtils.getColorList(data.curves?.length);
    curves.value = data.curves?.map((curve, index) => {
      curve["color"] = colorList[index];
      return curve;
    });
  }

  async function editPlate(id, newVal) {
    await plateAPI.editPlate({ id: id, ...newVal });
  }

  async function deletePlate(id) {
    await plateAPI.deletePlateById(id);
    reset();
  }

  async function deletePlates(ids) {
    await plateAPI.deletePlates(ids);
    reset();
  }

  function isLoaded(plateId) {
    return plate.value?.id === `${plateId}`;
  }

  function reset() {
    plate.value = null;
  }

  async function fitDoseResponseCurves(plate) {
    await calculationsAPI.fitDoseResponseCurves();
  }

  async function handleAddTag(id, newTag) {
    isMetadataUpdate.value = true;
    await addTag(id, "PLATE", newTag, reloadPlate);
  }

  async function handleDeleteTag(id, tag) {
    isMetadataUpdate.value = true;
    await deleteTag(id, "PLATE", tag, reloadPlate);
  }

  async function handleAddProperty(id, newProperty) {
    isMetadataUpdate.value = true;
    await addProperty(id, "PLATE", newProperty, reloadPlate);
  }

  async function handleDeleteProperty(id, property) {
    isMetadataUpdate.value = true;
    await deleteProperty(id, "PLATE", property, reloadPlate);
  }

  async function acceptWells(wells) {
    await plateAPI.acceptWells(plate.value.id, wells);
    await reloadPlateWells();
  }

  async function rejectWells(wells, rejectionType, description) {
    await plateAPI.rejectWells(
      plate.value.id,
      wells,
      rejectionType,
      description
    );
    await reloadPlateWells();
  }

  watch(plate, async () => {
    if (!isMetadataUpdate.value && plate.value) {
      await loadPlateMeasurements(plate.value.id);
      await loadPlateCalculations(plate.value.id);
      await loadPlateProtocols(plate.value.id);
      await loadPlateCurves(plate.value.id);
    }

    isMetadataUpdate.value = false;
  });

  return {
    plate,
    wells,
    measurements,
    resultSets,
    protocols,
    curves,
    activeMeasurement,
    activeResultSet,
    protocolById,
    featuresByProtocolId,
    featureById,
    isApproved,
    loadPlate,
    reloadPlate,
    reloadPlateWells,
    loadPlateMeasurements,
    loadPlateCalculations,
    loadPlateProtocols,
    loadPlateCurves,
    deletePlate,
    deletePlates,
    isLoaded,
    reset,
    fitDoseResponseCurves,
    handleAddTag,
    handleDeleteTag,
    handleAddProperty,
    handleDeleteProperty,
    acceptWells,
    editPlate,
    rejectWells,
  };
});
