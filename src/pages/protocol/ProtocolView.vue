<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="protocolStore.protocol" @click="resetStores">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Protocols'" icon="list" :to="'/protocols'"/>
    <q-breadcrumbs-el :label="protocolStore.protocol.name" icon="ballot"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" v-if="protocolStore.protocol">
    <ViewProtocol v-if="!editMode" :editMode ="editMode" @editMode="setEditMode"/>
    <EditProtocol v-if="editMode" :editMode="editMode" @editMode="setEditMode" @saveChanges="saveChanges"/>
  </q-page>
</template>

<script setup>
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {useProtocolStore} from "@/stores/protocol";
import {useFormulasStore} from "@/stores/formulas";
import {useFeatureStore} from "@/stores/feature";
import ViewProtocol from "@/components/protocol/ViewProtocol";
import EditProtocol from "@/components/protocol/EditProtocol";

const route = useRoute();
const protocolStore = useProtocolStore();
const featureStore = useFeatureStore()
const formulasStore = useFormulasStore();

const protocolId = parseInt(route.params.id);
onMounted(() => {
  protocolStore.loadProtocol(protocolId)
  formulasStore.loadAllFormulas();
})

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
