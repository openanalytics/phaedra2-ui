<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import FormatUtils from "../../lib/FormatUtils";
import StatusLabel from "@/components/widgets/StatusLabel"
import ResultSetDetailsPanel from "@/components/resultdata/ResultSetDetailsPanel";
import {usePlateStore} from "@/stores/plate";

const props = defineProps({ plate: Object });
const loading = ref(true);
const plateStore = usePlateStore()
loading.value = false

// Details panel
const showResultSetDetails = ref(false);
const resultSetDetails = ref(null);
const doShowDetails = (rs) => {
  resultSetDetails.value = rs;
  showResultSetDetails.value = true;
};

const resultSets = ref([])

onMounted(() => {
  resultSets.value = plateStore.resultSets
})

const columns = ref([
  { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
  { name: 'calculatedOn', align: 'left', label: 'Calculated On', field: 'executionStartTimeStamp', sortable: true, format: FormatUtils.formatDate },
  { name: 'measurement', align: 'left', label: 'Measurement', field: 'measId', sortable: true },
  { name: 'protocol', align: 'left', label: 'Protocol', field: 'protocolId', sortable: true },
  { name: 'outcome', align: 'left', label: 'Outcome', sortable: true, field: 'outcome' },
  { name: 'details' }
])

const filteredResultSets = ref([])
const visibleColumns = ref([])

const columnFilters = ref({})

watch(resultSets, () => {
  visibleColumns.value = [...columns.value.map(a => a.name)];
  filteredResultSets.value = [...resultSets.value.map(r => r)]

  columns.value.forEach(col => {
    columnFilters.value[col.name] = ref(null)
  })
})

const handleColumnFilter = (columnName) => {
  filteredResultSets.value = resultSets.value.filter(row => String(row[columnName]).includes(columnFilters.value[columnName]))
}
</script>

<template>
  <q-table
      class="full-width"
      table-header-class="text-grey"
      :title="'Result Sets'"
      :rows="filteredResultSets"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="id"
      column-key="name"
      :pagination="{ rowsPerPage: 10, sortBy: 'calculatedOn', descending: true }"
      :loading="loading"
      virtual-scroll
      style="max-height: 600px"
      separator="cell"
      flat square dense
  >

<!--    <template v-slot:top-right>-->
<!--      <div class="row">-->
<!--        <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>-->
<!--      </div>-->
<!--    </template>-->
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name">
          <q-input v-model="columnFilters[col.name]"
                   @update:model-value="handleColumnFilter(col.name)"
                   dense>
            <template v-slot:append>
              <q-icon size="xs" name="search"/>
            </template>
          </q-input>
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body-cell-protocol="props">
      <q-td :props="props">
        <router-link :to="'/protocol/' + props.row.protocolId" class="nav-link">
          <div class="row items-center cursor-pointer">
            {{ props.value }}
          </div>
        </router-link>
      </q-td>
    </template>
    <template v-slot:body-cell-outcome="props">
      <q-td :props="props">
        <StatusLabel :status="props.value"/>
      </q-td>
    </template>
    <template v-slot:body-cell-details="props">
      <q-td :props="props">
        <q-btn label="Details" icon-right="chevron_right" size="sm" @click="doShowDetails(props.row)"/>
      </q-td>
    </template>
  </q-table>

  <q-dialog v-model="showResultSetDetails">
    <ResultSetDetailsPanel :resultSet="resultSetDetails"></ResultSetDetailsPanel>
  </q-dialog>

</template>

<style scoped>
:deep(.q-field__control),
:deep(.q-field__append) {
  font-size: 12px;
  height: 25px;
}
</style>
