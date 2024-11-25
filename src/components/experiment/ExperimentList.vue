<template>
  <oa-table
    :columns="columns"
    :rows="experiments"
    @row-click="selectExperiment"
    @row-dblclick="gotoExperimentView"
    @row-contextmenu="experimentContextMenu"
    selection="multiple"
    v-model:selected="selectedExperiments"
  >
    <template v-slot:top-right>
      <div class="row action-button on-left">
        <q-btn
          round
          size="sm"
          color="primary"
          icon="add"
          @click="showNewExperimentDialog = true"
          :disable="!createExperimentCondition"
          ><q-tooltip
            >Create New Experiment
            <span v-if="!createExperimentCondition"
              >(You need to select at least 1 project)</span
            ></q-tooltip
          >
        </q-btn>
        <q-btn round icon="download" size="sm" class="q-mx-sm">
          <q-tooltip>Download experiments list</q-tooltip>
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
      </div>
    </template>
    <template v-slot:body-cell-name="props">
      <q-td :props="props">
        <div class="row items-center cursor-pointer">
          <q-icon name="science" size="xs" class="icon q-pr-sm" />
          {{ props.row.name }}
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-nrPlatesLinkedLayout="props">
      <q-td :props="props">
        <ProgressBarField
          :actualValue="props.row.summary?.nrPlatesLinkedLayout"
          :maxValue="props.row.summary?.nrPlates"
        />
      </q-td>
    </template>
    <template v-slot:body-cell-nrPlatesCalculated="props">
      <q-td :props="props">
        <ProgressBarField
          :actualValue="props.row.summary?.nrPlatesCalculated"
          :maxValue="props.row.summary?.nrPlates"
        />
      </q-td>
    </template>
    <template v-slot:body-cell-nrPlatesValidated="props">
      <q-td :props="props">
        <ProgressBarField
          :actualValue="props.row.summary?.nrPlatesValidated"
          :maxValue="props.row.summary?.nrPlates"
        />
      </q-td>
    </template>
    <template v-slot:body-cell-nrPlatesApproved="props">
      <q-td :props="props">
        <ProgressBarField
          :actualValue="props.row.summary?.nrPlatesApproved"
          :maxValue="props.row.summary?.nrPlates"
        />
      </q-td>
    </template>
    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <div class="row" style="justify-content: center">
          <q-icon name="lock" v-if="props.row.status === 'CLOSED'">
            <template v-slot:default>
              <q-tooltip>CLOSED</q-tooltip>
            </template>
          </q-icon>
          <q-icon name="lock_open" v-if="props.row.status === 'OPEN'">
            <template v-slot:default>
              <q-tooltip>OPEN</q-tooltip>
            </template>
          </q-icon>
        </div>
      </q-td>
    </template>
    <template v-slot:no-data>
      <div class="full-width row text-info">
        <span>No experiments to show.</span>
      </div>
    </template>
  </oa-table>
  <ExperimentMenu
    touch-position
    @onDeleteExperiment="deleteExperiments"
    @open="open"
    @updated="updated"
    :experiments="selectedExperiments"
  />

  <q-dialog v-model="showNewExperimentDialog">
    <q-card style="min-width: 30vw">
      <q-card-section
        class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary"
      >
        Create New Experiment
      </q-card-section>
      <q-card-section>
        <q-select
          class="q-pa-xs"
          v-model="newExperimentProject"
          :options="projects"
          label="project"
          option-value="id"
          option-label="name"
          dense
        />
        <q-input
          dense
          v-model="newExperimentName"
          autofocus
          label="experiment name"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          label="Create"
          color="primary"
          v-close-popup
          @click="doCreateNewExperiment"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch, onBeforeMount } from "vue";

import ProgressBarField from "@/components/widgets/ProgressBarField";
import ExperimentMenu from "@/components/experiment/ExperimentMenu";

import FormatUtils from "@/lib/FormatUtils.js";
import FilterUtils from "@/lib/FilterUtils";
import { useExportTableData } from "@/composable/exportTableData";
import { useRoute, useRouter } from "vue-router";
import { useProjectStore } from "@/stores/project";
import OaTable from "@/components/table/OaTable.vue";
import { useExperimentStore } from "@/stores/experiment";
import { useLoadingHandler } from "@/composable/loadingHandler";

const props = defineProps({
  experiments: [Object],
  projects: [Object],
  selected: [Object],
});
const emits = defineEmits([
  "createNewExperiment",
  "selection",
  "updated",
  "open",
]);

const router = useRouter();

