<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench'}"/>
    <q-breadcrumbs-el label="Capture Scripts" icon="data_object" to="/datacapture/scripts"/>
    <q-breadcrumbs-el :label="script.name" icon="data_object"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <phaedra-details-section>
        <template v-slot:title>
          <span>
            <q-icon name="data_object" size="md"/>
            {{ script.name }}
          </span>
          <span class="q-mx-sm" style="font-size: 0.7em">
            ({{ script.id }})
            <q-tooltip>ID</q-tooltip>
          </span>
        </template>
        <template v-slot:actions>
          <span v-show="!editMode" class="q-ml-xs">
            <q-btn size="xs" color="positive" icon="edit"
                 @click="editMode = true" round dense/>
          </span>
          <span v-show="editMode" class="q-ml-xs">
            <q-btn size="xs" color="positive" icon="save"
                 @click="exitEditMode(true)" round dense/>
          </span>
          <span v-show="editMode" class="q-ml-xs">
            <q-btn size="xs" color="negative" icon="cancel"
                 @click="exitEditMode(false)" round dense/>
          </span>
          <span v-show="!editMode" class="q-ml-xs">
            <q-btn size="xs" color="negative" icon="delete"
                 @click="showDeleteDialog = true" round dense/>
          </span>
        </template>
        <template v-slot:readonly>
          <div class="col">
            <div>
              <user-chip :id="script.createdBy" label="Created By"
                         on-hover-message="Created By"/>
            </div>
            <div>
              <date-chip :date-time="script.createdOn" label="Created On"
                         on-hover-message="Created On"/>
            </div>
          </div>
          <div class="col">
            <div>
              <user-chip :id="script.updatedBy" label="Updated By"
                         on-hover-message="Updated By"/>
            </div>
            <div>
              <date-chip :date-time="script.updatedOn" label="Updated On"
                         on-hover-message="Updated On"/>
            </div>
          </div>
        </template>
        <template v-slot:editable>
          <div class="row">
            <div class="col">
              <editable-field :object="script" field-name="name"
                              :read-only="!editMode" label="Name"
                              @value-changed="(value) => script.name = value"/>
              <editable-field :object="script" field-name="description"
                              :read-only="!editMode" label="Description"
                              @value-changed="(value) => script.description = value"/>
            </div>
            <div class="col">
              <editable-field :object="script" field-name="version"
                              :read-only="!editMode" label="Version"
                              @value-changed="(value) => script.version = value"/>
            </div>
          </div>
          <tag-list-editable :tags="script.tags"
                             @addTag="onAddTag" @removeTag="onRemoveTag"/>
        </template>
        <template v-slot:properties>
          <property-table :properties="script.properties"
                          @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
        </template>
      </phaedra-details-section>
      <oa-section title="Code" class="q-pt-sm" icon="data_object">
          <codemirror :disabled="!editMode" :extensions="editorConfig.extensions"
                      v-model="script.value"/>
      </oa-section>
    </div>
  </q-page>

  <delete-dialog v-model:id="script.id" v-model:name="script.name" v-model:show="showDeleteDialog"
                 objectClass="script" @onDeleted="confirmDelete"/>
</template>

<script setup>
import {ref} from 'vue'
import {useStore} from "vuex";
import {useRoute, useRouter} from 'vue-router';
import {Codemirror} from 'vue-codemirror';
import {javascript} from '@codemirror/lang-javascript';
import OaSection from "@/components/widgets/OaSection";
import UserChip from "@/components/widgets/UserChip";
import DeleteDialog from "@/components/widgets/DeleteDialog";
import PhaedraDetailsSection from "@/components/widgets/PhaedraDetailsSection.vue";
import DateChip from "@/components/widgets/DateChip.vue";
import EditableField from "@/components/widgets/EditableField.vue";
import PropertyTable from "@/components/property/PropertyTable.vue";
import TagListEditable from "@/components/tag/TagListEditable.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();

const scriptId = parseInt(route.params.id);
const blankScript = {
  name: 'New Script',
  value: '// Enter script code here'
};
const script = ref(blankScript);
const getWorkingCopy = () => {
  let originalScript = store.getters['datacapture/getCaptureScriptById'](scriptId) || blankScript;
  // Return a shallow copy of the script for editing
  script.value = {...originalScript};
}

const isNewScript = (route.params.id == 'new');
if (!isNewScript) {
  store.dispatch('datacapture/loadCaptureScriptById', scriptId).then(getWorkingCopy);
}

const editMode = ref(isNewScript);
const exitEditMode = async (saveChanges) => {
  editMode.value = false;
  if (saveChanges) {
    if (isNewScript) {
      let newScript = await store.dispatch('datacapture/createCaptureScript', script.value);
      router.push(`/datacapture/script/${newScript.id}`);
    } else {
      await store.dispatch('datacapture/updateCaptureScript', script.value);
      getWorkingCopy();
    }
  } else {
    if (isNewScript) {
      router.push("/datacapture/scripts");
    } else {
      getWorkingCopy();
    }
  }
};

const editorConfig = {
  extensions: [javascript()]
};

const showDeleteDialog = ref(false);
const confirmDelete = async () => {
  await store.dispatch('datacapture/deleteCaptureScript', scriptId);
  router.push("/datacapture/scripts");
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
