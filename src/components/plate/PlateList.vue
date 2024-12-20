<template>
  <oa-table
    :columns="columns"
    :rows="plates"
    @row-click="selectPlate"
    @row-dblclick="gotoPlateView"
    @row-contextmenu="plateContextMenu"
    selection="multiple"
    v-model:selected="selectedPlates"
  >
    <template v-slot:top-right>
      <q-btn
        size="sm"
        icon="add"
        round
        color="primary"
        :disable="!createPlateCondition"
        ><q-tooltip
          >Create New Plate
          <span v-if="!createPlateCondition"
            >(You need to select at least 1 'OPEN' experiment)</span
          ></q-tooltip
        >
        <q-menu>
          <q-list size="sm" dense>
            <q-item
              clickable
              v-close-popup
              v-ripple
              @click="openNewPlateDialog"
            >
              <q-item-section no-wrap>
                <div style="vertical-align: center">
                  <span
                    style="
                      text-transform: uppercase;
                      font-size: 12px;
                      text-align: right;
                    "
                  >
                    New Plate
                  </span>
                </div>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              v-ripple
              @click="openNewPlateFromMeasurementsDialog"
            >
              <q-item-section no-wrap class="row">
                <div>
                  <span
                    style="
                      text-transform: uppercase;
                      font-size: 12px;
                      text-align: right;
                    "
                  >
                    New Plate(s) from Measurement(s)
                  </span>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn round icon="download" size="sm" class="q-mx-sm">
        <q-tooltip>Download plates list</q-tooltip>
        <q-menu anchor="bottom middle" self="top left">
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="exportToCSV">
              <q-item-section>Export to CSV</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="exportToXLSX">
              <q-item-section>Export to Excel</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </template>
    <template v-slot:body-cell-link-status="props">
      <q-td :props="props">
        <q-tooltip transition-show="flip-right" transition-hide="flip-left">
          {{ "Linked with plate template " + props.row.linkTemplateName }}
        </q-tooltip>
        <StatusFlag :object="props.row" :statusField="'linkStatus'" />
      </q-td>
    </template>
    <template v-slot:body-cell-status-calculation="props">
      <q-td :props="props">
        <q-tooltip transition-show="flip-right" transition-hide="flip-left">
          {{
            "Calculated on: " + FormatUtils.formatDate(props.row.calculatedOn)
          }}
        </q-tooltip>
        <StatusFlag :object="props.row" :statusField="'calculationStatus'" />
      </q-td>
    </template>
    <template v-slot:body-cell-status-validated="props">
      <q-td :props="props">
        <q-tooltip transition-show="flip-right" transition-hide="flip-left">
          {{ "Validated on: " + FormatUtils.formatDate(props.row.validatedOn) }}
        </q-tooltip>
        <StatusFlag :object="props.row" :statusField="'validationStatus'" />
      </q-td>
    </template>
    <template v-slot:body-cell-status-approved="props">
      <q-td :props="props">
        <q-tooltip transition-show="flip-right" transition-hide="flip-left">
          {{ "Approved on: " + FormatUtils.formatDate(props.row.approvedOn) }}
        </q-tooltip>
        <StatusFlag :object="props.row" :statusField="'approvalStatus'" />
      </q-td>
    </template>
    <template v-slot:no-data>
      <div class="full-width row text-info">
        <span>No plates to show.</span>
      </div>
    </template>
  </oa-table>
  <PlateActionMenu
    :plate="selectedPlate"
    :plates="selectedPlates"
    @onDeletePlates="deletePlates"
    @open="open"
  />

  <div v-if="createPlateCondition">
    <new-plate-from-measurement-dialog
      v-model:show="showNewPlateFromMeasDialog"
      :experiments="experiments"
      @updated="emits('updated')"
    />

    <new-plate-dialog
      v-model:show="showNewPlateDialog"
      :experiments="experiments"
      @updated="emits('updated')"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";

import PlateActionMenu from "@/components/plate/PlateActionMenu";
import StatusFlag from "@/components/widgets/StatusFlag";
import FormatUtils from "@/lib/FormatUtils";
import FilterUtils from "@/lib/FilterUtils.js";
import { useExportTableData } from "@/composable/exportTableData";
import OaTable from "@/components/table/OaTable.vue";
import { usePlateStore } from "../../stores/plate";
import { useLoadingHandler } from "@/composable/loadingHandler";
import NewPlateFromMeasurementDialog from "@/pages/experiment/NewPlateFromMeasurementDialog.vue";
import NewPlateDialog from "@/pages/experiment/NewPlateDialog.vue";

const props = defineProps([
  "plates",
  "experiments",
  "newPlateTab",
  "newPlateFromMeasurements",
  "selected",
]);
const emits = defineEmits([
  "update:newPlateTab",
  "showPlateInspector",
  "selection",
  "updated",
  "open",
]);

const router = useRouter();

const showNewPlateDialog = ref(false);
const showNewPlateFromMeasDialog = ref(false);

const createPlateCondition = computed(
  () =>
    props.experiments.length > 0 &&
    props.experiments.find((exp) => exp.status === "OPEN")
);

