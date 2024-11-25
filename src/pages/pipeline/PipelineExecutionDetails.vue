<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="pipelineStore.execution">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard' }" />
    <q-breadcrumbs-el
      label="Pipeline Executions"
      icon="list"
      to="/pipeline-executions"
    />
    <q-breadcrumbs-el
      :label="FormatUtils.formatDate(pipelineStore.execution.createdOn)"
      icon="play_circle_outline"
    />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section
        v-if="!pipelineStore.execution"
        title="Loading..."
        icon="play_circle_outline"
      />
      <oa-section
        v-else
        :title="FormatUtils.formatDate(pipelineStore.execution.createdOn)"
        icon="play_circle_outline"
        :collapsible="true"
      >
        <div class="row q-pa-md">
          <div class="col-2">
            <q-field label="ID" stack-label dense borderless>
              <template v-slot:control>
                {{ pipelineStore.execution.id }}
              </template>
            </q-field>
            <q-field label="Pipeline" stack-label dense borderless>
              <template v-slot:control>
                <router-link
                  :to="'/pipeline/' + pipelineStore.execution.pipelineId"
                >
                  <div class="row items-center cursor-pointer">
                    {{ pipelineStore.pipeline?.name }}
                  </div>
                </router-link>
              </template>
            </q-field>
          </div>
          <div class="col-2">
            <q-field label="Current Step" stack-label dense borderless>
              <template v-slot:control>
                {{ pipelineStore.execution.currentStep }} /
                {{ pipelineStore.pipeline?.config?.steps?.length }}
              </template>
            </q-field>
            <q-field label="Status" stack-label dense borderless>
              <template v-slot:control>
                <StatusLabel :status="pipelineStore.execution.status" />
              </template>
            </q-field>
          </div>
          <div class="col-3">
            <q-field label="Created On" stack-label dense borderless>
              <template v-slot:control>
                {{ FormatUtils.formatDate(pipelineStore.execution.createdOn) }}
              </template>
            </q-field>
            <q-field label="Created By" stack-label dense borderless>
              <template v-slot:control>
                <div class="q-pt-xs">
                  <UserChip :id="pipelineStore.execution.createdBy" />
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-3">
            <q-field label="Updated On" stack-label dense borderless>
              <template v-slot:control>
                {{ FormatUtils.formatDate(pipelineStore.execution.updatedOn) }}
              </template>
            </q-field>
            <q-field label="Updated By" stack-label dense borderless>
              <template v-slot:control>
                <div class="q-pt-xs">
                  <UserChip :id="pipelineStore.execution.updatedBy" />
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-2">
            <div class="row justify-end action-button">
              <q-btn
                size="sm"
                color="negative"
                icon="cancel"
                label="Abort"
                v-if="canCancel"
                @click="showCancelDialog = true"
              />
            </div>
          </div>
        </div>
      </oa-section>

      <oa-section
        title="Event Log"
        icon="event"
        class="q-mt-sm"
        :collapsible="true"
      >
        <div class="row q-pa-md oa-section-body">
          <q-table
            table-header-class="text-grey"
            flat
            dense
            :pagination="{ rowsPerPage: 20 }"
            :rows="pipelineStore.getPipelineExecutionLogById(executionId)"
            :columns="logColumns"
          >
            <template v-slot:body-cell-messageType="props">
              <q-td :props="props">
                <StatusLabel :status="props.row.messageType" />
              </q-td>
            </template>
          </q-table>
        </div>
      </oa-section>

      <oa-section
        title="Execution Variables"
        icon="dataset"
        class="q-mt-sm"
        :collapsible="true"
      >
        <div class="row q-pa-md oa-section-body">
          <q-table
            table-header-class="text-grey"
            style="max-width: 95rem"
            flat
            dense
            :pagination="{ rowsPerPage: 20, sortBy: 'name' }"
            :rows="executionVars"
            :columns="varColumns"
          >
            <template v-slot:body-cell-value="props">
              <q-td :props="props">
                <router-link
                  v-if="props.row[0] == 'measurementId'"
                  :to="'/datacapture/meas/' + props.value"
                >
                  <div class="row items-center cursor-pointer">
                    {{ props.value }}
                  </div>
                </router-link>
                <router-link
                  v-else-if="props.row[0] == 'plateId'"
                  :to="'/plate/' + props.value"
                >
                  <div class="row items-center cursor-pointer">
                    {{ props.value }}
                  </div>
                </router-link>
                <span v-else>{{ props.value }}</span>
              </q-td>
            </template>
          </q-table>
        </div>
      </oa-section>
    </div>
  </q-page>

  <confirm-dialog
    title="Abort Pipeline Execution"
    message="Are you sure you want to abort the execution of this pipeline?"
    v-model:show="showCancelDialog"
    @onConfirm="confirmCancel"
  />
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import FormatUtils from "@/lib/FormatUtils.js";
import UserChip from "@/components/widgets/UserChip";
import ConfirmDialog from "@/components/widgets/ConfirmDialog";
import StatusLabel from "@/components/widgets/StatusLabel";
import OaSection from "@/components/widgets/OaSection";
import { usePipelineStore } from "@/stores/pipeline";

const pipelineStore = usePipelineStore();
const router = useRouter();
const route = useRoute();
const executionId = parseInt(route.params.id);

const loadingHandler = useLoadingHandler();

onMounted(async () => {
  await loadingHandler.handleLoadingDuring(
    pipelineStore.loadPipelineExecutionById(executionId)
  );
});

const canCancel = computed(() => pipelineStore.execution?.status === "RUNNING");
const showCancelDialog = ref(false);
const confirmCancel = async () => {
  await loadingHandler.handleLoadingDuring(
    pipelineStore.cancelPipelineExecution(executionId)
  );
};

const logColumns = ref([
  {
    name: "messageType",
    align: "left",
    label: "",
    field: "messageType",
    sortable: true,
  },
  {
    name: "logDate",
    align: "left",
    label: "Date",
    field: "logDate",
    sortable: true,
    format: FormatUtils.formatDate,
  },
  {
    name: "stepNr",
    align: "left",
    label: "Step",
    field: "stepNr",
    sortable: true,
  },
  {
    name: "message",
    align: "left",
    label: "Message",
    field: "message",
    sortable: true,
  },
]);

const executionVars = computed(() => {
  let vars = JSON.parse(pipelineStore.execution?.variables || "{}");
  return Object.entries(vars);
});

const varColumns = ref([
  {
    name: "name",
    align: "left",
    label: "Name",
    field: (row) => row[0],
    sortable: true,
  },
  { name: "value", align: "left", label: "Value", field: (row) => row[1] },
]);
</script>
