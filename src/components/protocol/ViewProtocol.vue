<template>
  <div v-if="protocolStore.protocol" class="q-pa-md">
    <oa-section :title="protocolStore.protocol.name" icon="ballot" :collapsible="true">
      <div class="row q-pa-md oa-section-body">
        <div class="col-3">
          <q-field label="ID" stack-label borderless dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline">{{ protocolStore.protocol.id }}</div>
            </template>
          </q-field>
          <q-field label="Description" stack-label borderless dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline">{{ protocolStore.protocol.description }}</div>
            </template>
          </q-field>
          <q-field label="Low Control Type" stack-label borderless dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline">{{ protocolStore.protocol.lowWelltype }}</div>
            </template>
          </q-field>
          <q-field label="High Control Type" stack-label borderless dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline">{{ protocolStore.protocol.highWelltype }}</div>
            </template>
          </q-field>
          <q-field label="Tags" stack-label borderless dense>
            <template v-slot:control>
<!--              <q-badge v-for="tag in protocolStore.protocol.tags" :key="tag" color="green">{{tag}}</q-badge>-->

              <TagList :tags="protocolStore.protocol.tags" @addTag="onAddTag" @removeTag="onRemoveTag"/>
            </template>
          </q-field>
        </div>
        <div class="col-3">
          <q-field label="Created On" stack-label dense borderless>
              <template v-slot:control>
                  {{ FormatUtils.formatDate(protocolStore.protocol.createdOn) }}
              </template>
          </q-field>
          <q-field label="Created By" stack-label dense borderless>
              <template v-slot:control>
                  <div class="q-pt-xs">
                      <UserChip :id="protocolStore.protocol.createdBy"/>
                  </div>
              </template>
          </q-field>
          <q-field label="Updated On" stack-label dense borderless>
              <template v-slot:control>
                  {{ FormatUtils.formatDate(protocolStore.protocol.updatedOn) }}
              </template>
          </q-field>
          <q-field label="Updated By" stack-label dense borderless>
              <template v-slot:control>
                  <div class="q-pt-xs">
                      <UserChip :id="protocolStore.protocol.updatedBy"/>
                  </div>
              </template>
          </q-field>
          <q-field label="Version" stack-label borderless dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline">{{ protocolStore.protocol.versionNumber }}</div>
            </template>
          </q-field>
        </div>
        <div class="col-4">
          <PropertyTable :properties="protocolStore.protocol.properties" @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
        </div>

        <div class="col-2">
          <div class="row justify-end action-button">
            <q-btn size="sm" icon="edit" class="oa-button" label="Edit" @click="$emit('editMode', true)"/>
          </div>
          <div class="row justify-end action-button">
            <q-btn size="sm" icon="import_export" class="oa-button" label="Export" @click="exportToJson(protocolId)"/>
          </div>
          <div class="row justify-end action-button">
            <q-btn size="sm" icon="delete" class="oa-button" label="Delete" @click="openDeleteDialog"/>
          </div>
        </div>
      </div>
    </oa-section>

    <div class="q-pt-md">
      <FeatureList :protocol="protocolStore.protocol" :editMode="false"/>
    </div>
  </div>

  <DeleteDialog v-if="protocolStore.protocol"
                :id="protocolStore.protocol.id"
                :name="protocolStore.protocol.name"
                :objectClass="'protocol'"
                v-model:show="showDialog"/>
</template>

<style scoped lang="scss">
.action-button {
  margin: 3px;
}
</style>

<script setup>
  import {useStore} from "vuex";
  import {ref} from "vue";
  import OaSection from "@/components/widgets/OaSection";
  import FormatUtils from "@/lib/FormatUtils.js"
  import PropertyTable from "@/components/property/PropertyTable";
  import DeleteDialog from "@/components/widgets/DeleteDialog";
  import FeatureList from "@/components/feature/FeatureList";
  import UserChip from "@/components/widgets/UserChip";
  import {useProtocolStore} from "@/stores/protocol";
  import TagList from "@/components/tag/TagList.vue";

  const props = defineProps(['editMode']);
  const emit = defineEmits(['editMode']);

  const protocolStore = useProtocolStore();

  const store = useStore();
  const showDialog = ref(false);

  const exportToJson = (id) => {
    store.dispatch('protocols/downloadAsJson', id);
  }

  const openDeleteDialog = () => {
    showDialog.value = true;
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
</script>
