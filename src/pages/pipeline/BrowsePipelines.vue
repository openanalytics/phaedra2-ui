<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el label="Pipelines" icon="list"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <oa-section title="Pipelines" icon="route" class="q-pa-sm">
      <q-table
          table-header-class="text-grey"
          class="full-width"
          :rows="pipelineStore.pipelines"
          :columns="columns"
          row-key="id"
          column-key="name"
          :filter="filter"
          :filter-method="filterMethod"
          :pagination="{ rowsPerPage: 20, sortBy: 'name' }"
          :loading="loading"
          @row-click="(e, row) => router.push('/pipeline/' + row.id)"
          separator="cell"
          flat dense square
      >
        <template v-slot:top-left>
          <q-btn color="primary" icon="add" size="sm" label="New Pipeline..." @click="router.push('/pipeline/new')"/>
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
            <router-link :to="'/pipeline/' + props.row.id" class="nav-link">
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
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <StatusLabel :status="props.row.status"/>
          </q-td>
        </template>
      </q-table>
    </oa-section>
  </q-page>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from "vue-router";
import FilterUtils from "@/lib/FilterUtils.js"
import FormatUtils from "@/lib/FormatUtils.js"
import UserChip from "@/components/widgets/UserChip";
import StatusLabel from "@/components/widgets/StatusLabel";
import OaSection from "@/components/widgets/OaSection";
import ColumnFilter from "@/components/table/ColumnFilter";
import {usePipelineStore} from "@/stores/pipeline";

const router = useRouter();
const loading = ref(true);

const pipelineStore = usePipelineStore()
onMounted(() => {
  pipelineStore.loadAllPipelines().then(() => loading.value = false)
})

const columns = ref([
    {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
    {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
    {name: 'version', align: 'left', label: 'Version', field: 'versionNumber', sortable: true},
    {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
    {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
    {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
    {name: 'updatedOn', align: 'left', label: 'Updated On', field: 'updatedOn', sortable: true, format: FormatUtils.formatDate},
    {name: 'updatedBy', align: 'left', label: 'Updated By', field: 'updatedBy', sortable: true},
    {name: 'status', align: 'center', label: 'Status', field: 'status'},
]);

const filter = FilterUtils.makeFilter(columns.value);
const filterMethod = FilterUtils.defaultFilterMethod();
</script>
