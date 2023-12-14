<template>
  <div class="q-pa-md">
    <oa-section :title="protocolStore.protocol.name" icon="ballot" :collapsible="true">
      <div class="row q-pa-md oa-section-body">
          <div class="col-3">
            <q-input v-model="protocolStore.protocol.name" label="Name" dense/>
            <q-input v-model="protocolStore.protocol.description" label="Description" dense/>
            <q-select v-model="protocolStore.protocol.lowWelltype" label="Low Control Type" :options="wellTypeOptions" dense/>
            <q-select v-model="protocolStore.protocol.highWelltype" label="High Control Type" :options="wellTypeOptions" dense/>
            <q-field label="Tags" stack-label readonly dense borderless>
              <template v-slot:control>
                <div class="q-pt-sm">
                  <TagList :tags="protocolStore.protocol.tags" objectClass="PROTOCOL"  @addTag="onAddTag" @removeTag="onRemoveTag"/>
                </div>
              </template>
            </q-field>
          </div>

          <div class="col-3 q-pl-sm">
            <q-input v-model="protocolStore.protocol.versionNumber" label="Version:" mask="#.#.#"
                    hint="Mask: #.#.#, Example: 1.0.0" dense/>
          </div>

          <div class="col-4">
            <PropertyTable :properties="protocolStore.protocol.properties" @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
          </div>

          <div class="col-2">
            <div class="row justify-end action-button">
              <q-btn size="sm" label="Save" icon="save" class="oa-button" @click="saveProtocol()"/>
            </div>
            <div class="row justify-end action-button">
              <router-link :to="{ name: 'importProtocol' }" class="nav-link">
                <q-btn size="sm" icon="import_export" class="oa-button" label="Import"/>
              </router-link>
            </div>
            <div class="row justify-end action-button">
              <q-btn size="sm" label="Cancel" icon="cancel" class="oa-button" @click="cancelEdit"/>
            </div>
          </div>
        </div>
      </oa-section>

      <div class="q-pt-md">
        <FeatureList :protocol="protocolStore.protocol" :editMode="props.editMode" @addFeature="addNewFeature"/>
      </div>
    </div>
</template>

<style scoped lang="scss">
.action-button {
  margin: 3px;
}
</style>

<script setup>

import {useStore} from "vuex";
import {ref} from "vue";
import {useProtocolStore} from "@/stores/protocol";

import OaSection from "@/components/widgets/OaSection";
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

const onAddTag = async (newTag) => {
  await protocolStore.addTag(newTag)
}

const onRemoveTag = async (tag) => {
  await protocolStore.deleteTag(tag)
}

const onAddProperty = async (newProperty) => {
  await protocolStore.addProperty(newProperty)
}

const onRemoveProperty = async (property) => {
  await protocolStore.deleteProperty(property)
}

const cancelEdit = () => {
  protocolStore.reloadProtocol().then(() => {
    emit('editMode', false)
  })
}
</script>
