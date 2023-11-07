<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Measurements'" icon="list"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="Captured Measurements" icon="text_snippet">
        <q-table
            table-header-class="text-grey"
            flat dense
            :rows="measurements"
            :columns="columns"
            row-key="id"
            class="full-width"
            :pagination="{ rowsPerPage: 20, sortBy: 'createdOn', descending: true}"
            :filter="filterValue"
            :filter-method="filterMethod"
            @row-click="(e, row) => router.push('/datacapture/meas/' + row.id)"
            :loading="loading"
        >
          <template v-slot:top-right>
            <div class="row">
              <q-input outlined dense debounce="300" v-model="filterValue" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search"/>
                </template>
              </q-input>
              <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>
            </div>
          </template>
          <template v-slot:body-cell-createdBy="props">
            <q-td :props="props">
              <UserChip :id="props.row.createdBy"/>
            </q-td>
          </template>
        </q-table>
      </oa-section>
    </div>
    <table-config v-model:show="configdialog" v-model:visibleColumns="visibleColumns"
                  v-model:columns="columns"></table-config>
  </q-page>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import FormatUtils from "@/lib/FormatUtils";
import FilterUtils from "@/lib/FilterUtils";
import TableConfig from "@/components/table/TableConfig";
import OaSection from "@/components/widgets/OaSection";
import UserChip from "@/components/widgets/UserChip";

const router = useRouter()
const loading = ref(true);
const store = useStore()

const measurements = computed(() => store.getters['measurements/getAll']() || [])
store.dispatch('measurements/loadAll').then(() => loading.value = false);

const columns = ref([
  {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
  {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
  {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'layout', align: 'left', label: 'Dimensions', field: 'layout', sortable: true, format: (val, row) => row.rows + " x " + row.columns},
  {name: 'wellColumns', align: 'left', label: 'WellData Columns', field: row => (row?.wellColumns?.length || 0), sortable: true},
  {name: 'subWellColumns', align: 'left', label: 'SubwellData Columns', field: row => (row?.subWellColumns?.length || 0), sortable: true},
  {name: 'imageChannels', align: 'left', label: 'Image Channels', field: row => (row?.imageChannels?.length || 0), sortable: true},
])

const visibleColumns = columns.value.map(a => a.name)
const configdialog = ref(false)
const filterMethod = FilterUtils.defaultTableFilter()
const filterValue = ref('')

</script>

<style scoped>
</style>
