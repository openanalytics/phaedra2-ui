<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="newProtocol" @click="resetStores">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Protocols'" icon="list" :to="'/protocols'"/>
    <q-breadcrumbs-el :label="newProtocol.name" icon="ballot"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-md">
      <oa-section-header :title="'New Protocol'" :icon="'ballot'"/>

      <div class="row q-pa-md oa-section-body">
        <div class="col-5 q-gutter-xs">
            <q-input v-model="newProtocol.name" label="Name: "/>
            <q-input v-model="newProtocol.description" label="Description: "/>
            <q-select v-model="newProtocol.lowWelltype" label="Low well type:" :options="wellTypeOptions"/>
            <q-select v-model="newProtocol.highWelltype" label="High well type:" :options="wellTypeOptions"/>
            <q-input v-model="newProtocol.versionNumber" label="Version:" mask="#.#.#" hint="Mask: #.#.#, Example: 1.0.0"/>
        </div>

        <div class="col-1"/>

        <div class="col-4">
          <PropertyTable :objectInfo="newProtocol" :objectClass="'PROTOCOL'"/>
        </div>

        <div class="col-2 q-gutter-xs">
          <div class="row justify-end">
            <router-link :to="{ name: 'importProtocol' }" class="nav-link">
              <q-btn size="sm" label="Import ..." color="primary" class="oa-button-delete" />
            </router-link>
          </div>
          <div class="row justify-end">
            <q-btn size="sm" label="Save" @click="saveProtocol()" color="primary" class="oa-button-edit"/>
          </div>
          <div class="row justify-end">
            <router-link :to="{ name: 'browseProtocols' }" class="nav-link">
              <q-btn size="sm" label="Cancel" @click="onReset" color="primary" class="oa-button-edit"/>
            </router-link>
          </div>
        </div>

      </div>
    </div>

    <FeatureList :protocol="newProtocol" @addFeature="addNewFeature"/>
  </q-page>
</template>

<script setup>
import OaSectionHeader from "../../components/widgets/OaSectionHeader";
import PropertyTable from "@/components/property/PropertyTable";
import FeatureList from "@/components/feature/FeatureList";
import {useProtocolStore} from "@/stores/protocol";
import {useFeatureStore} from "@/stores/feature";

import {useStore} from "vuex";
import {computed, ref} from "vue";
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();
const protocolStore = useProtocolStore();
const featureStore = useFeatureStore()

const name = "NewProtocolView";
const wellTypeOptions = ['LC', 'HC', 'NC', 'PC'];

const newProtocol = ref({
  name: null,
  description: null,
  lowWelltype: null,
  highWellType: null,
  versionNumber: null,
  features: [],
  tags: [],
  properties: []
})

const formulas = computed(() => store.getters['calculations/getFormulas']())
store.dispatch('calculations/getAllFormulas')

const saveProtocol = () => {
  newProtocol.value.createdOn = new Date();
  store.dispatch("protocols/saveNewProtocol", newProtocol.value)
      .then(protocol => {
        router.push({path: '/protocol/' + protocol?.id});
      })
}

const onReset = () => {
}

const addNewFeature = (newFeature) => {
  newProtocol.value.features.push(newFeature)
}

const resetStores = () => {
  protocolStore.$reset()
  featureStore.$reset()
}
</script>
