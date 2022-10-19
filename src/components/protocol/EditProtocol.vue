<template>
    <div class="q-pa-md">
      <oa-section-header :title="'Edit Protocol'" :icon="'ballot'"/>

      <div class="col q-pa-md oa-section-body">
        <div class="row q-pa-md">
          <div class="col-5 q-gutter-xs">
            <q-input v-model="protocolStore.protocol.name" label="Name: "/>
            <q-input v-model="protocolStore.protocol.description" label="Description: "/>
            <q-select v-model="protocolStore.protocol.lowWelltype" label="Low well type:" :options="wellTypeOptions"/>
            <q-select v-model="protocolStore.protocol.highWelltype" label="High well type:" :options="wellTypeOptions"/>
            <q-input v-model="protocolStore.protocol.versionNumber" label="Version:" mask="#.#.#"
                     hint="Mask: #.#.#, Example: 1.0.0"/>
            <q-field label="Tags" stack-label readonly dense borderless>
              <template v-slot:control>
                <div class="q-pt-sm">
                  <TagList label="Tags" :objectInfo="protocolStore.protocol" :objectClass="'PROTOCOL'"/>
                </div>
              </template>
            </q-field>
          </div>

          <div class="col-6">
            <PropertyTable :objectInfo="protocolStore.protocol" :objectClass="'PROTOCOL'"/>
          </div>

          <div class="col-1 q-gutter-xs">
            <div class="row justify-end">
              <router-link :to="{ name: 'importProtocol' }" class="nav-link">
                <q-btn flat size="sm" color="secondary" icon="import_export" class="oa-button-delete" label="Import"/>
              </router-link>
            </div>
            <div class="row justify-end">
              <q-btn flat size="sm" label="Save" color="secondary" icon="save" class="oa-button-edit"
                     @click="saveProtocol()"/>
            </div>
            <div class="row justify-end">
              <q-btn flat size="sm" label="Cancel" color="secondary" icon="cancel" class="oa-button-edit"
                     @click="$emit('editMode',false)"/>
            </div>
          </div>

        </div>
        <q-separator inset />
        <FeatureList :protocol="protocolStore.protocol" :editMode="props.editMode" @addFeature="addNewFeature"/>
      </div>
    </div>
</template>

<script setup>

import {useStore} from "vuex";
import {ref} from "vue";
import {useProtocolStore} from "@/stores/protocol";
import OaSectionHeader from "@/components/widgets/OaSectionHeader";
import PropertyTable from "@/components/property/PropertyTable";
import TagList from "@/components/tag/TagList";
import FeatureList from "@/components/feature/FeatureList";

const props = defineProps(['editMode', 'protocol']);
const emit = defineEmits(['editMode', 'updateProtocol']);

const store = useStore();
const protocolStore = useProtocolStore();

//TODO: Make external and hardcoded!!
const wellTypeOptions = ['LC', 'HC', 'NC', 'PC'];
const editProtocol = ref({...props.protocol});

const saveProtocol = () => {
  emit('saveChanges', editProtocol.value)
  emit('editMode', false)
}

const addNewFeature = (feature) => {
  store.dispatch('features/addNewFeatureToProtocol', feature)
}
</script>
