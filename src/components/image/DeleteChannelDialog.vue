<template>
    <q-dialog persistent>
        <q-card style="min-width: 30vw">
            <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                <q-avatar icon="delete" color="primary" text-color="white"/> Delete Channel
            </q-card-section>
            <q-card-section>
                <div class="row">
                    <span>Are you sure you want to delete the channel <b>{{channel.name}}</b>?</span>
                </div>
            </q-card-section>
            <q-card-actions class="text-primary float-right">
                <q-btn flat label="Cancel" v-close-popup/>
                <q-btn label="Delete" color="accent" v-close-popup @click="confirmDelete"/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useMeasurementStore} from "@/stores/measurement";

const props = defineProps({
  configId: Number,
  channelNr: Number
});

const measurementStore = useMeasurementStore()
const channel = ref({})
onMounted(() => {
  channel.value = measurementStore.renderConfig?.config.channelConfigs[props.channelNr - 1] ?? {}
})

const confirmDelete = () => {
  let newConfig = {...measurementStore.renderConfig};
  newConfig.channelConfigs = [...measurementStore.renderConfig.config.channelConfigs];
  newConfig.channelConfigs.splice(props.channelNr - 1, 1);
  measurementStore.updateRenderConfig({id: props.configId, config: newConfig})
};
</script>
