<template>
    <q-breadcrumbs class="oa-breadcrumb" v-if="meas">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el :label="'Measurements'" icon="list" :to="'/datacapture/meas'"/>
        <q-breadcrumbs-el :label="meas.name" icon="text_snippet"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <div class="q-pa-md">
            <oa-section-header v-if="!meas" title="Loading..." icon="text_snippet"/>

            <div v-else>
                <oa-section-header :title="meas.name" :icon="'text_snippet'"/>
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
                    </q-tabs>
                    <div class="row oa-section-body">
                        <q-tab-panels v-model="activeTab" animated style="width: 100%">
                            <q-tab-panel name="wellData">
                                <div v-if="wellDataColumnLimit > 0">
                                    <span class="text-info">Showing first {{wellDataColumnLimit}} columns.</span>
                                    <q-btn class="on-right" size="xs" color="info" @click="wellDataColumnLimit = -1">Load all</q-btn>
                                </div>
                                <q-table
                                    table-header-class="text-grey"
                                    flat dense
                                    :rows="wellData"
                                    :columns="wellDataColumns"
                                    row-key="id"
                                    :pagination="{ rowsPerPage: 100 }"
                                    :loading="loading"
                                >
                                </q-table>
                            </q-tab-panel>
                            <q-tab-panel name="subWellData">
                                <q-table
                                    table-header-class="text-grey"
                                    flat dense
                                    :rows="subWellData"
                                    :columns="subWellDataColumns"
                                    row-key="id"
                                    :pagination="{ rowsPerPage: 100 }"
                                >
                                </q-table>
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

    const activeTab = ref('wellData');
    const loading = ref(true);

    const store = useStore();
    const route = useRoute();
    const measId = parseInt(route.params.id);

    const meas = computed(() => store.getters['measurements/getById'](measId));
    store.dispatch('measurements/loadById', measId);
    
    //TODO All columns -> poor performance
    const wellDataColumnLimit = ref(20);

    const wellDataColumns = ref([
        { name: 'wellNr', align: 'left', label: 'Well', field: 'wellNr', sortable: true }
    ]);
    const wellData = computed(() => {
        let dataMap = store.getters['measurements/getWellData'](measId) || {};
        let columns = Object.keys(dataMap).sort();
        if (wellDataColumnLimit.value > 0) columns = columns.slice(0, wellDataColumnLimit.value);

        columns.forEach(col => {
            wellDataColumns.value.push({ name: col, align: 'left', label: col, field: row => row[col], sortable: true });
        });

        let wellNrs = [...Array(meas.value.rows * meas.value.columns).keys()].map(i => i+1);
        return wellNrs.map(nr => {
            let row = { wellNr: nr };
            columns.forEach(col => row[col] = dataMap[col][nr - 1]);
            return row;
        });
    });
    store.dispatch('measurements/loadWellData', measId).then(() => loading.value = false);

    const subWellData = [];
    const subWellDataColumns = [
        { name: 'wellNr', align: 'left', label: 'Well', field: 'wellNr', sortable: true },
    ];
</script>