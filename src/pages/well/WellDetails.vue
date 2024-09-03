<template>
  <div class="q-pa-sm">
    <oa-section v-if="!wellStore.well" title="Loading well..." icon="crop_square"/>
    <oa-section v-else :title="wellStore.well.pos" icon="crop_square" :collapsible="true">
      <div class="row q-pa-sm">
        <div class="col-3">
          <q-field label="ID" stack-label borderless dense>
            <template v-slot:control>
              {{ wellStore.well.id }}
            </template>
          </q-field>
          <q-field label="Description" stack-label borderless dense>
            <template v-slot:control>
              <EditableField :object="wellStore.well" fieldName="description"
                             @valueChanged="onDescriptionChanged"/>
            </template>
          </q-field>
          <q-field label="Tags" stack-label dense borderless>
            <template v-slot:control>
              <tag-list :tags="wellStore.well.tags" @addTag="onAddTag" @removeTag="onRemoveTag"
                        class="q-pt-xs"/>
            </template>
          </q-field>
        </div>

        <div class="col-3">
          <q-field label="Position" stack-label borderless dense>
            <template v-slot:control>
              ({{ wellStore.well.row }} x {{ wellStore.well.column }})
            </template>
          </q-field>
        </div>

        <div class="col-4">
          <PropertyTable :properties="wellStore.well.properties"
                         @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
        </div>

        <div class="col-2">
          <div class="row justify-end">
            <q-btn size="sm" icon="delete" class="oa-action-button" label="Reject"/>
          </div>
          <div class="row justify-end">
            <q-btn size="sm" icon="calculate" class="oa-action-button" label="Accept"/>
          </div>
        </div>
      </div>
    </oa-section>
  </div>

</template>

<script setup>
import OaSection from "@/components/widgets/OaSection.vue";
import {useWellStore} from "@/stores/well";
import PropertyTable from "@/components/property/PropertyTable.vue";
import EditableField from "@/components/widgets/EditableField.vue";
import TagList from "@/components/tag/TagList.vue";

const wellStore = useWellStore()

const onDescriptionChanged = async (newDescription) => {
  await wellStore.editPlateDescription(newDescription)
}

const onAddTag = async (newTag) => {
  await wellStore.handleAddTag(newTag)
}

const onRemoveTag = async (tag) => {
  await wellStore.handleDeleteTag(tag)
}

const onAddProperty = async (newProperty) => {
  await wellStore.handleAddProperty(newProperty)
}

const onRemoveProperty = async (property) => {
  await wellStore.handleDeleteProperty(property)
}

</script>

<style scoped>

</style>
