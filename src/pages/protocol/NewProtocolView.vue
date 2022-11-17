<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="newProtocol" @click="resetStores">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Protocols'" icon="list" :to="'/protocols'"/>
    <q-breadcrumbs-el :label="newProtocol.name" icon="ballot"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <NewProtocol :protocol="newProtocol"/>
  </q-page>
</template>

<script setup>
import NewProtocol from "@/components/protocol/NewProtocol";
import {ref} from "vue";

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

</script>
