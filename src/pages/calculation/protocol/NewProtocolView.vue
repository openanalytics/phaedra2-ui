<template>
    <q-breadcrumbs class="oa-breadcrumb" v-if="newProtocol" @click="resetStores">
        <q-breadcrumbs-el icon="home" :to="{ name: 'workbench'}"/>
        <q-breadcrumbs-el label="Protocols" icon="list" :to="'/protocols'"/>
        <q-breadcrumbs-el label="New Protocol" icon="ballot"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <div class="q-pa-sm">
            <oa-section title="New Protocol" icon="ballot">
                <div class="row q-pa-md">
                    <div class="col-10">
                        <q-input v-model="newProtocol.name" label="Name:" dense/>
                        <q-input v-model="newProtocol.description" label="Description:" dense/>
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
        <div class="q-pa-sm">
            <FeatureList :protocol="newProtocol" @addFeature="addNewFeature"/>
        </div>
    </q-page>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

import {useProtocolStore} from "@/stores/protocol";
import {useFeatureStore} from "@/stores/feature";

import OaSection from "@/components/widgets/OaSection.vue";
import FeatureList from "@/components/feature/FeatureList.vue";

const router = useRouter();
const protocolStore = useProtocolStore();
const featureStore = useFeatureStore();

const props = defineProps(['protocol'])
const newProtocol = ref({})

onMounted(() => {
  resetStores()
  newProtocol.value = {
    name: null,
    description: null,
    lowWelltype: null,
    highWellType: null,
    versionNumber: null,
    features: [],
    tags: [],
    properties: []
  }
})


const wellTypeOptions = ['LC', 'HC', 'NC', 'PC'];

const saveProtocol = () => {
    newProtocol.value.createdOn = new Date();
    protocolStore.createProtocol(newProtocol.value).then(protocol => {
      router.push({path: '/protocol/' + protocol?.id})
    })
}

const addNewFeature = (newFeature) => {
    newProtocol.value.features.push(newFeature)
}

const resetStores = () => {
    protocolStore.reset()
    featureStore.reset()
}
</script>
