<template>
  <div class="q-pa-sm">
    <oa-section v-if="!plateStore.plate" title="Loading plate..." icon="view_module"/>
    <oa-section v-else :title="plateStore.plate.barcode" icon="view_module" :collapsible="true">
      <div class="row q-pa-sm">
        <div class="col-3">
          <q-field label="ID" stack-label borderless dense>
            <template v-slot:control>
              {{ plateStore.plate.id }}
            </template>
          </q-field>
          <q-field label="Description" stack-label borderless dense>
            <template v-slot:control>
              <EditableField :object="plateStore.plate" fieldName="description" :read-only="readOnly"
                             @valueChanged="onDescriptionChanged"/>
            </template>
          </q-field>
          <q-field label="Tags" stack-label dense borderless>
            <template v-slot:control>
              <tag-list :tags="plateStore.plate.tags" :read-only="readOnly"
                        @addTag="onAddTag" @removeTag="onRemoveTag"
                        class="q-pt-xs"/>
            </template>
          </q-field>
        </div>

        <div class="col-3">
          <q-field label="Dimensions" stack-label borderless dense>
            <template v-slot:control>
              {{ plateStore.plate.rows }} x {{ plateStore.plate.columns }} ({{ plateStore.plate.rows * plateStore.plate.columns }} wells)
            </template>
          </q-field>
          <q-field label="Created On" stack-label dense borderless>
            <template v-slot:control>
              {{ FormatUtils.formatDate(plateStore.plate.createdOn) }}
            </template>
          </q-field>
          <q-field label="Created By" stack-label dense borderless>
            <template v-slot:control>
              <UserChip :id="plateStore.plate.createdBy"/>
            </template>
          </q-field>
        </div>

        <div class="col-4">
          <PropertyTable :properties="plateStore.plate.properties" :read-only="readOnly"
                         @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
        </div>

        <div class="col-2" v-if="!readOnly">
          <div class="row justify-end">
            <q-btn size="sm" icon="edit" label="Rename" class="oa-action-button" @click="showRenameDialog = true"/>
          </div>
          <div class="row justify-end">
            <q-btn size="sm" icon="delete" class="oa-action-button" label="Delete" @click="showDeleteDialog = true"/>
          </div>
          <div class="row justify-end">
            <q-btn size="sm" icon="calculate" class="oa-action-button" label="Recalculate" @click="showCalculateDialog = true"/>
          </div>
        </div>
      </div>
    </oa-section>
  </div>

  <rename-dialog v-model:show="showRenameDialog" objectClass="plate" fieldName="barcode" :object="plateStore.plate" @valueChanged="onNameChanged"/>
  <delete-dialog v-model:show="showDeleteDialog" :id="plateStore.plate.id" :name="plateStore.plate.barcode" :objectClass="'plate'" @onDeleted="onDeleted"/>
</template>

<script setup>
import FormatUtils from "@/lib/FormatUtils";
import {usePlateStore} from "@/stores/plate";
import {ref} from "vue";
import TagList from "@/components/tag/TagList"
import UserChip from "@/components/widgets/UserChip";
import EditableField from "@/components/widgets/EditableField";
import PropertyTable from "@/components/property/PropertyTable"
import OaSection from "@/components/widgets/OaSection";
import RenameDialog from "@/components/widgets/RenameDialog.vue";
import DeleteDialog from "@/components/widgets/DeleteDialog.vue";
import {useExperimentStore} from "@/stores/experiment";

const experimentStore = useExperimentStore()
const plateStore = usePlateStore()

const showDeleteDialog = ref(false);
const showRenameDialog = ref(false);

const readOnly = ref(plateStore.isApproved || experimentStore.isClosed)

const onNameChanged = async (newBarcode) => {
  await plateStore.renamePlate(newBarcode)
};

const onDescriptionChanged = async (newDescription) => {
  await plateStore.editPlateDescription(newDescription)
};

const onDeleted = async () => {
  await plateStore.deletePlate()
  await router.push({name: 'experiment', params: {id: experimentStore.experiment.id}})
}

const onAddTag = async (newTag) => {
  await plateStore.addTag(newTag)
}

const onRemoveTag = async (tag) => {
  await plateStore.deleteTag(tag)
}

const onAddProperty = async (newProperty) => {
  await plateStore.addPropertty(newProperty)
}

const onRemoveProperty = async (property) => {
  await plateStore.deleteProperty(property)
}
</script>

<style scoped>

</style>
