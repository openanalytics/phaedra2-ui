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
          :rows="configs"
          :columns="columns"
          :visible-columns="visibleColumns"
          :filter="filter"
          :filter-method="filterMethod"
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
            <column-filter v-for="col in props.cols" :key="col.name" v-model="filter[col.name]"/>
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
import FilterUtils from "@/lib/FilterUtils.js"
import OaSection from "@/components/widgets/OaSection";
import UserChip from "@/components/widgets/UserChip";
import ColumnFilter from "@/components/table/ColumnFilter";

const store = useStore();
const router = useRouter();
const loading = ref(true);

const configs = computed(() => store.getters['datacapture/getAllCaptureConfigs']());
store.dispatch('datacapture/loadAllCaptureConfigs').then(() => {
  loading.value = false
});

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

const filter = FilterUtils.makeFilter(columns.value);
const filterMethod = FilterUtils.defaultFilterMethod();

const updateVisibleColumns = (columns) => {
  visibleColumns.value = [...columns]
}

watch(configs, () => {
  visibleColumns.value = [...columns.value.map(a => a.name)];
})
</script>
