<template>
    <q-breadcrumbs class="oa-breadcrumb" v-if="newProtocol" @click="resetStores">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el label="Protocols" icon="list" :to="'/protocols'"/>
        <q-breadcrumbs-el label="New Protocol" icon="ballot"/>
    </q-breadcrumbs>
    
    <q-page class="oa-root-div">
        <div class="q-pa-md">
            <oa-section title="New Protocol" icon="ballot">
                <div class="row q-pa-md">
                    <div class="col-10">
                        <q-input v-model="newProtocol.name" label="Name:" dense/>
                        <q-input v-model="newProtocol.description" label="Description:" dense/>
                        <q-select v-model="newProtocol.lowWelltype" label="Low well type:" :options="wellTypeOptions" dense/>
                        <q-select v-model="newProtocol.highWelltype" label="High well type:" :options="wellTypeOptions" dense/>
                        <q-input v-model="newProtocol.versionNumber" label="Version:" mask="#.#.#" hint="Mask: #.#.#, Example: 1.0.0" dense/>
                    </div>
                    <div class="col-2">
                        <div class="row justify-end">
                            <router-link :to="{ name: 'importProtocol' }" class="nav-link">
                                <q-btn size="sm" label="Import ..." class="oa-action-button" />
                            </router-link>
                        </div>
                        <div class="row justify-end">
                            <q-btn size="sm" label="Save" @click="saveProtocol()" class="oa-action-button"/>
                        </div>
                        <div class="row justify-end">
                            <router-link :to="{ name: 'browseProtocols' }" class="nav-link">
                                <q-btn size="sm" label="Cancel" class="oa-action-button"/>
                            </router-link>
                        </div>
                    </div>
                </div>
            </oa-section>
        </div>
        <div class="q-px-md">
            <FeatureList :protocol="newProtocol" @addFeature="addNewFeature"/>
        </div>
    </q-page>
</template>

<script setup>
import {useStore} from "vuex";
import {ref} from "vue";
import {useRouter} from "vue-router";

import {useProtocolStore} from "@/stores/protocol";
import {useFeatureStore} from "@/stores/feature";

import OaSection from "@/components/widgets/OaSection";
import FeatureList from "@/components/feature/FeatureList";

const store = useStore();
const router = useRouter();
const protocolStore = useProtocolStore();
const featureStore = useFeatureStore();

const props = defineProps(['protocol'])
const newProtocol = ref({
    name: null,
    description: null,
    lowWelltype: null,
    highWellType: null,
    versionNumber: null,
    features: [],
    tags: [],
    properties: []
});

const wellTypeOptions = ['LC', 'HC', 'NC', 'PC'];

const saveProtocol = () => {
    newProtocol.value.createdOn = new Date();
    store.dispatch("protocols/saveNewProtocol", newProtocol.value)
    .then(protocol => {
        router.push({path: '/protocol/' + protocol?.id});
    })
}

const addNewFeature = (newFeature) => {
    newProtocol.value.features.push(newFeature)
}

const resetStores = () => {
    protocolStore.$reset()
    featureStore.$reset()
}
</script>
