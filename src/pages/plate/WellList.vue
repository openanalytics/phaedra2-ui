<template>
    <q-table
    class="oa-data-table"
    flat square dense
    virtual-scroll
    :rows-per-page-options="[0]"
    :rows="rows"
    :columns="columns"
    row-key="id"
    column-key="name"
    :filter="filter"
    :filter-method="filterMethod"
    :visible-columns="visibleColumns"
    :loading="loading"
    >
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
        <template v-slot:body-cell-status="props">
            <q-td :props="props">
                <q-icon v-if="props.row.status === 'ACCEPTED_DEFAULT'" name="check_circle" color="positive"/>
                <q-icon v-else name="cancel" color="negative"/>
            </q-td>
        </template>
        <template v-slot:no-data>
            <div class="full-width row text-info">
                <span>No wells to show.</span>
            </div>
        </template>
    </q-table>
    <table-config v-if="!loading" v-model:show="configdialog" v-model:visibleColumns="visibleColumns" v-model:columns="columns"></table-config>
</template>

<style scoped>
.oa-data-table {
    max-height: 400px;
}
</style>

<script setup>
    import {ref, computed, watch, watchEffect} from 'vue'
    import {useStore} from "vuex"
    import WellUtils from "@/lib/WellUtils.js"
    import ArrayUtils from "@/lib/ArrayUtils.js"
    import FilterUtils from "@/lib/FilterUtils";
    import TableConfig from "@/components/table/TableConfig";

    const store = useStore();
    const props = defineProps({ plate: Object });
    const loading = ref(true);

    const columns = ref([
    {
        name: 'coordinate', align: 'left', label: 'Coordinate', field: 'coordinate', sortable: true,
        format: (val, well) => (well ? WellUtils.getWellCoordinate(well.row, well.column) : "")
    },
    {
        name: 'number', align: 'left', label: 'Number', field: 'number', sortable: true,
        format: (val, well) => (well ? WellUtils.getWellNr(well.row, well.column, props.plate.columns) : "")
    },
    {name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true},
    {name: 'wellType', align: 'left', label: 'Well Type', field: 'wellType', sortable: true},
    {
        name: 'substance', align: 'left', label: 'Substance', field: 'substance', sortable: true,
        format: (val, well) => (well.wellSubstance?.name ? well.wellSubstance?.name : "")
    },
    {
        name: 'concentration', align: 'left', label: 'Concentration', field: 'concentration', sortable: true,
        format: (val, well) => (well.wellSubstance?.concentration ? well.wellSubstance?.concentration.toExponential(3) : "")
    },
    ]);

    const configdialog = ref(false);
    const visibleColumns = columns.value.map(a => a.name);
    const filter = ref('');
    const filterMethod = FilterUtils.defaultTableFilter();

    const wells = computed(() => store.getters['wells/getWells'](props.plate.id) || []);
    watchEffect(() => {
        if (props?.plate?.id && !store.getters['wells/areWellsLoaded'](props.plate.id)) {
            store.dispatch('wells/fetchByPlateId', props.plate.id);
        }
    });

    // Rows are based on wells but will have additional 'data' columns when resultSet data comes in.
    const rows = computed(() => wells.value.map(w => { return {...w, data: {}} }));

    const activeMeasurement = computed(() => store.getters['measurements/getActivePlateMeasurement'](props.plate.id));
    const resultSets = computed(() => store.getters['resultdata/getLatestResultSetsForPlateMeas'](props.plate.id, activeMeasurement.value?.measurementId));
    const features = computed(() => store.getters['features/getByProtocolIds'](ArrayUtils.distinctBy(resultSets.value, 'protocolId')));
    const resultData = computed(() => resultSets.value.map(rs => store.getters['resultdata/getResultData'](rs.id)).flat());

    store.dispatch('measurements/loadByPlateId', props.plate.id);
    store.dispatch('resultdata/loadResultSets', props.plate.id);

    // When resultSets become available, load features and resultDatas
    watch(resultSets, () => {
        ArrayUtils.distinctBy(resultSets.value, 'protocolId').forEach(pId => store.dispatch('features/loadByProtocolId', pId));
        ArrayUtils.distinctBy(resultSets.value, 'id').forEach(rsId => store.dispatch('resultdata/loadResultData', rsId));
    });

    // When all required data is available, add new columns to table.
    watch([features, resultData], () => {
        if (!loading.value || features.value.length == 0 || resultData.value.length == 0) return;

        resultData.value.forEach(rd => {
            const featureName = features.value.find(feature => feature.id === rd.featureId)?.name;
            
            columns.value.push({
                name: featureName,
                align: 'left',
                label: featureName,
                field: row => row.data[featureName],
                sortable: true
            });
            visibleColumns.push(featureName);
            
            rd.values.forEach((val, index) => {
                rows.value[index].data[featureName] = val;
            });
        })
        
        loading.value = false;
    });
</script>