const baseColumns = ref([
  {
    name: "id",
    align: "left",
    label: "ID",
    field: "id",
    sortable: true,
    description: "The experiment id",
  },
  {
    name: "project",
    align: "left",
    label: "Project",
    field: (row) => row.project.name,
    sortable: true,
    description: "The project name",
  },
  {
    name: "name",
    align: "left",
    label: "Name",
    field: "name",
    sortable: true,
    description: "The experiment name",
  },
  {
    name: "description",
    align: "left",
    label: "Description",
    field: "description",
    sortable: true,
    description: "The experiment description",
  },
  {
    name: "nrPlates",
    align: "left",
    label: "Plates",
    field: (row) => row.summary?.nrPlates ?? 0,
    sortable: true,
    description: "Total nr of plates",
  },
  {
    name: "nrPlatesLinkedLayout",
    align: "left",
    label: "Linked",
    field: (row) => row.summary?.nrPlatesLinkedLayout ?? 0,
    sortable: true,
    description: "Nr of plates with layout",
  },
  {
    name: "nrPlatesCalculated",
    align: "left",
    label: "Calculated",
    field: (row) => row.summary?.nrPlatesCalculated ?? 0,
    sortable: true,
    description: "Nr of calculated plates",
  },
  {
    name: "nrPlatesValidated",
    align: "left",
    label: "Validated",
    field: (row) => row.summary?.nrPlatesValidated ?? 0,
    sortable: true,
    description: "Nr of validated plates",
  },
  {
    name: "nrPlatesApproved",
    align: "left",
    label: "Approved",
    field: (row) => row.summary?.nrPlatesApproved ?? 0,
    sortable: true,
    description: "Nr of approved plates",
  },
  {
    name: "tags",
    align: "left",
    label: "Tags",
    field: "tags",
    sortable: true,
    description: "The experiment tags",
  },
  {
    name: "createdOn",
    align: "left",
    label: "Created On",
    field: "createdOn",
    sortable: true,
    format: FormatUtils.formatDate,
    description: "Created on date",
  },
  {
    name: "createdBy",
    align: "left",
    label: "Created By",
    field: "createdBy",
    sortable: true,
    description: "Created by user",
  },
  {
    name: "status",
    align: "center",
    label: "Status",
    field: "status",
    sortable: true,
    description: "Open or closed",
  },
]);
const route = useRoute();

const columns = computed(() => {
  if (route.name != "workbench") {
    return baseColumns.value.filter((col) => col.name != "project");
  }
  return baseColumns.value;
});

const experiments = computed(() =>
  props.experiments ? props.experiments : []
);

const createExperimentCondition = computed(() => props.projects.length > 0);

const projectsNames = computed(() =>
  experimentsToExport.value
    .map(
      (experiment) =>
        props.projects.find((item) => item.id == experiment.projectId).name
    )
    .filter(getUnique)
);

const filter = FilterUtils.makeFilter(columns.value);
const filterMethod = FilterUtils.defaultFilterMethod();

const selectedExperiment = ref({});
const showExperimentContextMenu = ref(false);
const experimentContextMenu = (event, row) => {
  showExperimentContextMenu.value = true;
};

const gotoExperimentView = (event, row) => {
  selectedExperiment.value = row;
  if (router.currentRoute.value.name != "workbench") {
    router.push({ name: "experiment", params: { experimentId: row.id } });
  }
};

const showNewExperimentDialog = ref(false);
const newExperimentName = ref("");
const newExperimentProject = ref(props.projects[0]);
watch(
  () => props.projects,
  (newVal) => {
    if (newVal.length > 0) {
      newExperimentProject.value = newVal[0];
    }
  }
);

const doCreateNewExperiment = async () => {
  const newExperiment = {
    projectId: newExperimentProject.value.id,
    name: newExperimentName.value,
    status: "OPEN",
    createdOn: new Date(),
  };
  await loadingHandler.handleLoadingDuring(createNewExperiment(newExperiment));
};

const loading = ref();
watch(experiments, () => {
  loading.value = false;
});

const selectedExperiments = ref([]);
const isSelected = (row) => selectedExperiments.value.includes(row);
const updateSelectedExperiments = (condition, row) =>
  condition
    ? selectedExperiments.value.filter((experiment) => experiment.id !== row.id)
    : [row];
const selectExperiment = (event, row) => {
  selectedExperiment.value = row;
  if (event && (event.ctrlKey || event.metaKey)) {
    if (isSelected(row)) {
      selectedExperiments.value = updateSelectedExperiments(true, row);
    } else {
      selectedExperiments.value.push(row);
    }
  } else {
    selectedExperiments.value = updateSelectedExperiments(isSelected(row), row);
  }
};
watch(selectedExperiments, (newVal) => {
  emits("selection", newVal);
});
watch(
  () => props.experiments,
  (newVal) => {
    const ids = newVal.map((item) => item.id);
    selectedExperiments.value = selectedExperiments.value.filter((item) =>
      ids.includes(item.id)
    );
  }
);

const showConfigDialog = ref(false);
const experimentsToExport = computed(() =>
  selectedExperiments.value.length > 0
    ? selectedExperiments.value
    : experiments.value
);
const exportFileName = computed(() =>
  projectsNames.value.length > 1
    ? "selectedExperimentExportList"
    : projectsNames.value[0]
);

const exportTableData = useExportTableData(columns.value);
const exportToCSV = () => {
  exportTableData.exportToCSV(
    filterMethod(experimentsToExport.value, filter.value),
    exportFileName.value
  );
};

const exportToXLSX = () => {
  exportTableData.exportToXLSX(
    filterMethod(experimentsToExport.value, filter.value),
    exportFileName.value
  );
};

function getUnique(value, index, array) {
  return array.indexOf(value) === index;
}
const experimentStore = useExperimentStore();
const loadingHandler = useLoadingHandler();
const deleteExperiments = async () => {
  await loadingHandler.handleLoadingDuring(
    experimentStore
      .deleteExperiments(selectedExperiments.value.map((exp) => exp.id))
      .then(() => {
        selectedExperiments.value = [];
      })
  );
};

const projectStore = useProjectStore();
const createNewExperiment = async (newExperiment) => {
  await loadingHandler.handleLoadingDuring(
    projectStore.addExperiment(newExperiment).then(() => {
      updated();
    })
  );
};

function updated() {
  emits("updated");
}

onBeforeMount(() => {
  if (route.name == "workbench") {
    selectedExperiments.value = props.selected;
  }
});

const open = (resource) => {
  emits("open", resource);
};
</script>

<style scoped>
.nav-link {
  color: black;
  text-decoration: none;
}
</style>
