<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el icon="list" :label="'Templates'"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="Plate Layout Templates" icon="border_outer">
        <generic-table :rows="templates" :columns="columns" @row-click="selectTemplate">
          <template v-slot:top-left>
            <router-link :to="{ name: 'newPlateTemplate' }" class="nav-link">
              <q-btn size="sm" icon="add" class="oa-button" label="New Plate Template"/>
            </router-link>
          </template>
        </generic-table>
      </oa-section>
    </div>
  </q-page>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import FormatUtils from "@/lib/FormatUtils.js"
import templatesGraphQlAPI from '@/api/graphql/templates'

import OaSection from "@/components/widgets/OaSection";
import GenericTable from "@/components/table/GenericTable.vue";
import {useLoadingHandler} from "@/composable/loadingHandler";

const templates = ref([])
const loading = useLoadingHandler()
onMounted(async () => {
  await loading.handleLoadingDuring(fetchPlateTemplates())
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

const router = useRouter();
const selectTemplate = (event, row) => {
  router.push("/template/" + row.id);
}

const fetchPlateTemplates = async () => {
  const {onResult, onError} = templatesGraphQlAPI.templates()
  onResult(({data}) => templates.value = data.plateTemplates)
  //TODO: implement onError event handling
}
</script>
