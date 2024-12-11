<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench'}"/>
    <q-breadcrumbs-el label="Capture Configurations" icon="settings" to="/datacapture/configs"/>
    <q-breadcrumbs-el :label="config.name" icon="settings"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <phaedra-details-section>
        <template v-slot:title>
          <span>
            <q-icon name="settings" size="md"/>
            {{ config.name }}
          </span>
          <span class="q-mx-sm" style="font-size: 0.7em">
            ({{ config.id }})
            <q-tooltip>ID</q-tooltip>
          </span>
        </template>
        <template v-slot:actions>
          <span v-show="!editMode">
            <q-btn size="xs" icon="edit" color="positive"
                   @click="editMode = true" round dense>
              <q-tooltip>Edit Capture Config</q-tooltip>
            </q-btn>
          </span>
          <span v-show="editMode" class="q-ml-xs">
            <q-btn size="xs" icon="save" color="positive"
                   @click="exitEditMode(true)" round dense>
              <q-tooltip>Save Capture Config</q-tooltip>
            </q-btn>
          </span>
          <span v-show="editMode" class="q-ml-xs">
            <q-btn size="xs" icon="cancel" color="negative"
                   @click="exitEditMode(false)" round dense>
              <q-tooltip>Cancel</q-tooltip>
            </q-btn>
          </span>
          <span v-show="!editMode" class="q-ml-xs">
            <q-btn size="xs" icon="delete" color="negative"
                   @click="showDeleteDialog = true" round dense>
              <q-tooltip>Delete Capture Config</q-tooltip>
            </q-btn>
          </span>
        </template>
        <template v-slot:readonly>
          <div class="col">
            <div>
              <user-chip :id="config.createdBy" label="Created By"
                         on-hover-message="Created By"/>
            </div>
            <div>
              <date-chip :date-time="config.createdOn" label="Created On"
                         on-hover-message="Created On"/>
            </div>
          </div>
          <div class="col">
            <div>
              <user-chip :id="config.updatedBy" label="Updated By"
                         on-hover-message="Updated By"/>
            </div>
            <div>
              <date-chip :date-time="config.updatedOn" label="Updated On"
                         on-hover-message="Updated On"/>
            </div>
          </div>
        </template>
        <template v-slot:editable>
          <div class="row">
            <div class="col">
              <editable-field :object="config" field-name="version"
                              :read-only="!editMode" label="Version"
                              @value-changed="(value) => config.version = value"/>
              <editable-field :object="config" field-name="name"
                              :read-only="!editMode" label="Name"
                              @value-changed="(value) => config.name = value"/>
            </div>
            <div class="col">

              <editable-field :object="config" field-name="description"
                              :read-only="!editMode" label="Description"
                              @value-changed="(value) => config.description = value"/>
            </div>
          </div>
          <tag-list-editable :tags="config.tags"
                             @addTag="onAddTag" @removeTag="onRemoveTag"/>
        </template>
        <template v-slot:properties>
          <property-table :properties="config.properties"
                          @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
        </template>
      </phaedra-details-section>
      <oa-section title="Configuration" class="q-pt-sm" icon="settings">
          <codemirror :disabled="!editMode" :extensions="editorConfig.extensions"
                      v-model="config.value"/>
      </oa-section>
    </div>
  </q-page>

  <delete-dialog v-model:id="config.id" v-model:name="config.name" v-model:show="showDeleteDialog"
                 objectClass="config" @onDeleted="confirmDelete"/>
</template>

<script setup>
import {ref} from 'vue'
import {useStore} from "vuex";
import {useRoute, useRouter} from 'vue-router';
import {Codemirror} from 'vue-codemirror';
import {json} from '@codemirror/lang-json';
import OaSection from "@/components/widgets/OaSection";
import UserChip from "@/components/widgets/UserChip";
import DeleteDialog from "@/components/widgets/DeleteDialog";
import PhaedraDetailsSection from "@/components/widgets/PhaedraDetailsSection.vue";
import DateChip from "@/components/widgets/DateChip.vue";
import EditableField from "@/components/widgets/EditableField.vue";
import TagListEditable from "@/components/tag/TagListEditable.vue";
import PropertyTable from "@/components/property/PropertyTable.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();

const configId = parseInt(route.params.id);
const config = ref({});

const getWorkingCopy = () => {
  const originalConfig = store.getters['datacapture/getCaptureConfigById'](configId) || blankConfig;
  // Return a shallow copy of the config for editing
  config.value = {...originalConfig};
}

const isNewConfig = (route.params.id == 'new');
if (!isNewConfig) {
  store.dispatch('datacapture/loadCaptureConfigById', configId).then(getWorkingCopy);
}

const editMode = ref(isNewConfig);
const exitEditMode = async (saveChanges) => {
  editMode.value = false;
  if (saveChanges) {
    if (isNewConfig) {
      let newConfig = await store.dispatch('datacapture/createCaptureConfig', config.value);
      await router.push(`/datacapture/config/${newConfig.id}`);
    } else {
      await store.dispatch('datacapture/updateCaptureConfig', config.value);
      getWorkingCopy();
    }
  } else {
    if (isNewConfig) {
      await router.push("/datacapture/configs");
    } else {
      getWorkingCopy();
    }
  }
};

const editorConfig = {
  extensions: [json()]
};

const showDeleteDialog = ref(false);
const confirmDelete = async () => {
  await store.dispatch('datacapture/deleteCaptureConfig', configId);
  await router.push("/datacapture/configs");
}

const onAddTag = async (newTag) => {
  // TODO: implement add tags for formulas
}

const onRemoveTag = async (tag) => {
  // TODO: implement add tags for formulas
}

const onAddProperty = async (newProperty) => {
  // TODO: implement add properties for formulas
}

const onRemoveProperty = async (property) => {
  // TODO: implement add properties for formulas
}

</script>
