<template>
  <phaedra-details-section v-if="project && project.name"
                           :object-id="project.id"
                           :object-title="project.name"
                           :collapsible="collapsible">
    <template v-slot:actions>
      <span>
        <q-btn icon="edit" size="xs" color="positive"
               @click="showEditDialog = true" round dense>
          <q-tooltip>Edit Project</q-tooltip>
        </q-btn>
      </span>
      <span class="q-ml-sm">
        <q-btn icon="delete" size="xs" color="negative"
               @click="showDeleteDialog = true" round dense>
          <q-tooltip>Delete Project</q-tooltip>
        </q-btn>
      </span>
    </template>
    <template v-slot:readonly>
      <div class="col">
        <div>
          <UserChip :id="project.createdBy"
                    onHoverMessage="Created By" label="Created By"/>
        </div>
        <div>
          <UserChip :id="project.updatedBy"
                    onHoverMessage="Updated By" label="Updated By"/>
        </div>
      </div>
      <div class="col">
        <div>
          <DateChip :dateTime="project.createdOn"
                    onHoverMessage="Created On" label="Created On"/>
        </div>
        <div>
          <DateChip :dateTime="project.updatedOn"
                    onHoverMessage="Updated On" label="Updated On"/>
        </div>
      </div>
    </template>
    <template v-slot:editable>
      <EditableField readOnly :object="project" fieldName="description" label="Description"/>
      <TagListEditable :tags="project.tags" @addTag="onAddTag" @removeTag="onRemoveTag" />
      <AccessControlListEditable :projectAccess="project.access"
                                 @addAccess="onAddAccess" @removeAccess="onRemoveAccess"/>
    </template>
    <template v-slot:properties>
      <PropertyTable :properties="project.properties"
                     @addProperty="onAddProperty"
                     @removeProperty="onRemoveProperty"/>
    </template>
  </phaedra-details-section>

  <div v-else class="absolute-center">
    <q-badge color="negative" class="q-pa-md text-weight-bold">
      {{ errorMessage }}
    </q-badge>
  </div>

  <EditResourceDialog
    v-model:show="showEditDialog"
    :project="project"
    @valueChanged="onEdited"
  />
  <delete-dialog
    v-model:show="showDeleteDialog"
    :projects="[project]"
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

import PropertyTable from "@/components/property/PropertyTable";
import EditableField from "@/components/widgets/EditableField";
import UserChip from "@/components/widgets/UserChip";
import DeleteDialog from "@/components/widgets/DeleteDialog";
import EditResourceDialog from "@/components/widgets/EditResourceDialog";

import { useProjectStore } from "@/stores/project";
import DateChip from "@/components/widgets/DateChip.vue";
import TagListEditable from "@/components/tag/TagListEditable.vue";
import AccessControlListEditable from "@/components//widgets/AccessControlListEditable.vue";
import { useLoadingHandler } from "@/composable/loadingHandler";
import PhaedraDetailsSection from "@/components/widgets/PhaedraDetailsSection.vue";

const props = defineProps({
  project: Object,
  collapsible: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(["updated"]);

const router = useRouter();
const projectStore = useProjectStore();

const showDeleteDialog = ref(false);
const showEditDialog = ref(false);
const errorMessage = "No project selected";

const loadingHandler = useLoadingHandler();

const onEdited = async (newVal) => {
  await loadingHandler.handleLoadingDuring(
    projectStore.editProject(props.project.id, newVal)
  );
  emits("updated");
};

const onDeleted = async () => {
  await loadingHandler.handleLoadingDuring(
    projectStore.deleteProject(props.project.id)
  );
  emits("updated");
  await router.push({ name: "browseProjects" });
};

const onAddAccess = async (newAccess) => {
  newAccess["projectId"] = props.project.id;
  await loadingHandler.handleLoadingDuring(
    projectStore.createProjectAccess(newAccess)
  );
  emits("updated");
};

const onRemoveAccess = async (access) => {
  await loadingHandler.handleLoadingDuring(
    projectStore.deleteProjectAccess(access)
  );
  emits("updated");
};

const onAddTag = async (newTag) => {
  await loadingHandler.handleLoadingDuring(
    projectStore.handleAddTag(props.project.id, newTag)
  );
  emits("updated");
};

const onRemoveTag = async (tag) => {
  await loadingHandler.handleLoadingDuring(
    projectStore.handleDeleteTag(props.project.id, tag)
  );
  emits("updated");
};

const onAddProperty = async (newProperty) => {
  await loadingHandler.handleLoadingDuring(
    projectStore.handleAddProperty(props.project.id, newProperty)
  );
  emits("updated");
};

const onRemoveProperty = async (property) => {
  await loadingHandler.handleLoadingDuring(
    projectStore.handleDeleteProperty(props.project.id, property)
  );
  emits("updated");
};
</script>
