<template>
  <div class="row q-pa-md" v-if="project">
    <div class="col-3">
      <q-field label="ID" stack-label dense borderless>
        <template v-slot:control>
          {{ project.id }}
        </template>
      </q-field>
      <q-field label="Description" stack-label dense borderless>
        <template v-slot:control>
          <EditableField
            :object="project"
            fieldName="description"
            @valueChanged="onDescriptionChanged"
          />
        </template>
      </q-field>
      <q-field label="Tags" stack-label dense borderless>
        <template v-slot:control>
          <tag-list
            :tags="project.tags"
            @addTag="onAddTag"
            @removeTag="onRemoveTag"
            class="q-pt-xs"
          />
        </template>
      </q-field>
    </div>

    <div class="col-3 q-pl-md">
      <q-field label="Created On" stack-label dense borderless>
        <template v-slot:control>
          {{ FormatUtils.formatDate(project.createdOn) }}
        </template>
      </q-field>
      <q-field label="Created By" stack-label dense borderless>
        <template v-slot:control>
          <UserChip :id="project.createdBy" />
        </template>
      </q-field>
      <q-field label="Access" stack-label dense borderless>
        <template v-slot:control>
          <AccessControlList
            :projectAccess="project.access"
            @addAccess="onAddAccess"
            @removeAccess="onRemoveAccess"
            class="q-mt-xs"
          />
        </template>
      </q-field>
    </div>

    <div class="col-4">
      <PropertyTable
        :properties="project.properties"
        @addProperty="onAddProperty"
        @removeProperty="onRemoveProperty"
      />
    </div>

    <div class="col-2">
      <div class="row justify-end">
        <q-btn
          size="sm"
          icon="edit"
          label="Rename"
          class="oa-action-button"
          @click="showRenameDialog = true"
        />
      </div>
      <div class="row justify-end">
        <q-btn
          size="sm"
          icon="delete"
          label="Delete"
          class="oa-action-button"
          @click="openDeleteDialog"
        />
      </div>
    </div>
  </div>

  <div v-else class="absolute-center">
    <q-badge color="negative" class="q-pa-md text-weight-bold">{{
      errorMessage
    }}</q-badge>
  </div>

  <rename-dialog
    v-model:show="showRenameDialog"
    objectClass="project"
    :object="project"
    @valueChanged="onNameChanged"
  />
  <delete-dialog
    v-model:show="showDeleteDialog"
    :id="project?.id"
    :name="project?.name"
    :objectClass="'project'"
    @onDeleted="onDeleted"
  />
</template>

<style scoped lang="scss">
.action-button {
  margin: 3px;
}
</style>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import TagList from "@/components/tag/TagList";
import PropertyTable from "@/components/property/PropertyTable";
import EditableField from "@/components/widgets/EditableField";
import UserChip from "@/components/widgets/UserChip";
import AccessControlList from "@/components/widgets/AccessControlList";
import DeleteDialog from "@/components/widgets/DeleteDialog";
import RenameDialog from "@/components/widgets/RenameDialog";

import FormatUtils from "@/lib/FormatUtils.js";
import { useProjectStore } from "@/stores/project";

const props = defineProps({
  project: Object,
});

const router = useRouter();
const projectStore = useProjectStore();

const showDeleteDialog = ref(false);
const showRenameDialog = ref(false);
const errorMessage = "No project selected";

const onNameChanged = async (newName) => {
  await projectStore.renameProject(newName);
};

const onDescriptionChanged = async (newDescription) => {
  await projectStore.editProjectDescription(newDescription);
};

const onDeleted = async () => {
  await projectStore.deleteProject();
  await router.push({ name: "browseProjects" });
};

const onAddAccess = async (newAccess) => {
  await projectStore.createProjectAccess(newAccess);
};

const onRemoveAccess = async (access) => {
  await projectStore.deleteProjectAccess(access);
};

const onAddTag = async (newTag) => {
  await projectStore.handleAddTag(newTag);
};

const onRemoveTag = async (tag) => {
  await projectStore.handleDeleteTag(tag);
};

const onAddProperty = async (newProperty) => {
  await projectStore.handleAddProperty(newProperty);
};

const onRemoveProperty = async (property) => {
  await projectStore.handleDeleteProperty(property);
};

const openDeleteDialog = () => {
  showDeleteDialog.value = true;
};
</script>
