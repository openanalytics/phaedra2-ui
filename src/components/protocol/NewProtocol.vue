<template>
  <div class="q-pa-md">
    <oa-section-header :title="'New Protocol'" :icon="'ballot'"/>

    <div class="col q-pa-md oa-section-body">
      <div class="row q-pa-md">
        <div class="col-4 q-gutter-xs">
          <q-input v-model="newProtocol.name" label="Name:" dense/>
          <q-input v-model="newProtocol.description" label="Description:" dense/>
          <q-select v-model="newProtocol.lowWelltype" label="Low well type:" :options="wellTypeOptions" dense/>
          <q-select v-model="newProtocol.highWelltype" label="High well type:" :options="wellTypeOptions" dense/>
          <q-input v-model="newProtocol.versionNumber" label="Version:" mask="#.#.#" hint="Mask: #.#.#, Example: 1.0.0" dense/>
        </div>

        <div class="col-7">
          <PropertyTable :objectInfo="newProtocol" :objectClass="'PROTOCOL'"/>
        </div>

        <div class="col-1 q-gutter-xs">
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
    <div class="q-pt-md">
      <FeatureList :protocol="newProtocol" @addFeature="addNewFeature"/>
    </div>
  </div>

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

const props = defineProps(['protocol'])
const newProtocol = ref(props.protocol)

const name = "NewProtocolView";
const wellTypeOptions = ['LC', 'HC', 'NC', 'PC'];

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

<style scoped>

</style>
