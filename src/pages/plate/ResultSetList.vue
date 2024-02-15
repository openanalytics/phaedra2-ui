<template>
  <q-table
      class="full-width"
      table-header-class="text-grey"
      :title="'Result Sets'"
      :rows="resultSets"
      :columns="columns"
      :visible-columns="visibleColumns"
      :filter="filter"
      :filter-method="filterMethod"
      row-key="id"
      column-key="name"
      :pagination="{ rowsPerPage: 10, sortBy: 'calculatedOn', descending: true }"
      :loading="loading"
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
        <column-filter v-for="col in props.cols" :key="col.name" v-model="filter[col.name]"/>
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

<script setup>
import {onMounted, ref, watch} from 'vue'
import FormatUtils from "../../lib/FormatUtils";
import FilterUtils from "@/lib/FilterUtils";
import StatusLabel from "@/components/widgets/StatusLabel"
import ColumnFilter from "@/components/table/ColumnFilter";
import ResultSetDetailsPanel from "@/components/resultdata/ResultSetDetailsPanel";
import {usePlateStore} from "@/stores/plate";

const props = defineProps({ plate: Object });
const loading = ref(true);
const plateStore = usePlateStore()

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
  loading.value = false
})

const columns = ref([
    { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
    { name: 'calculatedOn', align: 'left', label: 'Calculated On', field: 'executionStartTimeStamp', sortable: true, format: FormatUtils.formatDate },
    { name: 'measurement', align: 'left', label: 'Measurement', field: 'measId', sortable: true },
    { name: 'protocol', align: 'left', label: 'Protocol', field: 'protocolId', sortable: true },
    { name: 'outcome', align: 'left', label: 'Outcome', sortable: true, field: 'outcome' },
    { name: 'details' }
])

const filter = FilterUtils.makeFilter(columns.value);
const filterMethod = FilterUtils.defaultFilterMethod();
const visibleColumns = ref([])

watch(resultSets, () => {
  visibleColumns.value = [...columns.value.map(a => a.name)];
})
</script>
