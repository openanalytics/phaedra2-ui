<template>
    <div class="q-pa-md">
      <oa-section-header :title="'Edit Protocol'" :icon="'ballot'"/>

      <div class="row q-pa-md oa-section-body">
        <div class="col-5 q-gutter-xs">
          <q-input v-model="editProtocol.name" label="Name: "/>
          <q-input v-model="editProtocol.description" label="Description: "/>
          <q-select v-model="editProtocol.lowWelltype" label="Low well type:" :options="wellTypeOptions"/>
          <q-select v-model="editProtocol.highWelltype" label="High well type:" :options="wellTypeOptions"/>
          <q-input v-model="editProtocol.versionNumber" label="Version:" mask="#.#.#" hint="Mask: #.#.#, Example: 1.0.0"/>
        </div>

        <div class="col-6">
          <PropertyTable :objectInfo="editProtocol" :objectClass="'PROTOCOL'"/>
        </div>

        <div class="col-1 q-gutter-xs">
          <div class="row justify-end">
            <router-link :to="{ name: 'importProtocol' }" class="nav-link">
              <q-btn flat size="sm" color="secondary" icon="import_export" class="oa-button-delete" label="Import"/>
            </router-link>
          </div>
          <div class="row justify-end">
            <q-btn flat size="sm" label="Save" color="secondary" icon="save" class="oa-button-edit" @click="saveProtocol()" />
          </div>
          <div class="row justify-end">
              <q-btn flat size="sm" label="Cancel" color="secondary" icon="cancel" class="oa-button-edit" @click="$emit('editMode',false)"/>
          </div>
        </div>

      </div>
    </div>
</template>

<script setup>

import {useStore} from "vuex";
import {ref} from "vue";
import OaSectionHeader from "@/components/widgets/OaSectionHeader";
import PropertyTable from "@/components/property/PropertyTable";

const props = defineProps(['show', 'protocol']);
const emit = defineEmits(['editMode', 'updateProtocol']);

const store = useStore();

//TODO: Make external and hardcoded!!
const wellTypeOptions = ['LC', 'HC', 'NC', 'PC'];
const editProtocol = ref({...props.protocol});

const saveProtocol = () => {
  store.dispatch('protocols/editProtocol', editProtocol.value)
  emit('editMode', false)
}
</script>
