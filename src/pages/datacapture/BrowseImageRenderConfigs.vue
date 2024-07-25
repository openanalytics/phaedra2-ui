<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el label="Image Render Configurations" icon="list"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <oa-section title="Image Render Configurations" icon="palette" class="q-pa-sm">
      <generic-table
          :rows="measurementStore.renderConfigs"
          :columns="columns"
          :loading="loading"
          @row-dblclick="gotoImageRenderConfigDetails">
        <template v-slot:top-left>
          <div class="action-button">
            <q-btn size="sm" color="primary" icon="add" label="New..." @click="showNewConfigDialog = true"/>
          </div>
        </template>
        <template v-slot:body-cell-channels="props">
          <q-td :props="props">
            <div class="row">
              <ColorButton class="q-mx-xs" v-for="ch in props.value" :key="ch" :rgb="ch.rgb" :tooltip="ch.name"
                           :editable="false"/>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-menu="props">
          <q-td :props="props">
            <q-btn flat round icon="delete" size="sm" @click="deleteConfig(props.row.id)"/>
          </q-td>
        </template>
      </generic-table>
    </oa-section>
  </q-page>

  <CreateRenderConfigDialog v-model="showNewConfigDialog"/>
  <DeleteRenderConfigDialog v-model="showDeleteConfigDialog" :id="configIdToDelete"/>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import FormatUtils from "@/lib/FormatUtils.js";
import OaSection from "@/components/widgets/OaSection";
import ColorButton from "@/components/image/ColorButton";
import CreateRenderConfigDialog from "@/components/image/CreateRenderConfigDialog";
import DeleteRenderConfigDialog from "@/components/image/DeleteRenderConfigDialog";
import {useMeasurementStore} from "@/stores/measurement";
import GenericTable from "@/components/table/GenericTable.vue";
import {useRouter} from "vue-router";
import {useLoadingHandler} from "@/composable/loadingHandler";

const loadingHandler = useLoadingHandler()
const measurementStore = useMeasurementStore()
onMounted(async () => {
  await loadingHandler.handleLoadingDuring(measurementStore.loadAllRenderConfigs())
})

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'channels', align: 'left', label: 'Channels', field: row => row.config?.channelConfigs, sortable: true},
  {name: 'gamma', align: 'left', label: 'Gamma', field: row => row.config.gamma, sortable: true},
  {name: 'scale', align: 'left', label: 'Scale', field: row => row.config.scale, sortable: true},
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
  {name: 'menu', align: 'left', field: 'menu', sortable: false}
]);

const showNewConfigDialog = ref(false);
const showDeleteConfigDialog = ref(false);
const configIdToDelete = ref(0);
const deleteConfig = (id) => {
  configIdToDelete.value = id;
  showDeleteConfigDialog.value = true;
}

const router = useRouter()
const gotoImageRenderConfigDetails = (e, row) => {
  router.push(`/datacapture/render-config/${row.id}`)
}
</script>
