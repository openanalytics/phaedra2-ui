<template>
  <phaedra-details-section v-if="template" :object-title="template.name"
                           :object-id="template.id" title-icon="border_outer">
    <template v-slot:actions>
      <span>
        <q-btn icon="edit" size="xs" color="positive"
               @click="showRenameDialog = true" round dense>
          <q-tooltip>Rename Template</q-tooltip>
        </q-btn>
      </span>
      <span class="q-ml-xs">
        <q-btn icon="delete" size="xs" color="negative"
               @click="openDeleteDialog" round dense>
          <q-tooltip>Delete Template</q-tooltip>
        </q-btn>
      </span>
    </template>
    <template v-slot:readonly>
      <div class="col-6">
        <div>
          <DimensionsChip :rows="template.rows" :columns="template.columns"
                          on-hover-message="Dimensions" calculate/>
        </div>
        <div>
          <UserChip :id="template.createdBy" on-hover-message="Created by" label="Created by"/>
        </div>
        <div>
          <DateChip :date="template.createdOn" on-hover-message="Created on" label="Created on"/>
        </div>
      </div>
      <div class="col-6">
        <div>
          <UserChip :id="template.updatedBy" on-hover-message="Updated by" label="Updated by"/>
        </div>
        <div>
          <DateChip :date="template.updatedOn" on-hover-message="Updated on" label="Updated on"/>
        </div>
      </div>
    </template>
    <template v-slot:editable>
      <EditableField :object="template" fieldName="description" label="Description"
                     @valueChanged="onDescriptionChanged"/>
      <TagListEditable :tags="template.tags" :read-only="false"
                       @addTag="onAddTag" @removeTag="onRemoveTag"/>
    </template>
    <template v-slot:properties>
      <PropertyTable :properties="template.properties"
                     @addProperty="onAddProperty" @removeProperty="onRemoveProperty"
      />
    </template>
  </phaedra-details-section>

  <edit-plate-template v-model:show="editdialog"></edit-plate-template>
  <rename-dialog v-model:show="showRenameDialog" objectClass="plate_template" fieldName="name"
                 :object="templateStore.template" @valueChanged="onNameChanged"
  />
  <delete-dialog v-if="templateStore.template" ref="deleteDialog"
                 v-model:id="templateStore.template.id"
                 v-model:name="templateStore.template.name"
                 v-model:show="showDeleteDialog"
                 :objectClass="'template'"
                 @onDeleted="onDeleted"
  />
</template>

<script setup>
import PhaedraDetailsSection from "@/components/widgets/PhaedraDetailsSection.vue";
import DimensionsChip from "@/components/plate/DimensionsChip.vue";
import EditableField from "@/components/widgets/EditableField.vue";
import TagListEditable from "@/components/tag/TagListEditable.vue";
import PropertyTable from "@/components/property/PropertyTable.vue";
import {useTemplateStore} from "@/stores/template";
import EditPlateTemplate from "@/pages/platelayout/EditPlateTemplate.vue";
import RenameDialog from "@/components/widgets/RenameDialog.vue";
import DeleteDialog from "@/components/widgets/DeleteDialog.vue";
import {ref} from "vue";
import {useLoadingHandler} from "@/composable/loadingHandler";
import UserChip from "@/components/widgets/UserChip.vue";
import DateChip from "@/components/widgets/DateChip.vue";
import {useRouter} from "vue-router";

const props = defineProps(["template"])
const templateStore = useTemplateStore();
const loadingHandler = useLoadingHandler();
const router = useRouter();

const showRenameDialog = ref(false);
const showDeleteDialog = ref(false);

const onNameChanged = async (newTemplateName) => {
  await loadingHandler.handleLoadingDuring(
      templateStore.renameTemplate(newTemplateName)
  );
};

const onDescriptionChanged = async (newDescription) => {
  await loadingHandler.handleLoadingDuring(
      templateStore.editTemplateDescription(newDescription)
  );
};

const onDeleted = async () => {
  await loadingHandler.handleLoadingDuring(templateStore.deleteTemplate());
  router.push({name: "browseTemplates"});
};

const openDeleteDialog = () => {
  showDeleteDialog.value = true;
};

const onAddTag = async (newTag) => {
  await loadingHandler.handleLoadingDuring(templateStore.handleAddTag(newTag));
};

const onRemoveTag = async (tag) => {
  await loadingHandler.handleLoadingDuring(templateStore.handleDeleteTag(tag));
};

const onAddProperty = async (newProperty) => {
  await loadingHandler.handleLoadingDuring(
      templateStore.handleAddProperty(newProperty)
  );
};

const onRemoveProperty = async (property) => {
  await loadingHandler.handleLoadingDuring(
      templateStore.handleDeleteProperty(property)
  );
};
</script>
