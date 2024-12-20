<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench' }" />
    <q-breadcrumbs-el label="Capture Configurations" icon="settings" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <oa-section title="Capture Configurations" icon="settings" class="q-pa-sm">
      <oa-table
        :rows="configs"
        :columns="columns"
        @row-dblclick="gotoCaptureConfigView"
      >
        <template v-slot:top-right>
          <q-btn
            round
            size="sm"
            color="primary"
            icon="add"
            @click="router.push('/datacapture/config/new')"
            ><q-tooltip>New Config...</q-tooltip></q-btn
          >
        </template>
        <template v-slot:no-data>
          <div class="full-width row text-info">
            <span>No Capture Configurations to show.</span>
          </div>
        </template>
      </oa-table>
    </oa-section>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import FormatUtils from "@/lib/FormatUtils.js";
import OaSection from "@/components/widgets/OaSection";
import OaTable from "@/components/table/OaTable.vue";

const store = useStore();
const loading = ref(true);

const configs = computed(() =>
  store.getters["datacapture/getAllCaptureConfigs"]()
);
store.dispatch("datacapture/loadAllCaptureConfigs").then(() => {
  loading.value = false;
});

const columns = ref([
  { name: "id", align: "left", label: "ID", field: "id", sortable: true },
  { name: "name", align: "left", label: "Name", field: "name", sortable: true },
  {
    name: "version",
    align: "left",
    label: "Version",
    field: "version",
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
]);

const router = useRouter();
const gotoCaptureConfigView = (e, row) => {
  router.push(`/datacapture/config/${row.id}`);
};
</script>
