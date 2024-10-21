<template>
  <oa-table
    :columns="columns"
    :rows="plates"
    :visible-columns="visibleColumns"
    @row-click="selectPlate"
    @row-dblclick="gotoPlateView"
    @row-contextmenu="plateContextMenu"
    selection="multiple"
    v-model:selected="selectedPlates"
  >
    <template v-slot:top-left v-if="experiment && experiment.status === 'OPEN'">
      <q-btn size="sm" icon="add" label="New Plate" class="oa-button">
        <q-menu>
          <q-list size="sm" dense>
            <q-item
              clickable
              v-close-popup
              v-ripple
              class="oa-button"
              @click="openNewPlateDialog"
            >
              <q-item-section no-wrap>
                <div style="vertical-align: center">
                  <q-icon name="add" class="q-pr-md" />
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
              class="oa-button"
              @click="openNewPlateFromMeasurementsDialog"
            >
              <q-item-section no-wrap class="row">
                <div>
                  <q-icon name="add" class="q-pr-md" />
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
    </template>
    <template v-slot:top-right>
      <q-btn-dropdown size="sm" class="oa-button q-mr-md" label="Export">
        <q-list dense>
          <q-item clickable v-close-popup @click="exportToCSV">
            <q-item-section>
              <q-item-label>Export to CSV</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="exportToXLSX">
            <q-item-section>
              <q-item-label>Export to Excel</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
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
  <PlateActionMenu :plate="selectedPlate" touch-position @open="open" />
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
  "opens"
]);

const router = useRouter();

const columns = [
  { name: "id", align: "left", label: "ID", field: "id", sortable: true },
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
];

const experiment = computed(() => props.experiments);
const plates = computed(() => props.plates);

const filter = FilterUtils.makeFilter(columns);
const filterMethod = FilterUtils.defaultFilterMethod();

const selectedPlate = ref({});
const showPlateContextMenu = ref(false);

const plateContextMenu = (event, row) => {
  selectedPlate.value = row;
  showPlateContextMenu.value = true;
};

const gotoPlateView = (event, row) => {
  selectedPlate.value = row;
  router.push({ name: "plate", params: { plateId: selectedPlate.value.id } });
};

const openNewPlateDialog = () => {
  emits("update:newPlateTab", true);
};

const openNewPlateFromMeasurementsDialog = () => {
  emits("update:newPlateFromMeasurements", true);
};

const loading = ref();
const visibleColumns = ref([]);

const route = useRoute();

onBeforeMount(() => {
  if (route.name == "workbench") {
    selectedPlates.value = props.selected;
  }
});

onMounted(() => {
  visibleColumns.value = [...columns.map((a) => a.name)];
  loading.value = false;
});

watch(plates, () => {
  visibleColumns.value = [...columns.map((a) => a.name)];
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
    const ids = newVal.map((item) => item.id);
    selectedPlates.value = selectedPlates.value.filter((item) =>
      ids.includes(item.id)
    );
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

const platesToExport = computed(() =>
  selectedPlates.value.length > 0 ? selectedPlates.value : plates.value
);
const exportFileName = computed(() =>
  experimentsNames.value.length > 1
    ? "selectedPlatesExportList"
    : experimentsNames.value[0]
);

const exportTableData = useExportTableData(columns);
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
  emits("opens", resource);
}
</script>
