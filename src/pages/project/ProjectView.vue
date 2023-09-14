<template >
    <q-breadcrumbs class="oa-breadcrumb" v-if="projectStore.project">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
        <q-breadcrumbs-el :label="'Projects'" icon="list" :to="'/projects'"/>
        <q-breadcrumbs-el :label="projectStore.project.name" icon="folder" />
    </q-breadcrumbs>

    <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
        <div class="q-pa-md">
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
                              <TagList :tags="projectStore.project.tags" :objectId="projectStore.project.id" :objectClass="'PROJECT'"/>
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
                                <AccessControlList :projectAccess="projectStore.projectAccess"
                                                   @addAccess="onAddAccess"
                                                   @removeAccess="onRemoveAccess" class="q-mt-xs"/>
                            </template>
                        </q-field>
                    </div>

                    <div class="col-4">
                        <PropertyTable :objectInfo="projectStore.project" objectClass="'PROJECT'"/>
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

        <div class="q-pl-md q-pr-md">
            <ExperimentList :experiments="projectStore.experiments" :project="projectStore.project" @createNewExperiment="onCreateNewExperiment"/>
        </div>

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
import {ref} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'

import ExperimentList from "@/pages/project/ExperimentList.vue"
import TagList from "@/components/tag/TagList"
import PropertyTable from "@/components/property/PropertyTable";
import EditableField from "@/components/widgets/EditableField";
import UserChip from "@/components/widgets/UserChip";
import AccessControlList from "@/components/widgets/AccessControlList";
import OaSection from "@/components/widgets/OaSection";
import DeleteDialog from "@/components/widgets/DeleteDialog";
import RenameDialog from "@/components/widgets/RenameDialog";

import FormatUtils from "@/lib/FormatUtils.js"
import {useProjectStore} from "@/stores/project";

const store = useStore()
const projectStore = useProjectStore()
const route = useRoute()
const router = useRouter()

const projectId = parseInt(route.params.id);
projectStore.loadProject(projectId)

const showDeleteDialog = ref (false);
const showRenameDialog = ref(false);
const onNameChanged = function(newName) {
  projectStore.renameProject(newName)
};

const onDescriptionChanged = (newDescription) => {
  projectStore.editProjectDescription(newDescription)
};

const openDeleteDialog = () => {
    showDeleteDialog.value = true
}

const onCreateNewExperiment = (newExperiment) => {
  projectStore.addExperiment(newExperiment)
}

const onDeleted = () => {
  projectStore.deleteProject();
  router.push({name: 'browseProjects'})
}

const onAddAccess = (newAccess) => {
  projectStore.createProjectAccess(newAccess)
}

const onRemoveAccess = (accessId) => {
  projectStore.deleteProjectAccess(accessId)
}
</script>
