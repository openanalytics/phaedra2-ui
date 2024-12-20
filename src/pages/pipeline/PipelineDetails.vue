<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="pipelineStore.pipeline">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench' }" />
    <q-breadcrumbs-el label="Pipelines" icon="list" :to="'/pipelines'" />
    <q-breadcrumbs-el :label="pipelineStore.pipeline.name" icon="route" />
  </q-breadcrumbs>

  <q-page class="oa-root-div" v-if="pipelineStore.pipeline">
    <div class="q-pa-sm">
      <phaedra-details-section :object-title="pipelineStore.pipeline.name" :object-id="pipelineStore.pipeline.id" title-icon="route">
        <template v-slot:actions>
          <span v-show="!editMode">
            <q-btn size="xs" color="positive" icon="edit"
                   @click="editMode = true" round dense/>
          </span>
          <span v-show="!editMode" class="q-ml-xs">
            <q-btn size="xs" icon="delete" color="negative"
                   @click="showDeleteDialog = true" round dense/>
          </span>
          <span v-show="editMode">
            <q-btn size="xs" color="positive" icon="save"
                   @click="saveChanges" round dense/>
          </span>
          <span v-show="editMode" class="q-ml-xs">
            <q-btn size="xs" color="negative" icon="cancel"
                   @click="exitEditMode" round dense/>
          </span>
        </template>
        <template v-slot:readonly>
          <div class="col">
            <div>
              <user-chip :id="pipelineStore.pipeline.createdBy" label="Created By"
                         on-hover-message="Created By"/>
            </div>
            <div>
              <date-chip :date-time="pipelineStore.pipeline.createdOn" label="Created On"
                         on-hover-message="Created On"/>
            </div>
          </div>
          <div class="col">
            <div>
              <user-chip :id="pipelineStore.pipeline.updatedBy" label="Updated By"
                         on-hover-message="Updated By"/>
            </div>
            <div>
              <date-chip :date-time="pipelineStore.pipeline.updatedOn" label="Updated On"
                         on-hover-message="Updated On"/>
            </div>
          </div>
        </template>
        <template v-slot:editable>
          <div class="row">
            <div class="col">
              <editable-field :object="pipelineStore.pipeline" fieldName="name"
                              :read-only="!editMode" label="Name"
                              @valueChanged="(val) => onPipelineEdited('name', val)"/>
              <editable-field :object="pipelineStore.pipeline" fieldName="description"
                              :read-only="!editMode" label="Description"
                              @valueChanged="(val) => onPipelineEdited('description', val)"/>
            </div>
            <div class="col">
              <q-field label="Version" stack-label dense borderless>
                <template v-slot:control>
                  {{ pipelineStore.pipeline.versionNumber }}
                </template>
              </q-field>
              <q-field label="Status" stack-label dense borderless>
                <template v-slot:control>
                  <StatusLabel :status="pipelineStore.pipeline.status" />
                  <q-toggle class="on-right" v-model="pipelineStatusToggle" :disable="!editMode"
                            @update:model-value="onStatusToggle" dense/>
                </template>
              </q-field>
            </div>
          </div>
          <tag-list-editable :tags="pipelineStore.pipeline.tags"
                             @addTag="onAddTag" @removeTag="onRemoveTag"/>
        </template>
        <template v-slot:properties>
          <property-table :properties="pipelineStore.pipeline.properties"
                          @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
        </template>
      </phaedra-details-section>
      <oa-section title="Configuration" icon="settings" class="q-pt-sm" >
        <codemirror
            :disabled="!editMode"
            :extensions="editorConfig.extensions"
            v-model="configWorkingCopy"
        />
      </oa-section>
    </div>
  </q-page>

  <delete-dialog
    :id="pipelineStore.pipeline?.id"
    :name="pipelineStore.pipeline?.name"
    v-model:show="showDeleteDialog"
    objectClass="pipeline"
    @onDeleted="confirmDelete"
  />
  <confirm-dialog
    title="Change pipeline status"
    message="Are you sure you want to change the status of this pipeline?"
    v-model:show="showStatusDialog"
    @onConfirm="confirmStatusChange"
    @onCancel="cancelStatusChange"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Codemirror } from "vue-codemirror";
import { json } from "@codemirror/lang-json";
import FormatUtils from "@/lib/FormatUtils.js";
import UserChip from "@/components/widgets/UserChip";
import StatusLabel from "@/components/widgets/StatusLabel";
import OaSection from "@/components/widgets/OaSection";
import DeleteDialog from "@/components/widgets/DeleteDialog";
import ConfirmDialog from "@/components/widgets/ConfirmDialog";
import EditableField from "@/components/widgets/EditableField";
import { usePipelineStore } from "@/stores/pipeline";
import { useLoadingHandler } from "../../composable/loadingHandler";
import PhaedraDetailsSection from "@/components/widgets/PhaedraDetailsSection.vue";
import DateChip from "@/components/widgets/DateChip.vue";
import PropertyTable from "@/components/property/PropertyTable.vue";
import TagListEditable from "@/components/tag/TagListEditable.vue";

const pipelineStatusToggle = ref(false);
const pipelineStore = usePipelineStore();
const router = useRouter();
const route = useRoute();
const pipelineId = parseInt(route.params.id);

onMounted(() => {
  init(pipelineId);
});

const loadingHandler = useLoadingHandler();

const init = async (pipelineId) => {
  await loadingHandler.handleLoadingDuring(
    pipelineStore.loadPipeline(pipelineId).then(() => {
      pipelineStatusToggle.value =
        pipelineStore.pipeline?.status === "ENABLED" ?? false;
      configWorkingCopy.value = FormatUtils.formatJSON(
        pipelineStore.pipeline?.config ?? {}
      );
    })
  );
};

const showStatusDialog = ref(false);
const onStatusToggle = (v) => {
  showStatusDialog.value = true;
};
const confirmStatusChange = async () => {
  await loadingHandler.handleLoadingDuring(
    pipelineStatusToggle.value
      ? pipelineStore.enablePipeline()
      : pipelineStore.disablePipeline()
  );
};
const cancelStatusChange = () => {
  init(pipelineId);
};

const editMode = ref(false);
const configWorkingCopy = ref("");
const exitEditMode = () => {
  editMode.value = false;
  pipelineStore.loadPipeline(pipelineId);
};

const onPipelineEdited = async (fieldName, newValue) => {
  await loadingHandler.handleLoadingDuring(
    pipelineStore.updatePipelineProperty(fieldName, newValue)
  );
};

const saveChanges = () => {
  editMode.value = false;
  pipelineStore.pipeline.config = JSON.parse(configWorkingCopy.value);
  pipelineStore.updatePipeline()
}

const editorConfig = {
  extensions: [json()],
};

const showDeleteDialog = ref(false);
const confirmDelete = async () => {
  await loadingHandler.handleLoadingDuring(
    pipelineStore
      .deletePipeline(pipelineId)
      .then(() => router.push({ name: "browsePipelines" }))
  );
};

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
