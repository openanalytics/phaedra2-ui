<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el icon="list" :label="'Templates'"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="Plate Layout Templates" icon="border_outer">
        <q-table
            table-header-class="text-grey"
            class="full-width"
            :rows="templates"
            :columns="columns"
            :visible-columns="visibleColumns"
            row-key="id"
            column-key="name"
            :filter="filter"
            :filter-method="filterMethod"
            :loading="loading"
            :pagination="{ rowsPerPage: 20, sortBy: 'name' }"
            @row-click="selectTemplate"
            separator="cell"
            flat square dense
        >
          <template v-slot:top-left>
            <router-link :to="{ name: 'newPlateTemplate' }" class="nav-link">
              <q-btn size="sm" icon="add" class="oa-button" label="New Plate Template"/>
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
          <template v-slot:body-cell-tags="props">
            <q-td :props="props">
              <tag-list :tags="props.row.tags" :readOnly="true" />
            </q-td>
          </template>
          <template v-slot:body-cell-createdBy="props">
            <q-td :props="props">
              <UserChip :id="props.row.createdBy"/>
            </q-td>
          </template>
        </q-table>
      </oa-section>
    </div>
  </q-page>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import FormatUtils from "@/lib/FormatUtils.js"
import FilterUtils from "@/lib/FilterUtils.js"
import templatesGraphQlAPI from '@/api/graphql/templates'

import UserChip from "@/components/widgets/UserChip";
import OaSection from "@/components/widgets/OaSection";
import ColumnFilter from "@/components/table/ColumnFilter";
import TagList from "@/components/tag/TagList";

const router = useRouter();
const loading = ref();

const templates = ref([])
const visibleColumns = ref([])

onMounted(() => {
  fetchPlateTemplates()
})

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'dimensions', align: 'left', label: 'Dimensions', sortable: true, field: t => `${t.rows} x ${t.columns}`},
  {name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true},
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
  {name: 'updatedOn', align: 'left', label: 'Updated On', field: 'updatedOn', sortable: true, format: FormatUtils.formatDate},
  {name: 'updatedBy', align: 'left', label: 'Updated By', field: 'updatedBy', sortable: true}
]);

const filter = FilterUtils.makeFilter(columns.value);
const filterMethod = FilterUtils.defaultFilterMethod();

const selectTemplate = (event, row) => {
  router.push("/template/" + row.id);
}

const fetchPlateTemplates = () => {
  const {onResult, onError} = templatesGraphQlAPI.templates()
  onResult(({data}) => templates.value = data.plateTemplates)

  //TODO: implement onError event handling
}

const updateVisibleColumns = (columns) => {
  visibleColumns.value = [...columns]
}

watch(templates, () => {
  visibleColumns.value = [...columns.value.map(a => a.name)];
  loading.value = false
})
</script>
