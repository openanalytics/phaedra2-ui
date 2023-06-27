<template>
    <q-breadcrumbs class="oa-breadcrumb">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
        <q-breadcrumbs-el label="Pipeline Executions" icon="list"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <oa-section title="Pipeline Executions" icon="play_circle_outline" class="q-pa-md">
            <q-table
                table-header-class="text-grey"
                flat dense
                :rows="executions"
                :columns="columns"
                row-key="id"
                class="full-width"
                :pagination="{ rowsPerPage: 20, sortBy: 'createdOn', descending: true }"
                :filter="filter"
                :filter-method="filterMethod"
                :loading="loading"
                @row-click="(e, row) => router.push('/pipeline-execution/' + row.id)"
                >
                <template v-slot:top-left>
                    <q-btn color="primary" icon="refresh" size="sm" @click="refreshList" class="on-left"/>
                </template>                    
                <template v-slot:top-right>
                    <date-range-selector v-model:from="dateFrom" v-model:to="dateTo" @rangeChanged="refreshList" />
                    <q-input outlined dense debounce="300" v-model="filter" placeholder="Search" class="on-right">
                        <template v-slot:append>
                            <q-icon name="search"/>
                        </template>
                    </q-input>
                </template>
                <template v-slot:body-cell-createdBy="props">
                    <q-td :props="props">
                        <UserChip :id="props.row.createdBy" />
                    </q-td>
                </template>
                <template v-slot:body-cell-updatedBy="props">
                    <q-td :props="props">
                        <UserChip :id="props.row.updatedBy" />
                    </q-td>
                </template>
                <template v-slot:body-cell-status="props">
                    <q-td :props="props">
                        <StatusLabel :status="props.row.status" />
                    </q-td>
                </template>
            </q-table>
        </oa-section>
    </q-page>
</template>

<script setup>
    import {ref, computed} from 'vue';
    import {useStore} from 'vuex';
    import {useRouter} from "vue-router";
    import FilterUtils from "@/lib/FilterUtils.js"
    import FormatUtils from "@/lib/FormatUtils.js"
    import UserChip from "@/components/widgets/UserChip";
    import StatusLabel from "@/components/widgets/StatusLabel";
    import OaSection from "@/components/widgets/OaSection";
    import DateRangeSelector from "@/components/widgets/DateRangeSelector";

    const store = useStore();
    const router = useRouter();
    const loading = ref(true);
    const filter = ref('');
    const filterMethod = FilterUtils.defaultTableFilter();

    const dateFrom = ref(new Date());
    const dateTo = ref(new Date());
    dateFrom.value.setDate(dateTo.value.getDate() - 14);
    const getDateRange = () => { 
        return { from: Date.parse(dateFrom.value), to: Date.parse(dateTo.value) };
    };
    const refreshList = () => {
        loading.value = true;
        store.dispatch('pipelines/loadAllPipelineExecutions', getDateRange()).then(() => { loading.value = false });
    };
    const executions = computed(() => store.getters['pipelines/getAllPipelineExecutions'](getDateRange()));
    refreshList();

    const columns = ref([
        {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
        {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
        {name: 'updatedOn', align: 'left', label: 'Updated On', field: 'updatedOn', sortable: true, format: FormatUtils.formatDate},
        {name: 'updatedBy', align: 'left', label: 'Updated By', field: 'updatedBy', sortable: true},
        {name: 'currentStep', align: 'center', label: 'Current Step', field: 'currentStep'},
        {name: 'pipelineId', align: 'center', label: 'Pipeline ID', field: 'pipelineId'},
        {name: 'status', align: 'center', label: 'Status', field: 'status'},
    ]);
</script>