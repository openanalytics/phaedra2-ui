<template>
  <div>
    <q-toolbar class="oa-section-title">
      <q-icon name="functions" class="on-left" />
      <div class="text-h6 q-pr-xl">Add New Feature</div>
      <q-tabs v-model="activeTab" align="left" inline-label dense no-caps>
        <q-tab name="general" icon="info" label="General Info" />
        <q-tab name="calculation" icon="functions" label="Calculation" />
        <q-tab
          name="curve_fitting"
          icon="show_chart"
          label="Dose-Response Curve"
        />
      </q-tabs>
    </q-toolbar>

    <div class="row oa-section-body">
      <q-tab-panels v-model="activeTab" animated style="width: 100%">
        <q-tab-panel name="general" label="General Info" class="col q-pa-md">
          <q-input
            v-model="newFeature.name"
            label="Name"
            stack-label
            dense
            autofocus
          />
          <q-input v-model="newFeature.alias" label="Alias" stack-label dense />
          <q-input
            v-model="newFeature.description"
            label="Description"
            stack-label
            dense
          />
          <q-input
            v-model="newFeature.format"
            label="Format"
            placeholder="#.##"
            stack-label
            dense
          />
        </q-tab-panel>

        <q-tab-panel name="calculation" label="calculation" class="q-pa-md">
          <div class="q-pa-xs col">
            <q-select
              v-model="selectedFormula"
              label="Formula"
              stack-label
              dense
              :options="formulas"
              option-value="id"
              option-label="name"
              @update:model-value="onFormulaSelection"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>{{
                      scope.opt.versionNumber
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <div v-if="variables.list.length > 0">
              <div>
                <q-field
                  label="Formula variables:"
                  stack-label
                  borderless
                  dense
                  class="q-pt-sm"
                >
                  <template v-slot:control>
                    <div class="row col-8">
                      <template
                        :key="variable.variableName"
                        v-for="variable in variables.list"
                      >
                        <div class="col-4">
                          <q-select
                            v-if="variable.inputSource === 'FEATURE'"
                            :options="availableFeatures(newFeature)"
                            v-model="variable.sourceFeatureId"
                            option-value="id"
                            option-label="name"
                            :label="variable.variableName"
                            stack-label
                            emit-value
                            map-options
                            dense
                          />
                          <q-select
                            v-if="
                              variable.inputSource === 'MEASUREMENT_WELL_COLUMN'
                            "
                            v-model="variable.sourceMeasColName"
                            :options="wellColumnOptions"
                            :label="variable.variableName"
                            stack-label
                            @filter="measWellColumnFilter"
                            use-input
                            input-debounce="0"
                            dense
                          />
                          <q-select
                            v-if="
                              variable.inputSource ===
                              'MEASUREMENT_SUBWELL_COLUMN'
                            "
                            v-model="variable.sourceMeasSubWellColName"
                            :options="subWellColumnOptions"
                            :label="variable.variableName"
                            stack-label
                            @filter="measSubWellColumnFilter"
                            use-input
                            input-debounce="0"
                            dense
                          />
                        </div>
                        <div class="col-1" />
                        <div class="col-4">
                          <q-select
                            v-model="variable.inputSource"
                            :options="inputSource"
                            label="Source"
                            dense
                          />
                        </div>
                      </template>
                    </div>
                  </template>
                </q-field>
              </div>
            </div>
            <q-input
              v-model="newFeature.sequence"
              label="Sequence"
              stack-label
              dense
            />
          </div>
        </q-tab-panel>

        <q-tab-panel name="curve_fitting" class="q-pa-md">
          <div class="col">
            <q-select
              label="Model"
              v-model="selectedDCRModel"
              :options="drcModelOptions"
              option-label="name"
              @update:model-value="onDRCModelSelection"
              stack-label
              dense
            />
            <q-input
              label="Description"
              stack-label
              dense
              readonly
              v-model="selectedDCRModel.description"
            />
            <div
              v-for="(input, index) in selectedDCRModel.inputParameters"
              :key="index"
            >
              <q-select
                v-if="input.type === 'option'"
                :label="input.label"
                v-model="newFeature.drcModel.inputParameters[index].value"
                :options="input.options"
                stack-label
                dense
              />
              <q-input
                v-if="input.type === 'numeric' || input.type === 'string'"
                :label="input.label"
                v-model="newFeature.drcModel.inputParameters[index].value"
                stack-label
                dense
              />
              <q-checkbox
                v-if="input.type === 'boolean'"
                :label="input.label"
                v-model="newFeature.drcModel.inputParameters[index].value"
                left-label
                dense
              />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <div class="row col-12 justify-end">
        <div class="q-pa-md">
          <q-btn
            flat
            label="Cancel"
            class="on-left"
            color="primary"
            @click="cancel"
          />
          <q-btn
            label="Apply"
            v-close-popup
            color="primary"
            @click="addFeature"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useProtocolStore } from "@/stores/protocol";
import { useFormulasStore } from "@/stores/formulas";
import drcModelOptions from "@/resources/dose_response_curve_fit_models.json";
import { useMeasurementStore } from "@/stores/measurement";

const protocolStore = useProtocolStore();
const formulasStore = useFormulasStore();
const measStore = useMeasurementStore();

const props = defineProps(["show", "protocol"]);
const emit = defineEmits(["update:show", "createFeature"]);

onMounted(() => {
  measStore.loadMeasurementWellDataColumns();
  measStore.loadMeasurementSubWellDataColumns();
});

const newFeature = ref({
  name: null,
  alias: null,
  description: null,
  format: null,
  type: "CALCULATION",
  sequence: 0,
  protocolId: null,
  formulaId: null,
  drcModel: null,
  civs: null,
  formula: null,
  trigger: null,
});
const activeTab = ref("general");

//TODO fix hardcode
const inputSource = [
  "MEASUREMENT_WELL_COLUMN",
  "MEASUREMENT_SUBWELL_COLUMN",
  "FEATURE",
];

const selectedDCRModel = ref({
  name: "",
  description: "",
});

const onDRCModelSelection = (selected) => {
  newFeature.value.drcModel = {
    name: selected.name,
    description: selected.description,
    inputParameters: [],
  };

  newFeature.value.drcModel.inputParameters = selected.inputParameters.map(
    (inParam) =>
      inParam.type === "boolean"
        ? { name: inParam.name, value: false }
        : { name: inParam.name, value: null }
  );
};

const addFeature = () => {
  newFeature.value.formulaId = selectedFormula.value.id;
  newFeature.value.formula = {
    ...selectedFormula.value,
  };
  newFeature.value.civs = variables.list;
  emit("createFeature", newFeature.value);
};

const cancel = () => {
  emit("cancel");
};

const availableFeatures = (feature) => {
  return protocolStore.getFeatures().filter((f) => {
    return f.id !== feature.id && f.name !== feature.name;
  });
};

const formulas = computed(() =>
  (formulasStore.formulas || []).sort((f1, f2) =>
    f1.name.localeCompare(f2.name)
  )
);
const formulaInputs = ref(null);
const selectedFormula = ref(null);

const onFormulaSelection = async () => {
  if (!selectedFormula.value) return;
  await formulasStore.loadFormulaInputs(selectedFormula.value.id);
  formulaInputs.value = formulasStore.formulaInputs[
    selectedFormula.value.id
  ].map((i) => {
    return {
      variableName: i,
      inputSource: inputSource[0],
      sourceMeasColName: undefined,
      sourceMeasSubWellColName: undefined,
      sourceFeatureId: undefined,
      featureId: newFeature.value.id,
      formulaId: selectedFormula.value.id,
    };
  });
};

let variables = reactive({ list: [] });
watch(formulaInputs, (i) => {
  variables.list = i.map((i) => {
    return {
      variableName: i.variableName,
      inputSource: i.inputSource,
      sourceMeasColName: i.sourceMeasColName,
      sourceMeasSubWellColName: i.sourceMeasSubWellColName,
      sourceFeatureId: i.sourceFeatureId,
      featureId: newFeature.value.id,
      formulaId: selectedFormula.value.id,
    };
  });
});

const wellColumnOptions = ref([]);
const subWellColumnOptions = ref([]);
const measWellColumnFilter = (val, update) => {
  if (val === "") {
    update(() => {
      wellColumnOptions.value = measStore.wellDataColumns;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    wellColumnOptions.value = measStore.wellDataColumns.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
};

const measSubWellColumnFilter = (val, update) => {
  if (val === "") {
    update(() => {
      subWellColumnOptions.value = measStore.subWellDataColumns;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    subWellColumnOptions.value = measStore.subWellDataColumns.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
};
</script>
