<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench' }" />
    <q-breadcrumbs-el :label="'Protocols'" icon="list" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="Protocols" icon="ballot">
        <oa-table
          :rows="protocolStore.protocols"
          :columns="columns"
          @row-dblclick="gotoProtocolView"
        >
          <template v-slot:top-right>
            <div class="row action-button on-left">
              <router-link :to="{ name: 'newProtocol' }" class="nav-link">
                <q-btn round size="sm" color="primary" icon="add">
                  <q-tooltip>Protocol...</q-tooltip></q-btn
                >
              </router-link>
            </div>
          </template>
        </oa-table>
      </oa-section>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import FormatUtils from "@/lib/FormatUtils.js";

import OaSection from "@/components/widgets/OaSection";
import { useProtocolStore } from "@/stores/protocol";
import OaTable from "@/components/table/OaTable.vue";
import { useLoadingHandler } from "@/composable/loadingHandler";

const protocolStore = useProtocolStore();
const router = useRouter();

onMounted(() => {
  fetchAllProtocols();
});

const loadingHandler = useLoadingHandler();
const fetchAllProtocols = async () => {
  await loadingHandler.handleLoadingDuring(protocolStore.loadAllProtocols());
};

const columns = ref([
  { name: "id", align: "left", label: "ID", field: "id", sortable: true },
  { name: "name", align: "left", label: "Name", field: "name", sortable: true },
  {
    name: "description",
    align: "left",
    label: "Description",
    field: "description",
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

const gotoProtocolView = (event, row) => {
  router.push("/protocol/" + row.id);
};
</script>
