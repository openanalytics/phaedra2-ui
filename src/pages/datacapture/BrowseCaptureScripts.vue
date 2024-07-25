<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el label="Capture Scripts" icon="data_object"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <oa-section title="Capture Scripts" icon="data_object" class="q-pa-sm">
      <generic-table
          :rows="scripts"
          :columns="columns"
          :loading="loading"
          @row-dblclick="gotoCaptureScriptView">
        <template v-slot:top-left>
          <q-btn color="primary" icon="add" size="sm" label="New Script..."
                 @click="router.push('/datacapture/script/new')"/>
        </template>
        <template v-slot:no-data>
          <div class="full-width row text-info">
            <span>No Capture Scripts to show.</span>
          </div>
        </template>
      </generic-table>
    </oa-section>
  </q-page>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router';
import FormatUtils from "@/lib/FormatUtils.js"
import OaSection from "@/components/widgets/OaSection";
import GenericTable from "@/components/table/GenericTable.vue";

const store = useStore();
const loading = ref(true);

const scripts = computed(() => store.getters['datacapture/getAllCaptureScripts']());
store.dispatch('datacapture/loadAllCaptureScripts').then(() => { loading.value = false });

const columns = ref([
    {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
    {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
    {name: 'version', align: 'left', label: 'Version', field: 'version', sortable: true},
    {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
    {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate },
    {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
    {name: 'updatedOn', align: 'left', label: 'Updated On', field: 'updatedOn', sortable: true, format: FormatUtils.formatDate},
    {name: 'updatedBy', align: 'left', label: 'Updated By', field: 'updatedBy', sortable: true},
])

const router = useRouter();
const gotoCaptureScriptView = (e, row) => {
  router.push(`/datacapture/script/${row.id}`)
}
</script>
