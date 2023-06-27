<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="protocol" @click="resetStores">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Protocols'" icon="list" :to="'/protocols'"/>
    <q-breadcrumbs-el :label="protocol.name" icon="ballot"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" v-if="protocol">
    <ViewProtocol v-if="!editMode" :editMode ="editMode" :protocol="protocol" @editMode="setEditMode"/>
    <EditProtocol v-if="editMode" :editMode="editMode" :protocol="protocol" @editMode="setEditMode" @saveChanges="saveChanges"/>
  </q-page>
</template>

<script setup>
import {useRoute} from "vue-router";
import {computed, ref} from "vue";
import {useProtocolStore} from "@/stores/protocol";
import {useFormulasStore} from "@/stores/formulas";
import {useFeatureStore} from "@/stores/feature";
import ViewProtocol from "@/components/protocol/ViewProtocol";
import EditProtocol from "@/components/protocol/EditProtocol";

const route = useRoute();
const protocolStore = useProtocolStore();
const featureStore = useFeatureStore()

const protocolId = parseInt(route.params.id);
protocolStore.loadProtocol(protocolId)

const protocol = computed(() => {
  return protocolStore.protocol
})

const formulasStore = useFormulasStore();
formulasStore.loadAllFormulas();

const editMode = ref(false)
const setEditMode = (input) => {
  editMode.value = input
}

const saveChanges = () => {
  protocolStore.saveProtocol().then(() => {
    console.info("Protocol saved successfully!!")
  })
}

const resetStores = () => {
  protocolStore.$reset()
  featureStore.$reset()
}
</script>
