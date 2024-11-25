<template>
  <q-dialog @hide="clearValues" v-model="showDialog">
    <q-card style="min-width: 50vw">
      <q-card-section
        class="text-h6 items-center full-width q-pa-sm bg-primary text-secondary"
      >
        <q-icon name="add" class="q-pr-sm" />
        New Plate
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <div class="row">
          <div class="col q-ma-md">
            <q-input
              v-model="newPlate.barcode"
              square
              autofocus
              label="Barcode"
            ></q-input>
            <q-input
              v-model="newPlate.description"
              square
              label="Description"
            ></q-input>
            <br />
          </div>
          <div class="col q-ma-md">
            <q-input v-model="newPlate.rows" square label="Rows"></q-input>
            <q-input
              v-model="newPlate.columns"
              square
              label="Columns"
            ></q-input>
            <br />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn label="Cancel" v-close-popup @click="clearValues" />
        <q-btn
          label="Add plate"
          v-close-popup
          color="primary"
          @click="createNewPlate"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from "vue";
import { useExperimentStore } from "@/stores/experiment";
import { useLoadingHandler } from "@/composable/loadingHandler";

const newPlate = ref({
  barcode: null,
  description: null,
  rows: null,
  columns: null,
  sequence: null,
  linkStatus: "NOT_LINKED",
  calculationStatus: "CALCULATION_NEEDED",
  validationStatus: "VALIDATION_NOT_SET",
  approvalStatus: "APPROVAL_NOT_SET",
});

const props = defineProps({
  show: Boolean,
});
const emits = defineEmits(["update:show"]);
const showDialog = computed({
  get: () => props.show,
  set: (v) => emits("update:show", v),
});

const clearValues = () => {
  newPlate.value = {
    barcode: null,
    description: null,
    rows: null,
    columns: null,
    sequence: null,
    linkStatus: "NOT_LINKED",
    calculationStatus: "CALCULATION_NEEDED",
    validationStatus: "VALIDATION_NOT_SET",
    approvalStatus: "APPROVAL_NOT_SET",
  };
};

const experimentStore = useExperimentStore();
const loadingHandler = useLoadingHandler();
const createNewPlate = async () => {
  newPlate.value.sequence = "1";
  newPlate.value.experimentId = experimentStore.experiment.id;
  await loadingHandler.handleLoadingDuring(
    experimentStore.addPlate(experimentStore.experiment.id, newPlate.value)
  );
  clearValues();
};
</script>

<style scoped></style>
