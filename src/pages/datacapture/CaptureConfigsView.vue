<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el label="Capture Configurations" icon="settings"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <oa-section title="Capture Configurations" icon="settings" class="q-pa-md">
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
          <q-btn color="primary" icon="add" size="sm" label="New Config..."
                 @click="router.push('/datacapture/config/new')"/>
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
                       dense>
                <template v-slot:append>
                  <q-icon size="xs" name="search"/>
                </template>
              </q-input>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <router-link :to="'/datacapture/config/' + props.row.id" class="nav-link">
              <div class="row items-center cursor-pointer">
                {{ props.row.name }}
              </div>
            </router-link>
          </q-td>
        </template>
        <template v-slot:body-cell-createdBy="props">
          <q-td :props="props">
            <UserChip :id="props.row.createdBy"/>
          </q-td>
        </template>
        <template v-slot:body-cell-updatedBy="props">
          <q-td :props="props">
            <UserChip :id="props.row.updatedBy"/>
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="full-width row text-info">
            <span>No Capture Configurations to show.</span>
          </div>
        </template>
      </q-table>
    </oa-section>
  </q-page>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router';
import FormatUtils from "@/lib/FormatUtils.js"
import OaSection from "@/components/widgets/OaSection";
import UserChip from "@/components/widgets/UserChip";

const store = useStore();
const router = useRouter();
const loading = ref(true);

const configs = computed(() => store.getters['datacapture/getAllCaptureConfigs']());
store.dispatch('datacapture/loadAllCaptureConfigs').then(() => {
  loading.value = false
});

const filteredConfigs = ref([])
const columnFilters = ref({})
const visibleColumns = ref([])

const columns = ref([
    {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
    {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
    {name: 'version', align: 'left', label: 'Version', field: 'version', sortable: true},
    {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
    {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate },
    {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
    {name: 'updatedOn', align: 'left', label: 'Updated On', field: 'updatedOn', sortable: true, format: FormatUtils.formatDate},
    {name: 'updatedBy', align: 'left', label: 'Updated By', field: 'updatedBy', sortable: true},
]);

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
