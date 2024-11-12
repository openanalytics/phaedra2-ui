import { defineStore } from "pinia";
import { ref, watch } from "vue";
import measAPI from "@/api/measurements";
import projectsGraphQlAPI from "@/api/graphql/projects";
import { usePlateStore } from "@/stores/plate";
import WellUtils from "@/lib/WellUtils";
import curvesGraphQlAPI from "@/api/graphql/curvedata";
import { useUIStore } from "@/stores/ui";
import {
  addProperty,
  addTag,
  deleteProperty,
  deleteTag,
} from "@/lib/MetadataUtils";
import plateAPI from "@/api/plates";

export const useWellStore = defineStore("well", () => {
  const plateStore = usePlateStore();
  const uiStore = useUIStore();

  const well = ref(null);
  const wellImage = ref(null);
  const loadingImage = ref(true);
  const wellDRCurve = ref([]);
  const wellFeatureValues = ref([]);
  const isMetadataUpdate = ref(false);

  const loadWell = async (wellId) => {
    const data = await projectsGraphQlAPI.wellById(wellId);
    well.value = data.well;
    well.value["pos"] = WellUtils.getWellCoordinate(
        well.value.row,
        well.value.column
    );
    // const { onResult, onError } = await projectsGraphQlAPI.wellById(wellId);
    // onResult(({ data }) => {
    //   well.value = data.well;
    //   well.value["pos"] = WellUtils.getWellCoordinate(
    //     well.value.row,
    //     well.value.column
    //   );
    // });
  };

  const reloadWell = async () => {
    await loadWell(well.value.id);
  };

  const loadWellImage = async () => {
    loadingImage.value = true;
    const measurementId = plateStore.activeMeasurement.measurementId;
    const renderConfigId =
      uiStore.imageRenderSettings.baseRenderConfigId ?? null;
    const channels =
      uiStore.imageRenderSettings.channels.filter(
        (channel) => channel.enabled
      ) ?? [];
    const scale = uiStore.imageRenderSettings.scale ?? 0.25;

    try {
      wellImage.value = await measAPI.getMeasImage(
        measurementId,
        well.value.wellNr,
        renderConfigId,
        channels,
        scale
      );
    } catch (error) {
      wellImage.value = null;
    }
    loadingImage.value = false;
  };

  const loadWellCurve = async () => {
    const { onResult, onError } = curvesGraphQlAPI.curvesThatIncludesWellId(
      well.value.id
    );
    onResult(({ data }) => {
      wellDRCurve.value = data.curves;
    });
  };

  async function handleAddTag(id, newTag) {
    isMetadataUpdate.value = true;
    await addTag(id, "WELL", newTag, () => {});
  }

  async function handleDeleteTag(id, tag) {
    isMetadataUpdate.value = true;
    await deleteTag(id, "WELL", tag, () => {});
  }

  async function handleAddProperty(id, newProperty) {
    isMetadataUpdate.value = true;
    await addProperty(id, "WELL", newProperty, () => {});
  }

  async function handleDeleteProperty(id, property) {
    isMetadataUpdate.value = true;
    await deleteProperty(id, "WELL", property, () => {});
  }

  async function rejectWell(id, rejectionType, description) {
    await plateAPI.rejectWells(id, [well.value], rejectionType, description);
  }

  async function acceptWell(id) {
    await plateAPI.acceptWells(id, [well.value]);
  }

  watch(well, async () => {
    if (!isMetadataUpdate.value) {
      await plateStore.loadPlate(well.value.plateId);
      await loadWellCurve();
    }
    isMetadataUpdate.value = false;
  });

  watch(
    () => plateStore.activeMeasurement,
    async () => {
      await loadWellImage();
    }
  );

  watch(
    () => uiStore.imageRenderSettings,
    async () => {
      await loadWellImage();
    }
  );

  return {
    well,
    wellImage,
    loadingImage,
    wellDRCurve,
    wellFeatureValues,
    loadWell,
    handleAddTag,
    handleDeleteTag,
    handleAddProperty,
    handleDeleteProperty,
    rejectWell,
    acceptWell,
  };
});
