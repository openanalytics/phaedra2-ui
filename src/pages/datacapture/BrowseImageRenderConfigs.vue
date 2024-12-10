<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench' }" />
    <q-breadcrumbs-el label="Image Render Configurations" icon="list" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <oa-section title="Image Render Configurations" icon="palette" class="q-pa-sm">
      <oa-table :rows="measurementStore.renderConfigs" :columns="columns"
                @row-dblclick="gotoImageRenderConfigDetails">
        <template v-slot:top-right>
          <div class="action-button">
            <q-btn round size="sm" color="primary" icon="add" @click="showNewConfigDialog = true">
              <q-tooltip>New</q-tooltip>
            </q-btn>
          </div>
        </template>
        <template v-slot:body-cell-channels="props">
          <q-td :props="props">
            <div class="row">
              <ColorButton class="q-mx-xs" v-for="ch in props.value"
                           :key="ch" :rgb="ch.rgb" :tooltip="ch.name" :editable="false"/>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-menu="props">
          <q-td :props="props">
            <q-btn size="sm" icon="delete" color="negative"
                   @click="deleteConfig(props.row)" round dense/>
          </q-td>
        </template>
      </oa-table>
    </oa-section>
  </q-page>

  <CreateRenderConfigDialog v-model="showNewConfigDialog" />
  <delete-dialog v-model:show="showDeleteConfigDialog"
                 :id="configToDelete?.id" :name="configToDelete?.name"
                 :objectClass="'render config'" @onDeleted="onDeleteExperiment"/>
</template>

<script setup>
import { ref} from "vue";
import FormatUtils from "@/lib/FormatUtils.js";
import OaSection from "@/components/widgets/OaSection";
import ColorButton from "@/components/image/ColorButton";
import CreateRenderConfigDialog from "@/components/image/CreateRenderConfigDialog";
import { useMeasurementStore } from "@/stores/measurement";
import OaTable from "@/components/table/OaTable.vue";
import { useRouter } from "vue-router";
import { useLoadingHandler } from "@/composable/loadingHandler";
import DeleteDialog from "@/components/widgets/DeleteDialog.vue";


const measurementStore = useMeasurementStore();
const fetchAllRenderConfigs = async () => {
  await measurementStore.loadAllRenderConfigs();
}

const loadingHandler = useLoadingHandler();
loadingHandler.handleLoadingDuring(fetchAllRenderConfigs());

const columns = ref([
  { name: "id", align: "left", label: "ID", field: "id", sortable: true },
  { name: "name", align: "left", label: "Name", field: "name", sortable: true },
  {
    name: "channels",
    align: "left",
    label: "Channels",
    field: (row) => row.config?.channelConfigs,
    sortable: true,
  },
  {
    name: "gamma",
    align: "left",
    label: "Gamma",
    field: (row) => row.config.gamma,
    sortable: true,
  },
  {
    name: "scale",
    align: "left",
    label: "Scale",
    field: (row) => row.config.scale,
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
  { name: "menu", align: "left", field: "menu", sortable: false },
]);

const showNewConfigDialog = ref(false);
const showDeleteConfigDialog = ref(false);
const configToDelete = ref(null);
const deleteConfig = (config) => {
  configToDelete.value = config;
  showDeleteConfigDialog.value = true;
};

const router = useRouter();
const gotoImageRenderConfigDetails = (e, row) => {
  router.push(`/datacapture/render-config/${row.id}`);
};

const onDeleteExperiment = () => {
  measurementStore.deleteRenderConfig(configToDelete.value.id);
};
</script>
