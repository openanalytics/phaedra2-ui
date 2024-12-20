import {defineStore} from "pinia";
import measurementsAPI from "@/api/measurements.js"
import measAPI from "@/api/measurements";
import {ref} from "vue";

export const useMeasurementStore = defineStore("measurement", () => {
  const measurement = ref(null)
  const measurements = ref([])
  const renderConfig = ref({})
  const renderConfigs = ref([])
  const wellData = ref({})
  const subWellData = ref([])
  const measImages = ref({})
  const wellDataColumns = ref([])
  const subWellDataColumns = ref([])

  const getMeasurementById = (measurementId) => {
    measurements.value?.find(measuement => measuement.id === measurementId)
  }

  const getRenderConfigById = (renderConfigId) => {
    renderConfigs.value?.find(
        renderConfig => renderConfig.id === renderConfigId)
  }

  const getWellImage = (wellNr) => {
    return wellNr ? measImages.value[measurement.value.id + '#' + wellNr] : ''
  }

  const loadAllMeasurements = async (range) => {
    measurements.value = await measurementsAPI.getAllMeasurements(range)
  }

  const loadMeasurementById = async (measurementId) => {
    measurement.value = await measurementsAPI.getMeasurementById(measurementId)
  }

  const loadWellData = async (measurementId) => {
    wellData.value = await measurementsAPI.getWellData(measurementId)
  }

  const loadSubWellData = async ({wellNr, subWellColumns: subWellColumns}) => {
    const result = await measurementsAPI.getSubWellData(
        measurement.value.id, wellNr, subWellColumns)
    result.value = Array.from(
        {length: result[subWellColumns[0]]?.length ?? 0}, (_, i) => {
          return subWellColumns.reduce((result, subWellColumn) => {
            result[subWellColumn] = result[subWellColumn][i];
            return result;
          }, {});
        });
  }

  const loadMeasImage = async ({
    measurementId,
    wellNr,
    renderConfigId,
    channels,
    scale
  }) => {
    if (wellNr) {
      if (measurementId) {
        measImages.value[measurementId + '#'
        + wellNr] = await measAPI.getMeasImage(measurementId, wellNr,
            renderConfigId, channels, scale);
      } else {
        measImages.value[measurement.value.id + '#'
        + wellNr] = await measAPI.getMeasImage(measurement.value.id, wellNr,
            renderConfigId, channels, scale);
      }
    }
  }

  const loadAllRenderConfigs = async () => {
    renderConfigs.value = await measurementsAPI.getRenderConfigs()
  }

  const loadRenderConfig = async (renderConfigId) => {
    renderConfig.value = await measurementsAPI.getRenderConfig(renderConfigId)
    renderConfig.value.config.channelConfigs.forEach((ch, i) => ch["nr"] = i + 1)
  }

  const reloadRenderConfig = async () => {
    await loadRenderConfig(renderConfig.value.id)
  }

  const updateRenderConfig = async () => {
    await measAPI.updateRenderConfig(renderConfig.value)
    await reloadRenderConfig()
  }

  const deleteRenderConfig = async (renderConfigId) => {
    await measAPI.deleteRenderConfig(renderConfigId)
    await reloadRenderConfig()
  }

  const addRenderConfigChannel = async () => {
    const newChannel = {
      alpha: null,
      contrastMax: null,
      contrastMin: null,
      name: "New channel",
      rgd: null
    }
    renderConfig.value.config.channelConfigs.push(newChannel)
  }

  const deleteRenderConfigChannel = async () => {

  }

  const loadMeasurementWellDataColumns = async () => {
    wellDataColumns.value = await measAPI.getUniqueWellDataColumns()
  }

  const loadMeasurementSubWellDataColumns = async () => {
    subWellDataColumns.value = await measAPI.getUniqueSubWellDataColumns()
  }

  return {
    measurement,
    measurements,
    renderConfig,
    renderConfigs,
    wellData,
    subWellData,
    measImages,
    wellDataColumns,
    subWellDataColumns,
    getMeasurementById,
    getRenderConfigById,
    getWellImage,
    loadAllMeasurements,
    loadMeasurementById,
    loadWellData,
    loadSubWellData,
    loadMeasImage,
    loadAllRenderConfigs,
    loadRenderConfig,
    updateRenderConfig,
    deleteRenderConfig,
    addRenderConfigChannel,
    deleteRenderConfigChannel,
    loadMeasurementWellDataColumns,
    loadMeasurementSubWellDataColumns,
  }
})
