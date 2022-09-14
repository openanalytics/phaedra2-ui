<template>
    <q-dialog>
        <q-card style="min-width: 30vw">
            <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                Edit Channel
            </q-card-section>
            <q-card-section>
                <div class="row">
                    <div class="col-2 row items-center">
                        <q-avatar icon="edit" color="primary" text-color="white" />
                    </div>
                    <div class="col-10">
                        <span>Name:</span><br/>
                        <q-input dense v-model="channelName" autofocus />
                    </div>
                </div>
            </q-card-section>
            <q-card-actions class="float-right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn label="Save" color="primary" v-close-popup @click="doSave"/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
    import {computed,ref} from 'vue'
    import {useStore} from 'vuex'

    const props = defineProps({
        configId: Number,
        channelNr: Number
    });
    const store = useStore();
    const config = computed(() => store.getters['measurements/getRenderConfig'](props.configId));

    const channelName = ref(null);

    const doSave = () => {
        let newConfig = { ...config.value.config };
        newConfig.channelConfigs = [ ...config.value.config.channelConfigs ];
        let index = props.channelNr - 1;
        newConfig.channelConfigs[index] = { ...newConfig.channelConfigs[index] };
        newConfig.channelConfigs[index].name = channelName.value;
        store.dispatch('measurements/updateRenderConfig', { id: props.configId, config: newConfig });
    };
</script>