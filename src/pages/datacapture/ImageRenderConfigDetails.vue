<template>
    <q-breadcrumbs class="oa-breadcrumb" v-if="config">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el label="Image Render Configurations" icon="palette" :to="'/datacapture/render-configs'"/>
        <q-breadcrumbs-el :label="config.name" icon="palette"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <div class="q-pa-md">
            <oa-section-header v-if="!config" title="Loading..." icon="text_snippet"/>

            <div v-else>
                <oa-section-header :title="config.name" icon="palette"/>
                <div class="row q-pa-md oa-section-body">
                    <div class="col-6 q-gutter-xs">
                        <div class="row">
                            <div class="col-3 text-weight-bold">ID:</div>
                            <div class="col">{{ config.id }}</div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-weight-bold">Name:</div>
                            <div class="col">{{ config.name }}</div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="row">
                            <div class="col-3 text-weight-bold">Gamma:</div>
                            <div class="col">{{ config.config.gamma }}</div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-weight-bold">Scale:</div>
                            <div class="col">{{ config.config.scale }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row q-pt-md">
                <oa-section-header title="Channels" icon="collections" />
                <div class="row q-pa-md oa-section-body">
                    <q-table
                        table-header-class="text-grey"
                        flat dense hide-bottom
                        :rows="config?.config?.channelConfigs"
                        :columns="columns"
                        row-key="id"
                        :pagination="{ rowsPerPage: 100 }"
                    >
                        <template v-slot:body-cell-rgb="props">
                            <q-td :props="props">
                                <div :style="{ width: '25px', backgroundColor: ColorUtils.asCSSColor(props.row.rgb) }">&nbsp;</div>
                            </q-td>
                        </template>
                        <template v-slot:body-cell-contrast="props">
                            <q-td :props="props">
                                <q-range dense readonly thumb-size="12px" label :model-value="{ min: (props.row.contrastMin * 100), max: (props.row.contrastMax * 100) }" :min="0" :max="100" />
                            </q-td>
                        </template>
                    </q-table>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
    import {computed, ref} from 'vue'
    import {useStore} from "vuex";
    import {useRoute} from 'vue-router'
    import ColorUtils from '@/lib/ColorUtils';
    import OaSectionHeader from "@/components/widgets/OaSectionHeader";
    
    const store = useStore();
    const route = useRoute();
    const configId = parseInt(route.params.id);

    const config = computed(() => store.getters['measurements/getRenderConfig'](configId));
    store.dispatch('measurements/loadRenderConfig', configId);

    const columns = ref([
        { name: 'sequence', align: 'left', label: 'Sequence', field: row => (1 + config.value.config?.channelConfigs?.findIndex(r => r.name == row.name)), sortable: true },
        { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
        { name: 'rgb', align: 'left', label: 'Color', field: 'rgb', sortable: true },
        { name: 'alpha', align: 'left', label: 'Alpha', field: 'alpha', format: val => (val * 100) + '%' },
        { name: 'contrast', label: 'Contrast Range', align: 'left', headerStyle: 'width: 300px' }
    ]);
</script>