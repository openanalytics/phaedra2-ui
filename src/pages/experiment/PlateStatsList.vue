<template>
    <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
    :pagination="{ rowsPerPage: 10, sortBy: 'barcode' }"
    :filter="filter"
    :filter-method="filterMethod"
    :loading="loading"
    :key="tableKey"
    flat square dense
    >
        <template v-slot:top-right>
            <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                    <q-icon name="search"/>
                </template>
            </q-input>
        </template>
        <template v-slot:header="props">
            <q-tr :props="props">
                <q-th v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-grey">
                {{ col.label }}
                    <span v-if="col.label2">
                        <br/>{{ col.label2 }}
                    </span>
                </q-th>
            </q-tr>
        </template>
        <template v-slot:body-cell-barcode="props">
            <q-td :props="props">
                <router-link :to="'/plate/' + props.row.id" class="nav-link">
                    <div class="row items-center cursor-pointer">
                        <q-icon name="view_module" class="icon q-pr-sm"/>
                        {{ props.row.barcode }}
                    </div>
                </router-link>
            </q-td>
        </template>
        <template v-slot:body-cell="props">
            <q-td :props="props">
                <div v-if="props.col.name.endsWith('-zprime')">
                    <q-linear-progress rounded size="20px"
                    :value="Number.isNaN(props.row[props.col.name])? 0 : props.row[props.col.name]"
                    color="positive">
                    <div class="absolute-full flex flex-center">
                        <q-badge color="white" text-color="black" :label="props.row[props.col.name]"/>
                    </div>
                </q-linear-progress>
            </div>
            <div v-else>
                {{props.row[props.col.name]}}
            </div>
        </q-td>
        </template>
        <template v-slot:no-data>
            <div class="full-width row text-info">
                <span>No plates to show.</span>
            </div>
        </template>
    </q-table>
</template>

<style scoped>
.tag-icon {
    margin-right: 5px;
}

.nav-link {
    color: black;
    text-decoration: none;
}
</style>

<script setup>
    import {computed, ref, watch} from 'vue'
    import {useStore} from 'vuex'
    import FilterUtils from "@/lib/FilterUtils";
    import ArrayUtils from "@/lib/ArrayUtils";
    
    const statsToShow = ['zprime', 'cv', 'stdev', 'min', 'mean', 'median', 'max'];

    const props = defineProps(['experiment']);
    const store = useStore();

    const loading = ref(true);
    const filter = ref('');
    const filterMethod = FilterUtils.defaultTableFilter();
    const rows = ref([]);
    const tableKey = ref(0);
    const columns = [
        {name: 'barcode', align: 'center', label: 'Barcode', field: 'barcode', sortable: true}
    ];
    
    const plates = computed(() => store.getters['plates/getByExperimentId'](props.experiment.id));
    const activeMeasurements = computed(() => store.getters['measurements/getActivePlateMeasurements'](plates.value.map(p => p.id)));
    const resultSets = computed(() => activeMeasurements.value.map(m => store.getters['resultdata/getLatestResultSetsForPlateMeas'](m.plateId, m.measurementId)).flat());
    //TODO filter on non-welltype stats
    const resultStats = computed(() => resultSets.value.map(rs => store.getters['resultdata/getResultStats'](rs.id)).flat());
    const features = computed(() => store.getters['features/getByIds'](ArrayUtils.distinctBy(resultStats.value, 'featureId')));

    watch(props.experiment, async () => {
        if (!props.experiment) return;
        await store.dispatch('plates/loadByExperimentId', props.experiment.id);
        for (const plate of plates.value) {
            rows.value.push(structuredClone(plate));
        }
        for (const plate of plates.value) {
            await store.dispatch('resultdata/loadResultSets', plate.id);
            await store.dispatch('measurements/loadByPlateId', plate.id);
            for (const rs of resultSets.value.filter(rs => rs.plateId == plate.id)) {
                await store.dispatch('resultdata/loadResultStats', rs.id);
            }
        }
        await store.dispatch('features/loadByIds', ArrayUtils.distinctBy(resultStats.value, 'featureId'));
        buildTableColumns();
    }, { immediate: true });

    const buildTableColumns = () => {
        features.value.map(f => f.id).sort().forEach(fId => {
            let isFirstStat = true;
            statsToShow.forEach(statName => {
                columns.push({
                    name: `stat-${fId}-${statName}`,
                    label: isFirstStat ? (features.value.find(f => f.id === fId) || {}).name : '',
                    label2: statName,
                    align: 'center'
                });
                isFirstStat = false;
            });
        });

        plates.value.forEach(p => {
            let row = rows.value.find(r => r.id == p.id);
            let plateResultSetIds = resultSets.value.filter(rs => rs.plateId == p.id).map(rs => rs.id);
            resultStats.value.filter(stat => !stat.welltype && plateResultSetIds.includes(stat.resultSetId)).forEach(stat => {
                const key = `stat-${stat.featureId}-${stat.statisticName}`;
                row[key] = stat ? Math.round(stat.value * 100) / 100 : NaN;
            });
        });
        
        loading.value = false;
        tableKey.value++;
    }
</script>
