<template>
  <div style="width: 100%">
    <div class="row q-pa-sm">
      <FeatureSelector
        :protocols="protocols"
        :measurements="measurements"
        @featureOptionSelection="handleFeatureOptionSelection"
        @rawFeatureSelection="onRawFeatureSelection"
        @calculatedFeatureSelection="onCalculatedFeatureSelection"
      />
    </div>
    <div class="row gridContainer">
      <div
        v-for="(pd, index) in plateDataPerPlate"
        :key="index"
        class="q-pa-sm"
      >
        <MiniHeatmap :plate="pd.plate" :plateData="pd.resultData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import MiniHeatmap from "@/components/widgets/MiniHeatmap.vue";
import FeatureSelector from "@/components/widgets/FeatureSelector.vue";
import resultDataGraphQlAPI from "@/api/graphql/resultdata";
import measurementsGraphQlAPI from "@/api/graphql/measurements";
import projectsGraphQlAPI from "@/api/graphql/projects";
import { useLoadingHandler } from "../../composable/loadingHandler";

const gridColumnStyle = "repeat(3, 1fr)";

const props = defineProps(["plates", "experiment"]);

const protocols = ref([]);
const measurements = ref([]);

const fetchMeasurementsByExperiment = async () => {
  const data = await projectsGraphQlAPI.activeMeasurementsByExperimentId(props.experiment.id);
  measurements.value = data.plateMeasurements.filter((m) => m !== null);
};

const fetchProtocolsByExperiment = async () => {
  const data = await resultDataGraphQlAPI.protocolsByExperimentId(props.experiment.id)
  protocols.value = data.protocols;
};

const loadingHandler = useLoadingHandler();
const fetchData = async () => {
  await fetchMeasurementsByExperiment();
  await fetchProtocolsByExperiment();
}

loadingHandler.handleLoadingDuring(fetchData());

const plateDataPerPlate = ref(
  props.plates.map((p) => ({ plate: p, resultData: {} }))
);

const handleFeatureOptionSelection = () => {
  plateDataPerPlate.value = props.plates.map((p) => ({
    plate: p,
    resultData: {},
  }));
};

const onRawFeatureSelection = (rawFeature) => {
  loadingHandler.handleLoadingDuring(
    handleRawFeatureSelection(rawFeature)
  );
};

const handleRawFeatureSelection = async (rawFeature) => {
  if (rawFeature) {
    for (let i = 0; i < plateDataPerPlate.value.length; i++) {
      measurementsGraphQlAPI
        .measurementWellData(rawFeature.measurementId, rawFeature.column)
        .then((data) => {
          plateDataPerPlate.value[i].resultData = {
            values: data?.wellData ? data.wellData : [],
          };
        })
    }
  }
};

const onCalculatedFeatureSelection = (calculatedFeature) => {
  loadingHandler.handleLoadingDuring(
    handleCalculatedFeatureSelection(calculatedFeature)
  );
};

const handleCalculatedFeatureSelection = async (calculatedFeature) => {
  if (calculatedFeature) {
    for (let i = 0; i < plateDataPerPlate.value.length; i++) {
      const plateId = plateDataPerPlate.value[i].plate.id;
      resultDataGraphQlAPI
        .featureValuesByPlateIdAndFeatureIdAndProtocolId(
          plateId,
          calculatedFeature.featureId,
          calculatedFeature.protocolId
        )
        .then((data) => {
          plateDataPerPlate.value[i].resultData = {
            values: data?.featureValues
              ? data.featureValues.map((fv) => fv.value)
              : [],
          };
        })
    }
  }
};
</script>

<style scoped>
.gridContainer {
  display: grid;
  grid-template-columns: v-bind(gridColumnStyle);
}
</style>
