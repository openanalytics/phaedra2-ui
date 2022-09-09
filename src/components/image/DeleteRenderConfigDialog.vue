<template>
    <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 30vw">
            <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                <q-avatar icon="delete" color="primary" text-color="white"/> Delete Render Config
            </q-card-section>
            <q-card-section>
                <div class="row">
                    <span>Are you sure you want to delete the render config <b>{{config.name}}</b>?</span>
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
    import {ref, computed} from 'vue';
    import {useStore} from 'vuex';

    const props = defineProps({
        id: Number
    });

    const store = useStore();
    const config = computed(() => store.getters['measurements/getRenderConfig'](props.id));
    const showDialog = ref(false);
    const confirmDelete = () => {
        store.dispatch('measurements/deleteRenderConfig', props.id);
    };
</script>
