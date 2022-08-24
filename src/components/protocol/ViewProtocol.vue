<template>
  <div v-if="props.protocol" class="q-pa-md">
    <oa-section-header :title="props.protocol.name" :icon="'ballot'"/>

    <div class="row q-pa-md oa-section-body">
      <div class="col-5 q-gutter-xs">
        <q-field label="Name" stack-label readonly dense borderless>
          <template v-slot:control>
            <div class="self-center full-width no-outline">{{ props.protocol.name }}</div>
          </template>
        </q-field>
        <q-field label="Description" stack-label readonly dense borderless>
          <template v-slot:control>
            <div class="self-center full-width no-outline">{{ props.protocol.description }}</div>
          </template>
        </q-field>
        <q-field label="Low well type" stack-label readonly dense borderless>
          <template v-slot:control>
            <div class="self-center full-width no-outline">{{ props.protocol.lowWelltype }}</div>
          </template>
        </q-field>
        <q-field label="High well type" stack-label readonly dense borderless>
          <template v-slot:control>
            <div class="self-center full-width no-outline">{{ props.protocol.highWelltype }}</div>
          </template>
        </q-field>
        <q-field label="Version" stack-label readonly dense borderless>
          <template v-slot:control>
            <div class="self-center full-width no-outline">{{props. protocol.versionNumber }}</div>
          </template>
        </q-field>
        <q-field label="Created On" stack-label readonly dense borderless>
          <template v-slot:control>
            <div>{{ FormatUtils.formatDate(props.protocol.createdOn) || '-' }} <span class="text-weight-bold"> by </span>
              {{ props.protocol.createdBy || '-' }}
            </div>
          </template>
        </q-field>
        <q-field label="Updated On" stack-label readonly dense borderless>
          <template v-slot:control>
            <div>{{ FormatUtils.formatDate(props.protocol.updatedOn) || '-' }} <span class="text-weight-bold"> by </span>
              {{ props.protocol.updatedBy || '-' }}
            </div>
          </template>
        </q-field>
        <TagList :label="'Tags'" :objectInfo="props.protocol" :objectClass="'PROTOCOL'" :read-only="true"/>
      </div>

      <div class="col-6">
        <PropertyTable :objectInfo="props.protocol" :objectClass="'PROTOCOL'"/>
      </div>

      <div class="col-1 q-gutter-xs">
        <div class="row justify-center">
          <q-btn flat size="sm" color="secondary" icon="edit" class="oa-button-edit" label="Edit"
                 @click="$emit('editMode', true)"/>
        </div>
        <div class="row justify-center">
          <q-btn flat size="sm" color="secondary" icon="delete" class="oa-button-delete" label="Delete"
                 @click="openDeleteDialog"/>
        </div>
        <div class="row justify-center">
          <q-btn flat size="sm" color="secondary" icon="import_export" class="oa-button-delete" label="Export"
                 @click="exportToJson(protocolId)"/>
        </div>
      </div>

    </div>
  </div>

  <DeleteDialog v-if="props.protocol" :id="props.protocol.id" :name="props.protocol.name" :objectClass="'protocol'"
                v-model:show="showDialog"/>
</template>

<script setup>

import {useStore} from "vuex";
import {ref} from "vue";
import OaSectionHeader from "@/components/widgets/OaSectionHeader";
import FormatUtils from "@/lib/FormatUtils.js"
import TagList from "@/components/tag/TagList";
import PropertyTable from "@/components/property/PropertyTable";
import DeleteDialog from "@/components/widgets/DeleteDialog";

const props = defineProps(['editMode', 'protocol']);
const emit = defineEmits(['editMode']);

const store = useStore()

const showDialog = ref(false)

const exportToJson = (id) => {
  store.dispatch('protocols/downloadAsJson', id)
}

const openDeleteDialog = () => {
  showDialog.value = true;
}
</script>
