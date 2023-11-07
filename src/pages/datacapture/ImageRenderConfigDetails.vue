<template>
    <q-breadcrumbs class="oa-breadcrumb" v-if="config">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el label="Image Render Configurations" icon="list" :to="'/datacapture/render-configs'"/>
        <q-breadcrumbs-el :label="config.name" icon="palette"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <div class="q-pa-sm">
            <oa-section v-if="!config" title="Loading..." icon="text_snippet"/>
            <oa-section v-else :title="config.name" icon="palette" :collapsible="true">
                <div class="row q-pa-md">
                    <div class="col-3">
                        <q-field label="ID" stack-label borderless dense>
                            <template v-slot:control>
                                {{ config.id }}
                            </template>
                        </q-field>
                        <q-field label="Name" stack-label borderless dense>
                            <template v-slot:control>
                                <div class="self-center full-width no-outline">
                                    <EditableField :object="config" fieldName="name" @valueChanged="onNameChanged" />
                                </div>
                            </template>
                        </q-field>
                    </div>
                    <div class="col-3">
                        <q-field label="Gamma" stack-label borderless dense>
                            <template v-slot:control>
                                <div class="self-center full-width no-outline">
                                    <EditableField :object="config.config" fieldName="gamma" :number="true" @valueChanged="(newValue) => onConfigValueChanged('gamma', newValue)" />
                                </div>
                            </template>
                        </q-field>
                        <q-field label="Scale" stack-label borderless dense>
                            <template v-slot:control>
                                <div class="self-center full-width no-outline">
                                    <EditableField :object="config.config" fieldName="scale" :number="true" @valueChanged="(newValue) => onConfigValueChanged('scale', newValue)" />
                                </div>
                            </template>
                        </q-field>
                    </div>
                    <div class="col-3">
                        <q-field label="Created On" stack-label dense borderless>
                            <template v-slot:control>
                                {{ FormatUtils.formatDate(config.createdOn) }}
                            </template>
                        </q-field>
                        <q-field label="Created By" stack-label dense borderless>
                            <template v-slot:control>
                                <div class="q-pt-xs">
                                    <UserChip :id="config.createdBy"/>
                                </div>
                            </template>
                        </q-field>
                    </div>
                </div>
            </oa-section>
            <oa-section title="Channels" icon="collections" :collapsible="true" class="q-pt-md">
                <q-table
                    table-header-class="text-grey"
                    flat dense hide-bottom
                    :rows="channels"
                    :columns="columns"
                    row-key="id"
                    :pagination="{ rowsPerPage: 100 }"
                >
                    <template v-slot:top-left>
                        <q-btn size="sm" color="primary" icon="add" label="Add..." @click="doAddChannel" class="q-mt-sm" />
                    </template>
                    <template v-slot:body-cell-name="props">
                        <q-td :props="props">
                            {{ props.row.name }}
                            <q-popup-edit v-model="props.row.name" v-slot="scope" buttons @save="value => doUpdateName(props.row, value)">
                                <q-input v-model="scope.value" dense autofocus />
                            </q-popup-edit>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-rgb="props">
                        <q-td :props="props">
                            <ColorButton v-model:rgb="props.row.rgb" @update:rgb="value => doUpdateRGB(props.row, value)" />
                        </q-td>
                    </template>
                    <template v-slot:body-cell-contrast="props">
                        <q-td :props="props">
                            <q-range dense thumb-size="12px" label
                                :model-value="{ min: (props.row.contrastMin * 100), max: (props.row.contrastMax * 100) }"
                                :min="0" :max="100"
                                @change="value => doUpdateContrast(props.row, value)" />
                        </q-td>
                    </template>
                    <template v-slot:body-cell-alpha="props">
                        <q-td :props="props">
                            {{ props.row.alpha * 100 }}%
                            <q-popup-edit v-model="props.row.alpha" v-slot="scope" buttons @save="value => doUpdateAlpha(props.row, value)">
                                <q-input v-model="scope.value" type="number" dense autofocus />
                            </q-popup-edit>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-menu="props">
                        <q-td :props="props">
                            <q-btn flat round icon="delete" size="sm" @click="doDeleteChannel(props.rowIndex)" />
                        </q-td>
                    </template>
                </q-table>
            </oa-section>
        </div>
    </q-page>

    <DeleteChannelDialog v-model="showDeleteChannelDialog" :configId="configId" :channelNr="channelNrToDelete" />
</template>

<script setup>
    import {computed, ref, watch} from 'vue'
    import {useStore} from "vuex";
    import {useRoute} from 'vue-router'
    import EditableField from "@/components/widgets/EditableField";
    import OaSection from "@/components/widgets/OaSection";
    import ColorButton from "@/components/image/ColorButton";
    import DeleteChannelDialog from "@/components/image/DeleteChannelDialog";
    import UserChip from "@/components/widgets/UserChip";

    import FormatUtils from "@/lib/FormatUtils.js"

    const store = useStore();
    const route = useRoute();
    const configId = parseInt(route.params.id);

    const config = computed(() => store.getters['measurements/getRenderConfig'](configId));
    store.dispatch('measurements/loadRenderConfig', configId);

    const channels = ref([]);
    watch(() => config.value, () => {
        if (config.value?.config) {
            channels.value.splice(0);
            config.value.config.channelConfigs.forEach((ch, i) => channels.value.push({...ch,...{ nr: i+1 }}));
        }
    }, { immediate: true });

    const columns = ref([
        { name: 'sequence', align: 'left', label: 'Sequence', field: 'nr', sortable: true },
        { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
        { name: 'rgb', align: 'left', label: 'Color', field: 'rgb', sortable: true },
        { name: 'contrast', label: 'Contrast Range', align: 'left', headerStyle: 'width: 200px' },
        { name: 'alpha', align: 'left', label: 'Alpha', field: 'alpha', sortable: true },
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

    const copyConfig = () => {
        let origConfig = config.value.config;
        let newConfig = { ...origConfig };
        newConfig.channelConfigs = [];
        origConfig.channelConfigs.forEach(ch => newConfig.channelConfigs.push({ ...ch }));
        return newConfig;
    };

    const doAddChannel = () => {
        let newConfig = copyConfig();
        newConfig.channelConfigs.push({ name: "New Channel" });
        store.dispatch('measurements/updateRenderConfig', { id: configId, config: newConfig });
    };

    const showDeleteChannelDialog = ref(false);
    const channelNrToDelete = ref(null);
    const doDeleteChannel = (index) => {
        channelNrToDelete.value = index + 1;
        showDeleteChannelDialog.value = true;
    };

    const doUpdateName = (row, newName) => {
        doUpdateChannelField(row, 'name', newName);
    };

    const doUpdateRGB = (row, rgb) => {
        doUpdateChannelField(row, 'rgb', rgb);
    }

    const doUpdateAlpha = (row, newAlpha) => {
        doUpdateChannelField(row, 'alpha', newAlpha);
    };

    const doUpdateContrast = (row, newContrast) => {
        let newConfig = copyConfig();
        newConfig.channelConfigs[row.nr - 1].contrastMin = (newContrast.min / 100);
        newConfig.channelConfigs[row.nr - 1].contrastMax = (newContrast.max / 100);
        store.dispatch('measurements/updateRenderConfig', { id: configId, config: newConfig });
    };

    const doUpdateChannelField = (row, fieldName, newValue) => {
        let newConfig = copyConfig();
        newConfig.channelConfigs[row.nr - 1][fieldName] = newValue;
        store.dispatch('measurements/updateRenderConfig', { id: configId, config: newConfig });
    };
</script>
