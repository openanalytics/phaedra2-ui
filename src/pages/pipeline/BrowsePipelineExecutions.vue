<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench' }" />
    <q-breadcrumbs-el label="Pipeline Executions" icon="list" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <oa-section
      title="Pipeline Executions"
      icon="play_circle_outline"
      class="q-pa-sm"
    >
      <oa-table
        :rows="pipelineStore.executions"
        :columns="columns"
        :loading="loading"
        @row-click="gotoPipelineExecutionDetails"
      >
        <template v-slot:top-left>
          <q-btn
            round
            icon="refresh"
            size="sm"
            @click="refreshList"
            class="on-left"
            ><q-tooltip>Refresh</q-tooltip></q-btn
          >
        </template>
        <template v-slot:top-right>
          <date-range-selector
            v-model:from="fromDate"
            v-model:to="toDate"
            @rangeChanged="refreshList"
          />
        </template>
      </oa-table>
    </oa-section>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { date } from "quasar";
import FormatUtils from "@/lib/FormatUtils.js";
import OaSection from "@/components/widgets/OaSection";
import DateRangeSelector from "@/components/widgets/DateRangeSelector";
import { usePipelineStore } from "@/stores/pipeline";
import OaTable from "@/components/table/OaTable.vue";
import { useLoadingHandler } from "../../composable/loadingHandler";

const router = useRouter();
const loading = ref(true);

const pipelineStore = usePipelineStore();
const now = new Date();
const fromDate = ref(date.subtractFromDate(now, { days: 7 }));
const toDate = ref(date.addToDate(now, { days: 1 }));

onMounted(() => {
  refreshList();
});

const loadingHandler = useLoadingHandler();

const refreshList = async () => {
  loading.value = true;
  const dateRange = {
    from: fromDate.value.getTime(),
    to: toDate.value.getTime(),
  };
  await loadingHandler.handleLoadingDuring(
    pipelineStore.loadPipelineExecutions(dateRange)
  );
  await loadingHandler.handleLoadingDuring(
    pipelineStore.loadPipelines(
      pipelineStore.executions.map((e) => e.pipelineId)
    )
  );
  loading.value = false;
};

const columns = ref([
  { name: "id", align: "left", label: "ID", field: "id", sortable: true },
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
  {
    name: "updatedOn",
    align: "left",
    label: "Updated On",
    field: "updatedOn",
    sortable: true,
    format: FormatUtils.formatDate,
  },
  {
    name: "updatedBy",
    align: "left",
    label: "Updated By",
    field: "updatedBy",
    sortable: true,
  },
  {
    name: "pipeline",
    align: "center",
    label: "Pipeline",
    field: "pipelineId",
    format: (v) => pipelineStore.getPipelineById(v)?.name || v,
  },
  {
    name: "currentStep",
    align: "center",
    label: "Current Step",
    field: "currentStep",
    format: (v, e) => {
      let def = pipelineStore.getPipelineById(e.pipelineId);
      let stepName = def?.config?.steps[v - 1]?.action?.type || "";
      let stepCount = def?.config?.steps?.length || "?";
      return `${stepName} (${v} / ${stepCount})`;
    },
  },
  { name: "status", align: "center", label: "Status", field: "status" },
]);

const gotoPipelineExecutionDetails = (e, row) => {
  router.push(`/pipeline-execution/${row.id}`);
};
</script>
