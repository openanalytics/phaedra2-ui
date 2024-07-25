<template>
    <q-dialog persistent>
        <q-card style="min-width: 30vw">
            <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                <q-avatar icon="palette" color="primary" text-color="white"/> Render Config
            </q-card-section>
            <q-card-section>
                <oa-table
                    selection="multiple"
                    v-model:selected="selectedChannels"
                    :rows="uiStore.imageRenderSettings.channels"
                    :columns="channelColumns"
                    row-key="name"
                >
                    <template v-slot:body-cell-rgb="props">
                        <q-td :props="props">
                            <div :style="{ width: '25px', backgroundColor: ColorUtils.asCSSColor(props.row.rgb) }">&nbsp;</div>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-contrast="props">
                        <q-td :props="props">
                            <q-range dense thumb-size="12px" label
                                    :model-value="{ min: (props.row.contrastMin * 100), max: (props.row.contrastMax * 100) }"
                                    :min="0" :max="100"
                                    @update:model-value="v => { modifiedChannels[props.row.name] = { min: v.min/100, max: v.max/100 } }"
                            />
                        </q-td>
                    </template>
                </oa-table>
            </q-card-section>
            <q-card-actions class="text-primary float-right">
                <q-btn flat label="Cancel" v-close-popup/>
                <q-btn label="OK" color="primary" v-close-popup @click="confirmOK"/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref} from 'vue';
import {useUIStore} from "@/stores/ui";
import ColorUtils from '@/lib/ColorUtils';
import OaTable from "@/components/table/OaTable.vue";

const uiStore = useUIStore();
const props = defineProps({
    configId: Number
});

const channelColumns = [
    {name: 'name', label: 'Channel', align: 'left', field: 'name'},
    {name: 'rgb', label: 'Color', align: 'left', field: 'rgb'},
    {name: 'contrast', label: 'Contrast Range', align: 'left'},
    {name: 'alpha', label: 'Alpha', align: 'left', field: 'alpha', format: val => (val * 100) + '%'},
];

const selectedChannels = ref(uiStore.imageRenderSettings.channels.filter(ch => ch.enabled));
const modifiedChannels = {};

const confirmOK = () => {
    const settings = {
        channels: uiStore.imageRenderSettings.channels.map(ch => { return { ...ch,
            enabled: selectedChannels.value.some(c => c.name == ch.name),
            contrastMin: modifiedChannels[ch.name]?.min || ch.contrastMin,
            contrastMax: modifiedChannels[ch.name]?.max || ch.contrastMax
        }})
    };
    uiStore.updateImageRenderSettings(settings);
}

</script>
