import {defineStore} from "pinia"
import calculationsAPI from "@/api/calculations"
import projectsGraphQlAPI from "@/api/graphql/projects"
import resultdataGraphQlAPI from "@/api/graphql/resultdata";
import plateAPI from "@/api/plates";
import resultDataGraphQlAPI from "@/api/graphql/resultdata";
import curvesGraphQlAPI from "@/api/graphql/curvedata";
import ColorUtils from "@/lib/ColorUtils";
import metadataAPI from "@/api/metadata";
import {computed, ref, watch} from "vue";
import {useExperimentStore} from "@/stores/experiment";

export const usePlateStore = defineStore("plate", () => {
  const experimentStore = useExperimentStore()

  const plate = ref(null)
  const wells = ref([])
  const measurements = ref([])
  const resultSets = ref([])
  const protocols = ref([])
  const curves = ref([])
  const activeMeasurement = computed(() => measurements.value.filter(m => m.active === true)[0])
  const activeResultSet = computed(() => {
    const activeMeasId = measurements.value.filter(
        m => m.active === true)[0]?.measurementId ?? null
    return resultSets.value.filter(
            rs => rs.measId === activeMeasId && rs.outcome === 'SUCCESS')[0]
        ?? null
  })

  const featureById = computed(
      () => protocols.value.map(p => p.features))
  const isApproved = computed(() => plate.value?.approvalStatus === 'APPROVED')

  function featuresByProtocolId(protocolId) {
    return protocols.value.find(p => p.id === protocolId)?.features
  }

  function protocolById(protocolId) {
    return protocols.value.find(p => p.id === protocolId) ?? null
  }

  async function loadPlate(plateId) {
    const {onResult, onError} = projectsGraphQlAPI.plateById(plateId)
    onResult(({data}) => {
      plate.value = data.plate;
      wells.value = data.wells
    })
  }

  async function reloadPlate() {
    await loadPlate(plate.value.id)
  }

  async function reloadPlateWells() {
    const {onResult, onError} = projectsGraphQlAPI.wellsByPlateId(
        plate.value.id)
    onResult(({data}) => {
      wells.value = data.wells;
    })
  }

  async function loadPlateMeasurements(plateId) {
    const {onResult, onError} = projectsGraphQlAPI.measurementsByPlateId(
        plateId)
    onResult(({data}) => {
      measurements.value = data.plateMeasurements;
    })
  }

  async function loadPlateCalculations(plateId) {
    const {onResult, onError} = resultdataGraphQlAPI.resultSetsByPlateId(
        plateId)
    onResult(({data}) => {
      resultSets.value = data.resultSets;
    })
  }

  async function loadPlateProtocols(plateId) {
    const {onResult, onError} = resultDataGraphQlAPI.protocolsByPlateId(
        plateId)
    onResult(({data}) => {
      protocols.value = data.protocols;
    })
  }

  async function loadPlateCurves(plateId) {
    const {onResult, onError} = curvesGraphQlAPI.curvesByPlateId(plateId)
    onResult(({data}) => {
      const colorList = ColorUtils.getColorList(data.curves?.length)
      curves.value = data.curves?.map((curve, index) => {
        curve['color'] = colorList[index]
        return curve
      })
    })
  }

  async function renamePlate(newBarcode) {
    await plateAPI.editPlate({id: plate.value.id, barcode: newBarcode})
    await reloadPlate()
  }

  async function editPlateDescription(newDescription) {
    await plateAPI.editPlate({id: plate.value.id, description: newDescription})
    await reloadPlate()
  }

  async function deletePlate() {
    await plateAPI.deletePlateById(plate.value.id)
    reset()
  }

  function isLoaded(plateId) {
    return plate.value?.id === `${plateId}`
  }

  function reset() {
    plate.value = null
  }

  async function fitDoseResponseCurves(plate) {
    await calculationsAPI.fitDoseResponseCurves()
  }

  async function addTag(newTag) {
    await metadataAPI.addTag(
        {'objectId': plate.value.id, 'objectClass': 'PLATE', 'tag': newTag})
    await reloadPlate()
  }

  async function deleteTag(tag) {
    await metadataAPI.removeTag({
      'objectId': Number.parseInt(plate.value.id),
      'objectClass': 'PLATE',
      'tag': tag
    })
    await reloadPlate()
  }

  async function addPropertty(newProperty) {
    await metadataAPI.addProperty({
      objectId: plate.value.id,
      objectClass: 'PLATE',
      propertyName: newProperty.name,
      propertyValue: newProperty.value
    })
    await reloadPlate()
  }

  async function deleteProperty(property) {
    await metadataAPI.removeProperty({
      objectId: plate.value.id,
      objectClass: 'PLATE',
      propertyName: property.propertyName
    })
    await reloadPlate()
  }

  async function acceptWells(wells) {
    await plateAPI.acceptWells(plate.value.id, wells)
    await reloadPlateWells()
  }

  async function rejectWells(wells, rejectionType, description) {
    await plateAPI.rejectWells(plate.value.id, wells, rejectionType,
        description)
    await reloadPlateWells()
  }

  watch(plate, async () => {
    experimentStore.loadExperiment(plate.value.experimentId)

    await loadPlateMeasurements(plate.value.id)
    await loadPlateCalculations(plate.value.id)
    await loadPlateProtocols(plate.value.id)
    await loadPlateCurves(plate.value.id)
  })

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
    renamePlate,
    editPlateDescription,
    deletePlate,
    isLoaded,
    reset,
    fitDoseResponseCurves,
    addTag,
    deleteTag,
    addPropertty,
    deleteProperty,
    acceptWells,
    rejectWells
  }
})
