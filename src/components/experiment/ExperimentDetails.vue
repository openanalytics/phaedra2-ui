<template>
  <q-card v-if="experiment && experiment.name" flat bordered
        class="row justify-between" style="width: 100%">
  <q-card-section horizontal class="col-7">
    <q-card-section class="q-pt-xs justify-between" style="width: 100%">
      <div class="row align-center text-h5 q-mt-sm q-mb-xs">
        <div>
          <span>{{ experiment.name }}</span>
          <span class="q-mx-sm" style="font-size: 0.7em">
            ({{ experiment.id }})
            <q-tooltip>ID</q-tooltip>
          </span>
        </div>
        <span>
          <q-btn icon="edit" size="xs" color="positive" round dense
                 @click="showEditDialog = true">
            <q-tooltip>Edit Experiment</q-tooltip>
          </q-btn>
        </span>
        <span class="q-ml-sm">
          <q-btn v-if="experiment.status === 'OPEN'" size="xs" icon="lock" color="warning"
                 @click="handleCloseExperiment" round dense>
            <q-tooltip>Close Experiment</q-tooltip>
          </q-btn>
          <q-btn v-if="experiment.status === 'CLOSED'" size="xs" icon="lock_open" color="warning"
                 @click="handleOpenExperiment" round dense>
            <q-tooltip>Open Experiment</q-tooltip>
          </q-btn>
        </span>
        <span class="q-ml-sm">
          <q-btn icon="delete" size="xs" color="negative" round dense
                 @click="showDeleteDialog = true">
            <q-tooltip>Delete Experiment</q-tooltip>
          </q-btn>
        </span>
      </div>

      <div class="row text-caption q-mt-sm">
        <div class="col">
          <div>
            <UserChip :id="experiment.createdBy"
                      onHoverMessage="Created By" label="Created By"/>
          </div>
          <div>
            <UserChip :id="experiment.updatedBy"
                      onHoverMessage="Updated By" label="Updated By"/>
          </div>
        </div>
        <div class="col">
          <div>
            <DateChip :dateTime="experiment.createdOn"
                      onHoverMessage="Created On" label="Created On"/>
          </div>
          <div>
            <DateChip :dateTime="experiment.updatedOn"
                      onHoverMessage="Updated On" label="Updated On"/>
          </div>
        </div>
      </div>
      <div class="text-caption text-grey">
        <EditableField readOnly :object="experiment" fieldName="description"/>
        <TagListEditable :tags="experiment.tags" :read-only="experimentStore.isClosed"
                         @addTag="onAddTag" @removeTag="onRemoveTag"/>
      </div>

    </q-card-section>
  </q-card-section>

  <q-card-section class="col-grow row justify-center">
    <PropertyTable
      :properties="experiment.properties"
      @addProperty="onAddProperty"
      @removeProperty="onRemoveProperty"
    />
  </q-card-section>
</q-card>
  <div v-else class="absolute-center">
    <q-badge color="negative" class="q-pa-md text-weight-bold">{{
      errorMessage
    }}</q-badge>
  </div>

  <EditResourceDialog
    v-model:show="showEditDialog"
    :project="experiment"
    @valueChanged="onEdited"
  />
  <delete-dialog
    v-model:show="showDeleteDialog"
    :id="experimentStore.experiment?.id"
    :name="experimentStore.experiment?.name"
    :objectClass="'experiment'"
    @onDeleted="onDeleteExperiment"
  />
</template>

<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import UserChip from "@/components/widgets/UserChip";
import EditableField from "@/components/widgets/EditableField";
import PropertyTable from "@/components/property/PropertyTable";
import DeleteDialog from "@/components/widgets/DeleteDialog";
import DateChip from "@/components/widgets/DateChip.vue";
import EditResourceDialog from "@/components/widgets/EditResourceDialog";

import { useExperimentStore } from "@/stores/experiment";
import { useProjectStore } from "@/stores/project";
import TagListEditable from "../tag/TagListEditable.vue";
import { useLoadingHandler } from "@/composable/loadingHandler";

const props = defineProps(["experiment"]);
const emits = defineEmits(["updated"]);

const projectStore = useProjectStore();
const experimentStore = useExperimentStore();
const route = useRoute();
const router = useRouter();

const experimentId = parseInt(route.params.experimentId);
onMounted(async () => {
  await experimentStore.loadExperiment(experimentId);
});

watchEffect(() => {
  if (experimentStore.isLoaded(experimentId)) {
    const projectId = experimentStore.experiment.projectId;
    if (!projectStore.isLoaded(projectId)) projectStore.loadProject(projectId);
  }
});

const showEditDialog = ref(false);
const errorMessage = "No experiment selected";

const loadingHandler = useLoadingHandler();
const onEdited = async (newVal) => {
  await loadingHandler.handleLoadingDuring(
    experimentStore.editExperiment(props.experiment.id, newVal).then(() => {
      emits("updated");
    })
  );
};

const showDeleteDialog = ref(false);
const onDeleteExperiment = async () => {
  await loadingHandler.handleLoadingDuring(
    experimentStore.deleteExperiment(props.experiment?.id)
  );
  router.push({ name: "project", params: { id: projectStore.project.id } });
};

const handleCloseExperiment = async () => {
  await loadingHandler.handleLoadingDuring(
    experimentStore.closeExperiments([props.experiment?.id]).then(() => {
      emits("updated");
    })
  );
};

const handleOpenExperiment = async () => {
  await loadingHandler.handleLoadingDuring(
    experimentStore.openExperiments([props.experiment?.id]).then(() => {
      emits("updated");
    })
  );
};

const onAddTag = async (newTag) => {
  await loadingHandler.handleLoadingDuring(
    experimentStore.handleAddTag(props.experiment.id, newTag).then(() => {
      emits("updated");
    })
  );
};

const onRemoveTag = async (tag) => {
  await loadingHandler.handleLoadingDuring(
    experimentStore.handleDeleteTag(props.experiment.id, tag).then(() => {
      emits("updated");
    })
  );
};

const onAddProperty = async (newProperty) => {
  await loadingHandler.handleLoadingDuring(
    experimentStore
      .handleAddProperty(props.experiment.id, newProperty)
      .then(() => {
        emits("updated");
      })
  );
};

const onRemoveProperty = async (property) => {
  await loadingHandler.handleLoadingDuring(
    experimentStore
      .handleDeleteProperty(props.experiment.id, property)
      .then(() => {
        emits("updated");
      })
  );
};
</script>