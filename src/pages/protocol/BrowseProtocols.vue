<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el :label="'Protocols'" icon="list"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="Protocols" icon="ballot">
        <q-table
            class="full-width"
            table-header-class="text-grey"
            :rows="protocols"
            :columns="columns"
            :visible-columns="visibleColumns"
            :filter="filter"
            :filter-method="filterMethod"
            row-key="id"
            column-key="name"
            :pagination="{ rowsPerPage: 20, sortBy: 'name' }"
            :loading="loading"
            @row-click="selectProtocol"
            separator="cell"
            flat square dense
        >
          <template v-slot:top-left>
            <router-link :to="{ name: 'newProtocol' }" class="nav-link">
              <q-btn size="sm" icon="add" color="primary" label="New Protocol..."/>
            </router-link>
          </template>
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{col.label}}
              </q-th>
            </q-tr>
            <q-tr :props="props">
              <column-filter v-for="col in props.cols" :key="col.name" v-model="filter[col.name]"/>
            </q-tr>
          </template>
          <template v-slot:body-cell-createdBy="props">
            <q-td :props="props">
              <UserChip :id="props.row.createdBy" />
            </q-td>
          </template>
          <template v-slot:body-cell-tags="props">
            <q-td :props="props">
              <q-badge v-for="tag in props.row.tags" :key="tag" color="green">{{tag}}</q-badge>
            </q-td>
          </template>
        </q-table>
      </oa-section>
    </div>
  </q-page>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import FormatUtils from "@/lib/FormatUtils.js"
import FilterUtils from "@/lib/FilterUtils.js"

import UserChip from "@/components/widgets/UserChip";
import OaSection from "@/components/widgets/OaSection";
import ColumnFilter from "@/components/table/ColumnFilter";

const store = useStore();
const router = useRouter();

const loading = ref(true);

const protocols = computed(() => store.getters['protocols/getAll']());
store.dispatch('protocols/loadAll').then(() => {
  loading.value = false
})

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true},
  {
    name: 'createdOn',
    align: 'left',
    label: 'Created On',
    field: 'createdOn',
    sortable: true,
    format: FormatUtils.formatDate
  },
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
  // {name: 'menu', align: 'left', field: 'menu', sortable: false}
])

const filter = FilterUtils.makeFilter(columns.value);
const filterMethod = FilterUtils.defaultFilterMethod();
const visibleColumns = ref([])

const selectProtocol = (event, row) => {
  router.push("/protocol/" + row.id);
}

const updateVisibleColumns = (columns) => {
  visibleColumns.value = [...columns]
}

watch(protocols, () => {
  visibleColumns.value = [...columns.value.map(a => a.name)];
  loading.value = false
})
</script>
