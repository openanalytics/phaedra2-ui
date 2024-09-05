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
              {{ wellStore.well.description }}
            </template>
          </q-field>
          <q-field label="Status" stack-label borderless dense>
            <template v-slot:control>
              {{wellStore.well.status}}
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
              {{WellUtils.getWellCoordinate(wellStore.well.row, wellStore.well.column)}}
            </template>
          </q-field>
          <q-field label="Row x Column" stack-label borderless dense>
            <template v-slot:control>
              {{wellStore.well.row}} x {{wellStore.well.column}}
            </template>
          </q-field>
          <q-field label="Well Type" stack-label borderless dense>
            <template v-slot:control>
              {{wellStore.well.wellType}}
            </template>
          </q-field>
        </div>

        <div class="col-4">
          <PropertyTable :properties="wellStore.well.properties"
                         @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
        </div>

        <div class="col-2">
          <div class="row justify-end">
            <q-btn size="sm" icon="delete" class="oa-action-button" label="Reject"
                   @click="handleRejectWells"/>
          </div>
          <div class="row justify-end">
            <q-btn size="sm" icon="calculate" class="oa-action-button" label="Accept"
                   @click="handleAcceptWells"/>
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
import TagList from "@/components/tag/TagList.vue";
import WellUtils from "../../lib/WellUtils";

const emit = defineEmits(['wellStatusChanged'])

const wellStore = useWellStore()

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

const handleRejectWells = async () => {
  if (wellStore.well) {
    await wellStore.rejectWell( 'REJECTED_PHAEDRA', 'Well rejection from chart!')
    emit('wellStatusChanged')
  }
}

const handleAcceptWells = async () => {
  if (wellStore.well) {
    await wellStore.acceptWell()
    emit('wellStatusChanged')
  }
}

</script>

<style scoped>

</style>
