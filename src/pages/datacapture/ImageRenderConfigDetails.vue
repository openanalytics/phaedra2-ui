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
                            <div class="col">
                                <EditableField :object="config" fieldName="name" @valueChanged="onNameChanged" />
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="row">
                            <div class="col-3 text-weight-bold">Gamma:</div>
                            <div class="col">
                                <EditableField :object="config.config" fieldName="gamma" :number="true" @valueChanged="(newValue) => onConfigValueChanged('gamma', newValue)" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-weight-bold">Scale:</div>
                            <div class="col">
                                <EditableField :object="config.config" fieldName="scale" :number="true" @valueChanged="(newValue) => onConfigValueChanged('scale', newValue)" />
                            </div>
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
                        <template v-slot:top-left>
                            <div class="action-button">
                                <q-btn size="sm" color="primary" icon="add" label="Add..." @click="doAddChannel"/>
                            </div>
                        </template>
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
                        <template v-slot:body-cell-menu="props">
                            <q-td :props="props">
                                <q-btn flat round icon="edit" size="sm" @click="doEditChannel(props.rowIndex)" />
                                <q-btn flat round icon="delete" size="sm" @click="doDeleteChannel(props.rowIndex)" />
                            </q-td>
                        </template>
                    </q-table>
                </div>
            </div>
        </div>
    </q-page>

    <EditChannelDialog v-model="showEditChannelDialog" :configId="configId" :channelNr="channelNrToEdit" />
    <DeleteChannelDialog v-model="showDeleteChannelDialog" :configId="configId" :channelNr="channelNrToEdit" />
</template>

<script setup>
    import {computed, ref} from 'vue'
    import {useStore} from "vuex";
    import {useRoute} from 'vue-router'
    import ColorUtils from '@/lib/ColorUtils';
    import EditableField from "@/components/widgets/EditableField";
    import OaSectionHeader from "@/components/widgets/OaSectionHeader";
    import EditChannelDialog from "@/components/image/EditChannelDialog";
    import DeleteChannelDialog from "@/components/image/DeleteChannelDialog";
    
    const store = useStore();
    const route = useRoute();
    const configId = parseInt(route.params.id);

    const config = computed(() => store.getters['measurements/getRenderConfig'](configId));
    store.dispatch('measurements/loadRenderConfig', configId);

    const columns = ref([
        { name: 'sequence', align: 'left', label: 'Sequence', field: row => (1 + config.value.config?.channelConfigs?.findIndex(r => r === row)), sortable: true },
        { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
        { name: 'rgb', align: 'left', label: 'Color', field: 'rgb', sortable: true },
        { name: 'alpha', align: 'left', label: 'Alpha', field: 'alpha', format: val => (val * 100) + '%' },
        { name: 'contrast', label: 'Contrast Range', align: 'left', headerStyle: 'width: 200px' },
        { name: 'menu', align: 'left', field: 'menu', sortable: false }
    ]);

    const onNameChanged = (newValue) => {
        store.dispatch('measurements/updateRenderConfig', { id: configId, name: newValue });
    };
    const onConfigValueChanged = (fieldName, newValue) => {
        let newConfig = { ...config.value.config };
        newConfig[fieldName] = newValue;
        store.dispatch('measurements/updateRenderConfig', { id: configId, config: newConfig });
    };
    const doAddChannel = () => {
        let newConfig = { ...config.value.config };
        newConfig.channelConfigs = [ ...config.value.config.channelConfigs ];
        newConfig.channelConfigs.push({ name: "New Channel" });
        store.dispatch('measurements/updateRenderConfig', { id: configId, config: newConfig });
    };

    const showEditChannelDialog = ref(false);
    const channelNrToEdit = ref(null);
    const doEditChannel = (index) => {
        channelNrToEdit.value = index + 1;
        showEditChannelDialog.value = true;
    };

    const showDeleteChannelDialog = ref(false);
    const doDeleteChannel = (index) => {
        channelNrToEdit.value = index + 1;
        showDeleteChannelDialog.value = true;
    };
</script>