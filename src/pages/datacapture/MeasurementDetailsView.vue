<template>
    <q-breadcrumbs class="oa-breadcrumb" v-if="meas">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el :label="'Measurements'" icon="list" :to="'/datacapture/meas'"/>
        <q-breadcrumbs-el :label="meas.barcode" icon="text_snippet"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <div class="q-pa-md">
            <oa-section-header v-if="!meas" title="Loading..." icon="text_snippet"/>

            <div v-else>
                <oa-section-header :title="meas.barcode" :icon="'text_snippet'"/>
                <div class="row q-pa-md oa-section-body">
                    <div class="col-6 q-gutter-xs">
                        <div class="row">
                            <div class="col-3 text-weight-bold">ID:</div>
                            <div class="col">{{ meas.id }}</div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-weight-bold">Name:</div>
                            <div class="col">{{ meas.name }}</div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-weight-bold">Barcode:</div>
                            <div class="col">{{ meas.barcode }}</div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-weight-bold">Dimensions:</div>
                            <div class="col">{{ meas.rows }} x {{ meas.columns }} ({{ meas.rows * meas.columns }} wells)</div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="row">
                            <div class="col-3 text-weight-bold">WellData Columns:</div>
                            <div class="col">{{ meas?.wellColumns?.length || 0 }}</div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-weight-bold">SubWellData Columns:</div>
                            <div class="col">{{ meas?.subWellColumns?.length || 0 }}</div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-weight-bold">Image Channels:</div>
                            <div class="col" v-if="meas?.imageChannels">{{ (meas?.imageChannels).join(', ') }}</div>
                            <div class="col text-grey" v-else>No image data</div>
                        </div>
                    </div>
                </div>

                <div class="row q-pt-md">
                    <q-tabs
                        inline-label dense no-caps
                        align="left"
                        class="q-px-sm oa-section-title"
                        v-model="activeTab"
                        >
                        <q-tab name="wellData" icon="table_rows" label="Well Data"/>
                        <q-tab name="subWellData" icon="table_rows" label="SubWell Data"/>
                        <q-tab name="imageData" icon="image" label="Image Data"/>
                    </q-tabs>
                    <div class="row oa-section-body">
                        <q-tab-panels v-model="activeTab" animated style="width: 100%">
                            <q-tab-panel name="wellData">
                                <q-table
                                    table-header-class="text-grey"
                                    flat dense
                                    :rows="wellData"
                                    :columns="wellDataColumns"
                                    row-key="id"
                                    :pagination="{ rowsPerPage: 100 }"
                                    :filter="filter"
                                    :filter-method="filterMethod"
                                    :loading="loading"
                                >
                                <template v-slot:top-left>
                                    <div v-if="wellNrLimit > 0">
                                        <span class="text-info">Showing first {{wellNrLimit}} wells.</span>
                                        <q-btn class="on-right" size="xs" color="info" @click="wellNrLimit = -1">Load all</q-btn>
                                    </div>
                                </template>
                                <template v-slot:top-right>
                                    <div class="row">
                                        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
                                            <template v-slot:append> <q-icon name="search"/> </template>
                                        </q-input>
                                    </div>
                                </template>
                                </q-table>
                            </q-tab-panel>
                            <q-tab-panel name="subWellData">
                                <span class="text-info">TODO</span>
                            </q-tab-panel>
                            <q-tab-panel name="imageData">
                                <div class="row">
                                    <div class="col-8">
                                        <WellGrid :plate="plate" :wellImageFunction="wellImageFunction" />
                                    </div>
                                    <div class="col-4 q-px-sm">
                                        <WellImageViewer></WellImageViewer>
                                    </div>
                                </div>
                            </q-tab-panel>
                        </q-tab-panels>
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
    import {computed, ref} from 'vue'
    import {useStore} from "vuex";
    import {useRoute} from 'vue-router'

    import OaSectionHeader from "@/components/widgets/OaSectionHeader";
    import WellImageViewer from "@/components/image/WellImageViewer";
    import WellGrid from "@/components/well/WellGrid";

    import WellUtils from "@/lib/WellUtils";
    import FilterUtils from "@/lib/FilterUtils";
    
    const activeTab = ref('wellData');
    const loading = ref(true);

    const store = useStore();
    const route = useRoute();
    const measId = parseInt(route.params.id);

    const meas = computed(() => store.getters['measurements/getById'](measId));
    store.dispatch('measurements/loadById', measId);
    
    const filter = ref('');
    const filterMethod = FilterUtils.defaultTableFilter();

    const wellNrLimit = ref(20);
    const wells = computed(() => {
        let nrs = [...Array(meas.value.rows * meas.value.columns).keys()].map(i => i+1);
        return nrs.map(nr => {
            let pos = WellUtils.getWellPosition(nr, meas.value.columns);
            let coord = WellUtils.getWellCoordinate(pos[0], pos[1]);
            return { nr: nr, row: pos[0], columns: pos[1], coord: coord };
        });
    });
    const selectedWell = ref(null);
    const selectWell = (well) => {
        selectedWell.value = { nr: well.nr, measId: meas.value.id };
        store.dispatch('ui/selectWells', [ selectedWell.value ]);
    };

    const wellDataColumns = ref([
        { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true }
    ]);
    const wellData = computed(() => {
        let dataMap = store.getters['measurements/getWellData'](measId) || {};
        let columns = Object.keys(dataMap).sort();
        ((wellNrLimit.value > 0) ? wells.value.slice(0, wellNrLimit.value) : wells.value).forEach(well => {
            wellDataColumns.value.push({ name: well.coord, align: 'left', label: well.coord, field: row => (Math.round(row.values[well.nr - 1] * 100) / 100), sortable: true });
        });
        return columns.map(col => { return { name: col, values: dataMap[col] }});
    });
    store.dispatch('measurements/loadWellData', measId).then(() => loading.value = false);

    const plate = computed(() => { return {
        rows: meas.value.rows,
        columns: meas.value.columns,
        wells: [...Array(meas.value.rows * meas.value.columns).keys()].map(i => {
            let pos = WellUtils.getWellPosition(i + 1, meas.value.columns);
            return { row: pos[0], column: pos[1], nr: i+1 };
        })
    }});
    const wellImageFunction = (well) => {
        //TODO
        // const img = store.getters['measurements/getMeasImage']({ measId: meas.value.id, wellNr: well.nr });
        // if (!img) store.dispatch('measurements/loadMeasImage', { measId: meas.value.id, wellNr: well.nr, scale: 0.01 });
        // return img;
        return "";
    }
</script>