<template>
  <div v-if="props.protocol" class="q-pa-md">
    <oa-section-header :title="props.protocol.name" :icon="'ballot'"/>

      <div class="row q-pa-md oa-section-body">
        <div class="col-4">
          <q-field label="Name" stack-label disable dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline">{{ props.protocol.name }}</div>
            </template>
          </q-field>
          <q-field label="Description" stack-label disable dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline">{{ props.protocol.description }}</div>
            </template>
          </q-field>
          <q-field label="Low well type" stack-label disable dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline">{{ props.protocol.lowWelltype }}</div>
            </template>
          </q-field>
          <q-field label="High well type" stack-label disable dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline">{{ props.protocol.highWelltype }}</div>
            </template>
          </q-field>
          <q-field label="Version" stack-label disable dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline">{{ props.protocol.versionNumber }}</div>
            </template>
          </q-field>
          <q-field label="Created On" stack-label disable dense>
            <template v-slot:control>
              <div>
                {{ FormatUtils.formatDate(props.protocol.createdOn) || '-' }}
                <span class="text-grey"> by </span>
                <UserChip :id="props.protocol.createdBy" />
              </div>
            </template>
          </q-field>
          <q-field label="Updated On" stack-label disable dense>
            <template v-slot:control>
              <div v-if="props.protocol.updatedBy">
                {{ FormatUtils.formatDate(props.protocol.updatedOn) || '-' }}
                <span class="text-grey"> by </span>
                <UserChip :id="props.protocol.updatedBy" />
              </div>
              <div v-else>
                -
              </div>
            </template>
          </q-field>
          <q-field label="Tags" stack-label disable dense>
            <template v-slot:control>
              <div class="q-pt-sm">
                <TagList label="Tags" :objectInfo="props.protocol" :objectClass="'PROTOCOL'" :read-only="!props.editMode" />
              </div>
            </template>
          </q-field>
        </div>

        <div class="col-4">
          <PropertyTable :objectInfo="props.protocol" :objectClass="'PROTOCOL'" :read-only="true"/>
        </div>

        <div class="col-4">
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

    <div class="q-pt-md">
      <FeatureList :protocol="props.protocol" :editMode="props.editMode"/>
    </div>
  </div>

  <DeleteDialog v-if="props.protocol" :id="props.protocol.id" :name="props.protocol.name" :objectClass="'protocol'"
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
  import OaSectionHeader from "@/components/widgets/OaSectionHeader";
  import FormatUtils from "@/lib/FormatUtils.js"
  import TagList from "@/components/tag/TagList";
  import PropertyTable from "@/components/property/PropertyTable";
  import DeleteDialog from "@/components/widgets/DeleteDialog";
  import FeatureList from "@/components/feature/FeatureList";
  import UserChip from "@/components/widgets/UserChip";

  const props = defineProps(['editMode', 'protocol']);
  const emit = defineEmits(['editMode']);

  const store = useStore();
  const showDialog = ref(false);

  const exportToJson = (id) => {
    store.dispatch('protocols/downloadAsJson', id);
  }

  const openDeleteDialog = () => {
    showDialog.value = true;
  }
</script>
