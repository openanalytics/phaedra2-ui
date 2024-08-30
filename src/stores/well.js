import {defineStore, skipHydrate} from "pinia";
import {ref, watch, watchEffect} from "vue";
import measAPI from "@/api/measurements";
import projectsGraphQlAPI from "@/api/graphql/projects"
import {usePlateStore} from "@/stores/plate";
import WellUtils from "@/lib/WellUtils";
import curvesGraphQlAPI from "@/api/graphql/curvedata";
import {useUIStore} from "@/stores/ui";

export const useWellStore = defineStore("well", () => {
  const plateStore = usePlateStore()
  const uiStore = useUIStore()

  const well = ref(null)
  const wellImage = ref(null)
  const loadingImage = ref(true)
  const wellDRCurve = ref([])
  const wellFeatureValues = ref([])

  const loadWell = (wellId) => {
    const {onResult, onError} = projectsGraphQlAPI.wellById(wellId)
    onResult(({data}) => {
      well.value = data.well
      well.value["pos"] = WellUtils.getWellCoordinate(well.value.row,
          well.value.column)
    })
  }

  const loadWellImage = async () => {
    loadingImage.value = true
    const measurementId = plateStore.activeMeasurement.measurementId
    const renderConfigId = uiStore.imageRenderSettings.baseRenderConfigId
        ?? null
    const channels = uiStore.imageRenderSettings.channels.filter(channel => channel.enabled) ?? []
    const scale = uiStore.imageRenderSettings.scale ?? 0.25

    wellImage.value = await measAPI.getMeasImage(measurementId,
        well.value.wellNr, renderConfigId, channels, scale)
    loadingImage.value = false
  }

  const loadWellCurve = async () => {
    const {onResult, onError} = curvesGraphQlAPI.curvesThatIncludesWellId(
        well.value.id)
    onResult(({data}) => {
      wellDRCurve.value = data.curves
    })
  }

  watch(well, async () => {
    await plateStore.loadPlate(well.value.plateId)
    await loadWellCurve()
  })

  watch(() => plateStore.activeMeasurement, async () => {
    await loadWellImage()
  })

  watch(() => uiStore.imageRenderSettings, async () => {
    await loadWellImage()
  })

  return {
    well,
    wellImage,
    loadingImage,
    wellDRCurve,
    wellFeatureValues,
    loadWell
  }
})
