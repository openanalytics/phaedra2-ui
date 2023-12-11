<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="templateStore.template">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Templates'" icon="list" :to="'/templates'"/>
    <q-breadcrumbs-el :label="templateStore.template.name" icon="border_outer"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm" v-if="!editdialog">
      <oa-section v-if="!templateStore.template" title="Loading template..." icon="border_outer"/>
      <oa-section v-else :title="templateStore.template.name" icon="border_outer" :collapsible="true">
        <div class="row q-pa-md">
          <div class="col-3">
            <q-field label="ID" stack-label borderless dense>
              <template v-slot:control>
                {{ templateStore.template.id }}
              </template>
            </q-field>
            <q-field label="Dimensions" stack-label borderless dense>
              <template v-slot:control>
                {{ templateStore.template.rows }} x {{ templateStore.template.columns }} ({{ templateStore.template.rows * templateStore.template.columns }} wells)
              </template>
            </q-field>
            <q-field label="Description" stack-label borderless dense>
              <template v-slot:control>
                <EditableField :object="templateStore.template" fieldName="description" @valueChanged="onDescriptionChanged"/>
              </template>
            </q-field>
            <q-field label="Tags" stack-label borderless dense>
              <template v-slot:control>
                <TagList :tags="templateStore.template.tags" @addTag="onAddTag" @removeTag="onRemoveTag"/>
              </template>
            </q-field>
          </div>

          <div class="col-3">
            <q-field label="Created On" stack-label dense borderless>
              <template v-slot:control>
                {{ FormatUtils.formatDate(templateStore.template.createdOn) }}
              </template>
            </q-field>
            <q-field label="Created By" stack-label dense borderless>
              <template v-slot:control>
                <UserChip :id="templateStore.template.createdBy"/>
              </template>
            </q-field>
            <q-field label="Updated On" stack-label dense borderless>
              <template v-slot:control>
                {{ FormatUtils.formatDate(templateStore.template.updatedOn) }}
              </template>
            </q-field>
            <q-field label="Updated By" stack-label dense borderless>
              <template v-slot:control>
                <UserChip :id="templateStore.template.updatedBy"/>
              </template>
            </q-field>
          </div>

          <div class="col-4">
            <PropertyTable :properties="templateStore.template.properties" @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
          </div>

          <div class="col-2">
            <div class="row justify-end action-button">
              <q-btn size="sm" icon="save" class="oa-action-button" label="Save"
                     @click="savePlateTemplate"/>
            </div>
            <div class="row justify-end action-button">
              <q-btn size="sm" icon="edit" class="oa-action-button" label="Rename" @click="showRenameDialog = true"/>
            </div>
            <div class="row justify-end action-button">
              <q-btn size="sm" icon="delete" class="oa-action-button" label="Delete"
                     @click="openDeleteDialog"/>
            </div>
          </div>
        </div>
      </oa-section>
    </div>

    <edit-plate-template v-model:show="editdialog"></edit-plate-template>

    <div class="q-pa-sm" v-if="templateStore.template">
      <q-tabs inline-label dense no-caps align="left" class="oa-section-title" v-model="activeTab">
        <q-tab name="overview" icon="view_module" label="Overview"/>
        <q-tab name="well-type" icon="text_snippet" label="Well Type"/>
        <q-tab name="substance" icon="view_module" label="Substance"/>
        <q-tab name="concentration" icon="view_module" label="Concentration"/>
      </q-tabs>

      <div class="oa-section-body">
        <q-tab-panels v-model="activeTab" animated style="width: 100%">
          <q-tab-panel name="overview" icon="view_module" label="Overview">
            <PlateTemplateLayout :plate="templateStore.template" :tab="activeTab"/>
          </q-tab-panel>
          <q-tab-panel name="well-type" icon="view_module" label="Well Type">
            <PlateTemplateLayout :plate="templateStore.template" :tab="activeTab"/>
          </q-tab-panel>
          <q-tab-panel name="substance" icon="view_module" label="Substance">
            <PlateTemplateLayout :plate="templateStore.template" :tab="activeTab"/>
          </q-tab-panel>
          <q-tab-panel name="concentration" icon="view_module" label="Concentration">
            <PlateTemplateLayout :plate="templateStore.template" :tab="activeTab"/>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <rename-dialog v-model:show="showRenameDialog" objectClass="plate_template" fieldName="name" :object="templateStore.template" @valueChanged="onNameChanged"/>
    <delete-dialog v-if="templateStore.template" ref="deleteDialog" v-model:id="templateStore.template.id"
                   v-model:name="templateStore.template.name" v-model:show="showDeleteDialog" :objectClass="'template'"
                   @onDeleted="onDeleted"/>
  </q-page>
</template>

<script setup>
import {ref} from "vue"
import {useTemplateStore} from "@/stores/template";
import {useRoute, useRouter} from "vue-router";

import FormatUtils from "@/lib/FormatUtils.js";

import TagList from "@/components/tag/TagList";
import PropertyTable from "@/components/property/PropertyTable";
import PlateTemplateLayout from "./PlateTemplateLayout";
import EditPlateTemplate from "./EditPlateTemplate";
import OaSection from "@/components/widgets/OaSection";
import DeleteDialog from "@/components/widgets/DeleteDialog";
import UserChip from "@/components/widgets/UserChip";
import EditableField from "@/components/widgets/EditableField.vue";
import RenameDialog from "@/components/widgets/RenameDialog.vue";

const route = useRoute()
const router = useRouter()
const templateStore = useTemplateStore()

const activeTab = ref('overview')
const editdialog = ref(false)
const showDeleteDialog = ref(false)

const templateId = parseInt(route.params.id);
templateStore.loadTemplate(templateId)

const savePlateTemplate = () => {
  templateStore.saveTemplate()
}
const showRenameDialog = ref(false)
const onNameChanged = async (newTemplateName) => {
  await templateStore.renameTemplate(newTemplateName)
};

const onDescriptionChanged = async (newDescription) => {
  await templateStore.editTemplateDescription(newDescription)
};

const onDeleted = () => {
  router.push({name: 'dashboard'})
}

const openDeleteDialog = () => {
  showDeleteDialog.value = true
}

const onAddTag = async (newTag) => {
  await templateStore.addTag(newTag)
}

const onRemoveTag = async (tag) => {
  await templateStore.deleteTag(tag)
}

const onAddProperty = async (newProperty) => {
  await templateStore.addPropertty(newProperty)
}

const onRemoveProperty = async (property) => {
  await templateStore.deleteProperty(property)
}
</script>
