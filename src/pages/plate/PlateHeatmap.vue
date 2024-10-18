<template>
  <div v-if="plate" class="col" style="min-width: 75%">
    <FeatureSelector
      class="q-pb-xs"
      :protocols="props.protocols"
      :measurements="props.measurements"
      @featureOptionSelection="handleFeatureOptionSelection"
      @rawFeatureSelection="handleRawFeatureSelection"
      @calculatedFeatureSelection="handleCalculatedFeatureSelection"
    />
    <q-space class="q-pa-xs" />
    <WellGrid
      :plate="props.plate"
      :wells="props.wells"
      :loading="dataLoading"
      :wellColorFunction="wellColorFunction"
      :wellLabelFunctions="wellLabelFunctions"
      @wellStatusChanged="() => emits('wellStatusChanged')"
      @wellSelection="handleWellSelection"
    />
    <ColorLegend class="q-pt-sm" :rangeValues="rangeValues" :plate="plate" />
  </div>
  <div v-else class="absolute-center">
    <q-badge color="negative">{{ errorMessage }}</q-badge>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, onMounted } from "vue";
import WellGrid from "@/components/well/WellGrid";
import FeatureSelector from "@/components/widgets/FeatureSelector";
import ColorLegend from "@/components/widgets/ColorLegend";
import ColorUtils from "@/lib/ColorUtils.js";
import WellUtils from "@/lib/WellUtils.js";

import resultDataGraphQlAPI from "@/api/graphql/resultdata";
import measurementsGraphQlAPI from "@/api/graphql/measurements";
import { usePlateStore } from "@/stores/plate";
import { useUIStore } from "@/stores/ui";

const props = defineProps(["plate", "wells", "measurements", "protocols"]);
const emits = defineEmits(["wellStatusChanged"]);

const wellData = ref([]);
const dataLoading = ref(false);
const rangeValues = ref({ min: 0, mean: 50, max: 100 });
const errorMessage = "No plate selected";

const lut = ref(ColorUtils.createLUT([], ColorUtils.defaultHeatmapGradients));

const handleFeatureOptionSelection = () => {
  wellData.value = [];
};

const handleRawFeatureSelection = (measurementColumn) => {
  if (measurementColumn) {
    const { onResult } = measurementsGraphQlAPI.measurementWellData(
      measurementColumn.measurementId,
      measurementColumn.column
    );
    onResult(({ data }) => {
      wellData.value = data?.wellData ? data.wellData : [];
    });
  } else {
    wellData.value = [];
  }
};

const handleCalculatedFeatureSelection = (calculatedFeature) => {
  if (calculatedFeature) {
    const { onResult } =
      resultDataGraphQlAPI.featureValuesByPlateIdAndFeatureIdAndProtocolId(
        props.plate.id,
        calculatedFeature.featureId,
        calculatedFeature.protocolId
      );
    onResult(({ data }) => {
      wellData.value = data?.featureValues
        ? data.featureValues.map((fv) => fv.value)
        : [];
    });
  } else {
    wellData.value = [];
  }
};

watch(wellData, () => {
  lut.value = ColorUtils.createLUT(
    wellData.value,
    ColorUtils.defaultHeatmapGradients
  );
  rangeValues.value = calcRangeValues(wellData.value);
});

const wellColorFunction = (well) => {
  const wellNr = WellUtils.getWellNr(
    well.row,
    well.column,
    props.plate?.columns
  );
  return lut.value.getColor(wellData.value[wellNr - 1]);
};

const wellLabelFunctions = [
  (well) => {
    let wellNr = WellUtils.getWellNr(
      well.row,
      well.column,
      props.plate?.columns
    );
    return wellData.value.length > 0
      ? Math.round(wellData.value[wellNr - 1] * 100) / 100
      : "";
  },
];

const calcRangeValues = (values) => {
  const min = Math.min(...values.filter((v) => !isNaN(v)));
  const mean = values.reduce((x, y) => x + y, 0) / values.length;
  const max = Math.max(...values.filter((v) => !isNaN(v)));
  return { min: min, mean: mean, max: max };
};

const plateStore = usePlateStore()
const uiStore = useUIStore()
const handleWellSelection = (selectedWells) => {
  if (selectedWells.length > 0) {
    const selectedSubstance = [... new Set(selectedWells.map(well => well.wellSubstance?.name))]
    const selectedCurves = plateStore.curves.filter(curve => selectedSubstance.includes(curve.substanceName))
    uiStore.selectedDRCurves = selectedCurves
  }
};


</script>