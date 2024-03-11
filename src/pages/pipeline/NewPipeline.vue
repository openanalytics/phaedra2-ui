<template>
    <q-breadcrumbs class="oa-breadcrumb">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el label="New Pipeline" icon="route"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <oa-section  title="New Pipeline" icon="route" class="q-pa-sm">
            <div class="row q-pa-md">
                <q-form class="full-width" @submit="saveNewPipeline">
                    <q-input label="Name" v-model="newPipeline.name" lazy-rules :rules="[ val => val && val.length > 0 || 'Name is required']" dense/>
                    <div class="row justify-end q-pt-md">
                        <router-link :to="{ name: 'browsePipelines'}" class="nav-link">
                            <q-btn label="Cancel" type="reset" color="primary" flat/>
                        </router-link>
                        <q-btn label="Create" type="submit" color="primary" class="on-right"/>
                    </div>
                </q-form>
            </div>
        </oa-section>
    </q-page>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from 'vue-router';
import OaSection from "@/components/widgets/OaSection";
import {usePipelineStore} from "@/stores/pipeline";

const router = useRouter();
const pipelineStore = usePipelineStore()
const newPipeline = ref({
  status: "DISABLED",
  config: {}
});

const saveNewPipeline = () => {
  pipelineStore.createNewPipeline(newPipeline.value).then(() => {
    router.push('/pipelines')
  })
};
</script>
