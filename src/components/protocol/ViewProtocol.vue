<template>
  <div v-if="protocolStore.protocol" class="q-pa-sm">
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
              <EditableField :object="protocolStore.protocol" fieldName="description" @valueChanged="onDescriptionChanged"/>
            </template>
          </q-field>
          <q-field label="Version" stack-label borderless dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline">{{ protocolStore.protocol.versionNumber }}</div>
            </template>
          </q-field>
          <q-field label="Tags" stack-label borderless dense>
            <template v-slot:control>
              <TagList :tags="protocolStore.protocol.tags" @addTag="onAddTag" @removeTag="onRemoveTag" class="q-pt-xs"/>
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
        </div>
        <div class="col-4">
          <PropertyTable :properties="protocolStore.protocol.properties" @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
        </div>

        <div class="col-2">
          <div class="row justify-end action-button">
            <q-btn size="sm" icon="edit" class="oa-action-button" label="Rename" @click="showRenameDialog = true"/>
          </div>
          <div class="row justify-end action-button">
            <q-btn size="sm" icon="import_export" class="oa-action-button" label="Export" @click="exportToJson"/>
          </div>
          <div class="row justify-end action-button">
            <q-btn size="sm" icon="delete" class="oa-action-button" label="Delete" @click="openDeleteDialog"/>
          </div>
        </div>
      </div>
    </oa-section>

    <div class="q-pt-sm">
      <FeatureList :protocol="protocolStore.protocol" :editMode="false"/>
    </div>
  </div>

  <rename-dialog v-model:show="showRenameDialog" objectClass="protocol" fieldName="name" :object="protocolStore.protocol" @valueChanged="onNameChanged"/>
  <delete-dialog v-if="protocolStore.protocol" :id="protocolStore.protocol.id" :name="protocolStore.protocol.name" :objectClass="'protocol'" v-model:show="showDeleteDialog" @onDeleted="onDeleted"/>
</template>

<style scoped lang="scss">
.action-button {
  margin: 3px;
}
</style>

<script setup>
  import {ref} from "vue";
  import OaSection from "@/components/widgets/OaSection";
  import FormatUtils from "@/lib/FormatUtils.js"
  import PropertyTable from "@/components/property/PropertyTable";
  import DeleteDialog from "@/components/widgets/DeleteDialog";
  import FeatureList from "@/components/feature/FeatureList";
  import UserChip from "@/components/widgets/UserChip";
  import {useProtocolStore} from "@/stores/protocol";
  import TagList from "@/components/tag/TagList.vue";
  import EditableField from "@/components/widgets/EditableField.vue";
  import RenameDialog from "@/components/widgets/RenameDialog.vue";
  import {useJsonDataExport} from "@/composable/jsonDataExport";
  import {useRouter} from "vue-router";

  const props = defineProps(['editMode']);
  const emit = defineEmits(['editMode']);

  const protocolStore = useProtocolStore();

  const exportToJson = () => {
    const filename = protocolStore.protocol.name.replaceAll(" ", "_").trim() + ".json"

    const exportProtocol = useJsonDataExport()
    exportProtocol.exportToJson(protocolStore.protocol, filename)
  }

  const showRenameDialog = ref(false)
  const onNameChanged = async (newProtocolName) => {
    await protocolStore.renameProtocol(newProtocolName)
  }

  const onDescriptionChanged = async (newDescription) => {
    await protocolStore.editProtocolDescription(newDescription)
  }
  const showDeleteDialog = ref(false);
  const openDeleteDialog = () => {
    showDeleteDialog.value = true;
  }

  const router = useRouter()
  const onDeleted = async () => {
    await protocolStore.deleteProtocol()
    await router.push({name: "browseProtocols"});
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
