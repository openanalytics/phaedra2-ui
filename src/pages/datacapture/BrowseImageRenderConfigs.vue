<script setup>
import {ref, computed, watch} from 'vue'
import {useStore} from 'vuex'
import FormatUtils from "@/lib/FormatUtils.js"
import OaSection from "@/components/widgets/OaSection";
import UserChip from "@/components/widgets/UserChip";
import ColorButton from "@/components/image/ColorButton";
import CreateRenderConfigDialog from "@/components/image/CreateRenderConfigDialog";
import DeleteRenderConfigDialog from "@/components/image/DeleteRenderConfigDialog";

const store = useStore();
const loading = ref(true);

const configs = computed(() => store.getters['measurements/getRenderConfigs']());
store.dispatch('measurements/loadAllRenderConfigs').then(() => {
  loading.value = false
});

const filteredConfigs = ref([])
const columnFilters = ref({})
const visibleColumns = ref([])

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

const updateVisibleColumns = (columns) => {
  visibleColumns.value = [...columns]
}

const handleColumnFilter = (columnName) => {
  filteredConfigs.value = configs.value.filter(row => String(row[columnName]).includes(columnFilters.value[columnName]))
}

watch(configs, () => {
  visibleColumns.value = [...columns.value.map(a => a.name)];
  filteredConfigs.value = [...configs.value.map(r => r)]

  columns.value.forEach(col => {
    columnFilters.value[col.name] = ref(null)
  })
})
</script>

<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el label="Image Render Configurations" icon="list"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <oa-section title="Image Render Configurations" icon="palette" class="q-pa-sm">
      <q-table
          class="full-width"
          table-header-class="text-grey"
          :rows="filteredConfigs"
          :columns="columns"
          :visible-columns="visibleColumns"
          row-key="id"
          column-key="name"
          :loading="loading"
          :pagination="{ rowsPerPage: 20, sortBy: 'name' }"
          separator="cell"
          flat dense square
      >
        <template v-slot:top-left>
          <div class="action-button">
            <q-btn size="sm" color="primary" icon="add" label="New..." @click="showNewConfigDialog = true"/>
          </div>
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name">
              <q-input v-if="col.name != 'menu'" v-model="columnFilters[col.name]"
                       @update:model-value="handleColumnFilter(col.name)"
                       dense class="filterColumn">
                <template v-slot:append>
                  <q-icon size="xs" name="search"/>
                </template>
              </q-input>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <router-link :to="`/datacapture/render-config/${props.row.id}`" class="nav-link">
              {{ props.row.name }}
            </router-link>
          </q-td>
        </template>
        <template v-slot:body-cell-channels="props">
          <q-td :props="props">
            <div class="row">
              <ColorButton class="q-mx-xs" v-for="ch in props.value" :key="ch" :rgb="ch.rgb" :tooltip="ch.name"
                           :editable="false"/>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-createdBy="props">
          <q-td :props="props">
            <UserChip :id="props.row.createdBy"/>
          </q-td>
        </template>
        <template v-slot:body-cell-menu="props">
          <q-td :props="props">
            <q-btn flat round icon="delete" size="sm" @click="deleteConfig(props.row.id)"/>
          </q-td>
        </template>
      </q-table>
    </oa-section>
  </q-page>

  <CreateRenderConfigDialog v-model="showNewConfigDialog"/>
  <DeleteRenderConfigDialog v-model="showDeleteConfigDialog" :id="configIdToDelete"/>
</template>

<style scoped>
:deep(.filterColumn .q-field__control),
:deep(.filterColumn .q-field__append){
  font-size: 12px;
  height: 25px;
}
</style>
