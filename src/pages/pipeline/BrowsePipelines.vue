<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard' }" />
    <q-breadcrumbs-el label="Pipelines" icon="list" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <oa-section title="Pipelines" icon="route" class="q-pa-sm">
      <oa-table
        :rows="pipelineStore.pipelines"
        :columns="columns"
        @row-dblclick="gotoPipelineDetails"
      >
        <template v-slot:top-right>
          <q-btn
            round
            size="sm"
            color="primary"
            icon="add"
            @click="router.push('/pipeline/new')"
            ><q-tooltip>Create Pipeline</q-tooltip></q-btn
          >
        </template>
      </oa-table>
    </oa-section>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import FormatUtils from "@/lib/FormatUtils.js";
import OaSection from "@/components/widgets/OaSection";
import { usePipelineStore } from "@/stores/pipeline";
import OaTable from "@/components/table/OaTable.vue";
import { useLoadingHandler } from "@/composable/loadingHandler";

const pipelineStore = usePipelineStore();
const loading = useLoadingHandler();
onMounted(async () => {
  await loading.handleLoadingDuring(pipelineStore.loadAllPipelines());
});

const columns = ref([
  { name: "id", align: "left", label: "ID", field: "id", sortable: true },
  { name: "name", align: "left", label: "Name", field: "name", sortable: true },
  {
    name: "version",
    align: "left",
    label: "Version",
    field: "versionNumber",
    sortable: true,
  },
  {
    name: "description",
    align: "left",
    label: "Description",
    field: "description",
    sortable: true,
  },
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
  { name: "status", align: "center", label: "Status", field: "status" },
]);

const router = useRouter();
const gotoPipelineDetails = (e, row) => {
  router.push(`/pipeline/${row.id}`);
};
</script>
