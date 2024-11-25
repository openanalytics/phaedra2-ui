<template>
    <q-dialog @hide="clearData">
        <q-card style="min-width: 30vw">
            <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
            Create New Render Config
            </q-card-section>
            <q-card-section>
                <div class="row">
                    <div class="col-2 row items-center">
                        <q-avatar icon="edit" color="primary" text-color="white" />
                    </div>
                    <div class="col-10">
                        <span>New Config Name:</span><br/>
                        <q-input dense v-model="newConfig.name" autofocus />
                    </div>
                </div>
            </q-card-section>
            <q-card-actions class="float-right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn label="Create" color="primary" v-close-popup @click="saveNewConfig"/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
    import {ref} from 'vue'
    import {useStore} from 'vuex'
    import {useRouter} from "vue-router"

    const store = useStore();
    const router = useRouter();

    const newConfig = ref({
        name: "",
        config: {
            channelConfigs: []
        }
    });
    const saveNewConfig = () => {
        store.dispatch('measurements/createRenderConfig', newConfig.value)
            .then(cfg => router.push('/datacapture/render-config/' + cfg.id));
    };

    const clearData = () => {
        newConfig.value.name = "";
        newConfig.value.config.channelConfigs = [];
    };
</script>