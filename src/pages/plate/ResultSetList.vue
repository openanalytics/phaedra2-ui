<template>
  <oa-table
      :title="'Result Sets'"
      :rows="resultSets"
      :columns="columns">
    <template v-slot:body-cell-measurement="props">
      <q-td :props="props" @dblclick="gotoMeasurement(props.row)">
          <div class="items-center cursor-pointer"> {{ props.value }} </div>
      </q-td>
    </template>
    <template v-slot:body-cell-protocol="props">
      <q-td :props="props" @dblclick="gotoProtocol(props.row)">
          <div class="items-center cursor-pointer"> {{ props.value }} </div>
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
  </oa-table>

  <q-dialog v-model="showResultSetDetails">
    <ResultSetDetailsPanel :resultSet="resultSetDetails"></ResultSetDetailsPanel>
  </q-dialog>

</template>

<script setup>
import {onMounted, ref} from 'vue'
import FormatUtils from "../../lib/FormatUtils";
import StatusLabel from "@/components/widgets/StatusLabel"
import ResultSetDetailsPanel from "@/components/resultdata/ResultSetDetailsPanel";
import {usePlateStore} from "@/stores/plate";
import OaTable from "@/components/table/OaTable.vue";
import {useRouter} from "vue-router";
import {useLoadingHandler} from "@/composable/loadingHandler";
import resultdataGraphQlAPI from "@/api/graphql/resultdata";

const props = defineProps({ plate: Object });
const plateStore = usePlateStore()

// Details panel
const showResultSetDetails = ref(false);
const resultSetDetails = ref(null);
const doShowDetails = (rs) => {
    resultSetDetails.value = rs;
    showResultSetDetails.value = true;
};

const resultSets = ref([])

const loadingHandler = useLoadingHandler()
onMounted(async () => {
  await loadingHandler.handleLoadingDuring(fetchResultSets())
})

const fetchResultSets = async () => {
  const {onResult, onError} = resultdataGraphQlAPI.resultSetsByPlateId(props.plate.id)
  onResult(({data}) => {
    resultSets.value = data.resultSets;
  })
}

const columns = ref([
    { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
    { name: 'calculatedOn', align: 'left', label: 'Calculated On', field: 'executionStartTimeStamp', sortable: true, format: FormatUtils.formatDate },
    { name: 'measurement', align: 'left', label: 'Measurement', field: 'measId', sortable: true },
    { name: 'protocol', align: 'left', label: 'Protocol', field: 'protocolId', sortable: true },
    { name: 'outcome', align: 'left', label: 'Outcome', sortable: true, field: 'outcome' },
    { name: 'details' }
])

const router = useRouter();
const gotoMeasurement = (row) => {
  router.push(`/datacapture/meas/${row.measId}`)
}
const gotoProtocol = (row) => {
  router.push(`/protocol/${row.protocolId}`)
}
</script>