const baseColumns = ref([
  { name: "id", align: "left", label: "ID", field: "id", sortable: true },
  {
    name: "experiment",
    align: "left",
    label: "Experiment",
    field: (row) => row.experiment.name,
    sortable: true,
    description: "The experiment name",
  },
  {
    name: "barcode",
    align: "left",
    label: "Barcode",
    field: "barcode",
    sortable: true,
  },
  {
    name: "description",
    align: "left",
    label: "Description",
    field: "description",
    sortable: true,
  },
  { name: "link-status", align: "center", label: "L", field: "linkStatus" },
  {
    name: "status-calculation",
    align: "center",
    label: "C",
    field: "calculationStatus",
  },
  {
    name: "status-validated",
    align: "center",
    label: "V",
    field: "validationStatus",
  },
  {
    name: "status-approved",
    align: "center",
    label: "A",
    field: "approvalStatus",
  },
  {
    name: "dimensions",
    align: "left",
    label: "Dimensions",
    field: (t) => `${t.rows} x ${t.columns}`,
    sortable: true,
  },
  { name: "tags", align: "left", label: "Tags", field: "tags", sortable: true },
  {
    name: "createdOn",
    align: "left",
    label: "Created On",
    field: "createdOn",
    sortable: true,
    format: FormatUtils.formatDate,
  },
  {
    name: "createdBy",
    align: "left",
    label: "Created By",
    field: "createdBy",
    sortable: true,
  },
]);

const route = useRoute();

const columns = computed(() => {
  if (route.name != "workbench") {
    return baseColumns.value.filter((col) => col.name != "experiment");
  }
  return baseColumns.value;
});

const plates = computed(() => props.plates);

const filter = FilterUtils.makeFilter(columns.value);
const filterMethod = FilterUtils.defaultFilterMethod();

const selectedPlate = ref({});
const showPlateContextMenu = ref(false);

const plateContextMenu = (event, row) => {
  selectedPlate.value = row;
  showPlateContextMenu.value = true;
};

const gotoPlateView = (event, row) => {
  console.log(row);
  selectedPlate.value = row;
  if (router.currentRoute.value.name != "workbench") {
    router.push({ name: "plate", params: { plateId: selectedPlate.value.id } });
  }
};

const openNewPlateDialog = () => {
  showNewPlateDialog.value = true;
};

const openNewPlateFromMeasurementsDialog = () => {
  showNewPlateFromMeasDialog.value = true;
};

const loading = ref();

onBeforeMount(() => {
  if (route.name == "workbench") {
    selectedPlates.value = props.selected;
  }
});

onMounted(() => {
  loading.value = false;
});

watch(plates, () => {
  loading.value = false;
});

const selectedPlates = ref([]);
const isSelected = (row) => selectedPlates.value?.includes(row) ?? false;
const updateSelectedPlates = (condition, row) =>
  condition
    ? selectedPlates.value.filter((plate) => plate.id !== row.id)
    : [row];
const selectPlate = (event, row) => {
  selectedPlate.value = row;
  if (event && (event.ctrlKey || event.metaKey)) {
    if (isSelected(row)) {
      selectedPlates.value = updateSelectedPlates(true, row);
    } else {
      selectedPlates.value.push(row);
    }
  } else {
    selectedPlates.value = updateSelectedPlates(isSelected(row), row);
  }
};

watch(selectedPlates, (newVal) => {
  emits("selection", newVal);
});
watch(
  () => props.plates,
  (newVal) => {
    if (newVal) {
      const ids = newVal.map((item) => item.id);
      selectedPlates.value = selectedPlates.value.filter((item) =>
        ids.includes(item.id)
      );
    }
  }
);

const experimentsNames = computed(() =>
  platesToExport.value
    .map(
      (plate) =>
        props.experiments.find((item) => item.id == plate.experimentId).name
    )
    .filter(getUnique)
);

function getUnique(value, index, array) {
  return array.indexOf(value) === index;
}

const loadingHandler = useLoadingHandler();
const plateStore = usePlateStore();
async function deletePlates() {
  await loadingHandler.handleLoadingDuring(
    plateStore
      .deletePlates(selectedPlates.value.map((plate) => plate.id))
      .then(() => {
        emits("updated");
      })
  );
  selectedPlates.value = [];
}

const platesToExport = computed(() =>
  selectedPlates.value.length > 0 ? selectedPlates.value : plates.value
);
const exportFileName = computed(() =>
  experimentsNames.value.length > 1
    ? "selectedPlatesExportList"
    : experimentsNames.value[0]
);

const exportTableData = useExportTableData(columns.value);
const exportToCSV = () => {
  exportTableData.exportToCSV(
    filterMethod(platesToExport.value, filter.value),
    exportFileName.value
  );
};

const exportToXLSX = () => {
  exportTableData.exportToXLSX(
    filterMethod(platesToExport.value, filter.value),
    exportFileName.value
  );
};

const open = (resource) => {
  emits("open", resource);
};
</script>
