<template>
    <q-table
        table-header-class="text-grey"
        flat square dense
        :title="'Result Sets'"
        :rows="plateStore.resultSets"
        :columns="resultSetsColumns"
        row-key="id"
        :pagination="{ rowsPerPage: 10, sortBy: 'calculatedOn', descending: true }"
        :filter="filter"
        :filter-method="filterMethod"
        :loading="loading">

        <template v-slot:top-right>
            <div class="row">
                <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                        <q-icon name="search"/>
                    </template>
                </q-input>
                <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>
            </div>
        </template>
        <template v-slot:body-cell-protocol="props">
            <q-td :props="props" >
                <router-link :to="'/protocol/' + props.row.protocolId" class="nav-link">
                    <div class="row items-center cursor-pointer">
                        {{ props.value }}
                    </div>
                </router-link>
            </q-td>
        </template>
        <template v-slot:body-cell-outcome="props">
            <q-td :props="props">
                <StatusLabel :status="props.value" />
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
import {ref} from 'vue'
import {useStore} from 'vuex'
import FormatUtils from "../../lib/FormatUtils";
import FilterUtils from "../../lib/FilterUtils";
import StatusLabel from "@/components/widgets/StatusLabel"
import ResultSetDetailsPanel from "@/components/resultdata/ResultSetDetailsPanel";
import {usePlateStore} from "@/stores/plate";

const props = defineProps({ plate: Object });
const store = useStore();
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

const filter = ref('');
const filterMethod = FilterUtils.defaultTableFilter();

const resultSetsColumns = ref([
    { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
    { name: 'calculatedOn', align: 'left', label: 'Calculated On', field: 'executionStartTimeStamp', sortable: true, format: FormatUtils.formatDate },
    { name: 'measurement', align: 'left', label: 'Measurement', field: 'measId', sortable: true },
    { name: 'protocol', align: 'left', label: 'Protocol', field: 'protocolId', sortable: true },
    { name: 'outcome', align: 'left', label: 'Outcome', sortable: true, field: 'outcome' },
    { name: 'details' }
])

</script>
