<template>
  <div class="q-pa-sm">
    <phaedra-details-section v-if="protocolStore.protocol">
      <template v-slot:title>
        <div>
          <q-icon class="q-mx-sm" name="ballot" size="md"/>
          <span> {{ protocolStore.protocol.name }} </span>
          <span class="q-mx-sm" style="font-size: 0.7em">
            ({{ protocolStore.protocol.id }})
            <q-tooltip>ID</q-tooltip>
          </span>
        </div>
      </template>
      <template v-slot:actions>
        <span>
          <q-btn size="xs" icon="edit" color="positive" round dense
                 @click="showRenameDialog = true">
            <q-tooltip>Rename Protocol</q-tooltip>
          </q-btn>
        </span>
        <span class="q-ml-sm">
          <q-btn size="xs" icon="import_export" color="warning" @click="exportToJson" round dense>
            <q-tooltip>Export to JSON</q-tooltip>
          </q-btn>
        </span>
        <span class="q-ml-sm">
          <q-btn size="xs" icon="delete" color="negative" @click="openDeleteDialog" round dense>
            <q-tooltip>Delete Protocol</q-tooltip>
          </q-btn>
        </span>
      </template>
      <template v-slot:readonly>
        <div class="col-6">
          <div>
            <span style="font-size: 10px; color: rgba(0, 0, 0, 0.6)"> Version </span>
            <q-chip dense size="12">
              {{ protocolStore.protocol.versionNumber }}
              <q-tooltip>Version number</q-tooltip>
            </q-chip>
          </div>
          <div>
            <user-chip :id="protocolStore.protocol.createdBy"
                       label="Created By" on-hover-message="Created By"/>
          </div>
          <div>
            <date-chip :date-time="protocolStore.protocol.createdOn"
                       label="Created On" on-hover-message="Created On"/>
          </div>
        </div>
        <div class="col-6">
          <div>
            <user-chip :id="protocolStore.protocol.updatedBy"
                       label="Updated By" on-hover-message="Updated By"/>
          </div>
          <div>
            <date-chip :date-time="protocolStore.protocol.updatedOn"
                       label="Updated On" on-hover-message="Updated On"/>
          </div>
        </div>
      </template>
      <template v-slot:editable>
        <EditableField :object="protocolStore.protocol" fieldName="description" label="Description"
                       @valueChanged="onDescriptionChanged"/>
        <TagListEditable :tags="protocolStore.protocol.tags"
                         @addTag="onAddTag" @removeTag="onRemoveTag" />
      </template>
      <template v-slot:properties>
        <PropertyTable :properties="protocolStore.protocol.properties"
                       @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
      </template>
    </phaedra-details-section>

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
  import PropertyTable from "@/components/property/PropertyTable";
  import DeleteDialog from "@/components/widgets/DeleteDialog";
  import FeatureList from "@/components/feature/FeatureList";
  import UserChip from "@/components/widgets/UserChip";
  import {useProtocolStore} from "@/stores/protocol";
  import EditableField from "@/components/widgets/EditableField.vue";
  import RenameDialog from "@/components/widgets/RenameDialog.vue";
  import {useJsonDataExport} from "@/composable/jsonDataExport";
  import {useRouter} from "vue-router";
  import PhaedraDetailsSection from "@/components/widgets/PhaedraDetailsSection.vue";
  import DateChip from "@/components/widgets/DateChip.vue";
  import TagListEditable from "@/components/tag/TagListEditable.vue";

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
