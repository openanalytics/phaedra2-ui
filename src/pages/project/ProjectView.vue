<template >
    <q-breadcrumbs class="oa-breadcrumb" v-if="projectStore.project">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
        <q-breadcrumbs-el :label="'Projects'" icon="list" :to="'/projects'"/>
        <q-breadcrumbs-el :label="projectStore.project.name" icon="folder" />
    </q-breadcrumbs>

    <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
        <div class="q-pa-sm">
            <oa-section v-if="!projectStore.project" title="Loading project..." icon="folder" />
            <oa-section v-else :title="projectStore.project.name" icon="folder" :collapsible="true">
                <div class="row q-pa-md">
                    <div class="col-3">
                        <q-field label="ID" stack-label dense borderless>
                            <template v-slot:control>
                                {{ projectStore.project.id }}
                            </template>
                        </q-field>
                        <q-field label="Description" stack-label dense borderless>
                            <template v-slot:control>
                                <EditableField :object="projectStore.project" fieldName="description" @valueChanged="onDescriptionChanged" />
                            </template>
                        </q-field>
                        <q-field label="Tags" stack-label dense borderless>
                            <template v-slot:control>
                              <tag-list :tags="projectStore.project.tags" @addTag="onAddTag" @removeTag="onRemoveTag" class="q-pt-xs"/>
                            </template>
                        </q-field>
                    </div>

                    <div class="col-3 q-pl-md">
                        <q-field label="Created On" stack-label dense borderless>
                            <template v-slot:control>
                                {{ FormatUtils.formatDate(projectStore.project.createdOn) }}
                            </template>
                        </q-field>
                        <q-field label="Created By" stack-label dense borderless>
                            <template v-slot:control>
                                <UserChip :id="projectStore.project.createdBy" />
                            </template>
                        </q-field>
                        <q-field label="Access" stack-label dense borderless>
                            <template v-slot:control>
                                <AccessControlList :projectAccess="projectStore.project.access"
                                                   @addAccess="onAddAccess"
                                                   @removeAccess="onRemoveAccess" class="q-mt-xs"/>
                            </template>
                        </q-field>
                    </div>

                    <div class="col-4">
                        <PropertyTable :properties="projectStore.project.properties" @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
                    </div>

                    <div class="col-2">
                        <div class="row justify-end">
                            <q-btn size="sm" icon="edit" label="Rename" class="oa-action-button" @click="showRenameDialog = true"/>
                        </div>
                        <div class="row justify-end">
                            <q-btn size="sm" icon="delete" label="Delete" class="oa-action-button" @click="openDeleteDialog"/>
                        </div>
                    </div>
                </div>
            </oa-section>
        </div>

        <splitpanes class="default-theme" :horizontal="horizontal" >
          <pane class="q-pa-sm" v-if="projectStore.project" style="background-color: #E6E6E6">
            <div class="row oa-section-body">
              <ExperimentList :experiments="projectStore.experiments"
                              :project="projectStore.project"
                              @createNewExperiment="onCreateNewExperiment"
              @selection="handleSelection"/>
            </div>
          </pane>
          <pane class="q-pa-sm" v-if="uiStore.showChartViewer" style="background-color: #E6E6E6" ref="chartViewerPane">
            <ChartViewer :update="Date.now()" @changeOrientation="horizontal = !horizontal"/>
          </pane>
        </splitpanes>
        <rename-dialog v-model:show="showRenameDialog" objectClass="project" :object="projectStore.project" @valueChanged="onNameChanged" />
        <delete-dialog v-model:show="showDeleteDialog" :id="projectStore.project?.id" :name="projectStore.project?.name" :objectClass="'project'" @onDeleted="onDeleted" />
    </q-page>
</template>

<style scoped lang="scss">
.action-button {
    margin: 3px;
}
</style>

<script setup>
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'

import ExperimentList from "@/pages/project/ExperimentList.vue"
import TagList from "@/components/tag/TagList"
import PropertyTable from "@/components/property/PropertyTable"
import EditableField from "@/components/widgets/EditableField"
import UserChip from "@/components/widgets/UserChip"
import AccessControlList from "@/components/widgets/AccessControlList"
import OaSection from "@/components/widgets/OaSection"
import DeleteDialog from "@/components/widgets/DeleteDialog"
import RenameDialog from "@/components/widgets/RenameDialog"

import FormatUtils from "@/lib/FormatUtils.js"
import {useProjectStore} from "@/stores/project";
import {Pane, Splitpanes} from "splitpanes";
import ChartViewer from "@/components/chart/ChartViewer.vue";
import {useUIStore} from "@/stores/ui";

const route = useRoute()
const router = useRouter()
const uiStore = useUIStore()
const projectStore = useProjectStore()

const horizontal = ref(false)

const projectId = parseInt(route.params.id);

onMounted(() => {
  projectStore.loadProject(projectId)
})

const showDeleteDialog = ref (false);
const showRenameDialog = ref(false);

const onNameChanged = async (newName) => {
  await projectStore.renameProject(newName)
}

const onDescriptionChanged = async (newDescription) => {
  await projectStore.editProjectDescription(newDescription)
}

const onCreateNewExperiment = async (newExperiment) => {
  await projectStore.addExperiment(newExperiment)
}

const onDeleted = async () => {
  await projectStore.deleteProject()
  await router.push({name: 'browseProjects'})
}

const onAddAccess = async (newAccess) => {
  await projectStore.createProjectAccess(newAccess)
}

const onRemoveAccess = async (access) => {
  await projectStore.deleteProjectAccess(access)
}

const onAddTag = async (newTag) => {
  await projectStore.handleAddTag(newTag)
}

const onRemoveTag = async (tag) => {
  await projectStore.handleDeleteTag(tag)
}

const onAddProperty = async (newProperty) => {
  await projectStore.handleAddProperty(newProperty)
}

const onRemoveProperty = async (property) => {
  await projectStore.handleDeleteProperty(property)
}

const openDeleteDialog = () => {
    showDeleteDialog.value = true
}

const handleSelection = (experiments) => {
  uiStore.selectedExperiments = experiments
}
</script>
