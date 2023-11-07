<template>
    <q-breadcrumbs class="oa-breadcrumb">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
        <q-breadcrumbs-el icon="list" :label="'Templates'" />
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <div class="q-pa-sm">
            <oa-section title="Plate Layout Templates" icon="border_outer">
                <q-table
                    table-header-class="text-grey"
                    flat dense
                    :rows="templates"
                    :columns="columns"
                    row-key="id"
                    class="full-width"
                    :loading="loading"
                    :pagination="{ rowsPerPage: 20, sortBy: 'name' }"
                    :filter="filter"
                    :filter-method="filterMethod"
                    @row-click="selectTemplate"
                >
                    <template v-slot:top-left>
                        <router-link :to="{ name: 'newPlateTemplate' }" class="nav-link">
                            <q-btn size="sm" icon="add" class="oa-button" label="New Plate Template" />
                        </router-link>
                    </template>
                    <template v-slot:top-right>
                        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
                            <template v-slot:append>
                                <q-icon name="search"/>
                            </template>
                        </q-input>
                    </template>
                    <template v-slot:body-cell-tags="props">
                        <q-td :props="props">
                          <q-badge v-for="tag in props.row.tags" :key="tag" color="green">{{tag}}</q-badge>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-createdBy="props">
                        <q-td :props="props">
                            <UserChip :id="props.row.createdBy" />
                        </q-td>
                    </template>
                </q-table>
            </oa-section>
        </div>
    </q-page>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import FilterUtils from "@/lib/FilterUtils.js"
import FormatUtils from "@/lib/FormatUtils.js"
import templatesGraphQlAPI from '@/api/graphql/templates'

import UserChip from "@/components/widgets/UserChip";
import OaSection from "@/components/widgets/OaSection";

const store = useStore();
const router = useRouter();
const loading = ref();

const templates = ref([])

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
  {name: 'menu', align: 'left', field: 'menu', sortable: false}
]);

const selectTemplate = (event, row) => {
  router.push("/template/" + row.id);
}

const fetchPlateTemplates = () => {
  const {onResult, onError} = templatesGraphQlAPI.templates()
  onResult(({data}) => templates.value = data.plateTemplates)

  //TODO: implement onError event handling
}

const filter = ref('');
const filterMethod = FilterUtils.defaultTableFilter();
</script>
