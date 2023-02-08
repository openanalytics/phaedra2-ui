<template>
    <q-breadcrumbs class="oa-breadcrumb">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el label="New Pipeline" icon="route"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <div class="q-pa-md">
            <oa-section-header  title="New Pipeline" icon="route"/>
            <div class="row q-pa-md oa-section-body">
                <q-form class="full-width" @submit="saveNewPipeline">
                    <q-input label="Name" v-model="newPipeline.name" lazy-rules :rules="[ val => val && val.length > 0 || 'Name is required']" dense/>
                    <div class="row justify-end q-pt-md">
                        <router-link :to="{ name: 'browsePipelines'}" class="nav-link">
                            <q-btn label="Cancel" type="reset" color="primary" flat class="on-right"/>
                        </router-link>
                        <q-btn label="Create" type="submit" color="primary"/>
                    </div>
                </q-form>
            </div>
        </div>
    </q-page>
</template>

<script setup>
    import {ref} from "vue";
    import {useStore} from 'vuex';
    import {useRouter} from 'vue-router';
    import OaSectionHeader from "@/components/widgets/OaSectionHeader";

    const store = useStore();
    const router = useRouter();
    const newPipeline = ref({
        status: "DISABLED",
        config: {}
    });

    const saveNewPipeline = () => {
        store.dispatch('pipelines/createNewPipeline', newPipeline.value)
            .then(cfg => router.push('/pipelines'));
    };
</script>