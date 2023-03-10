<template >
    <q-breadcrumbs class="oa-breadcrumb" v-if="project">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
        <q-breadcrumbs-el :label="'Projects'" icon="list" :to="'/projects'"/>
        <q-breadcrumbs-el :label="project.name" icon="folder" />
    </q-breadcrumbs>
    
    <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
        <div class="q-pa-md">
            <oa-section v-if="!project" title="Loading project..." icon="folder" />
            <oa-section v-else :title="project.name" icon="folder" :collapsible="true">
                <div class="row q-pa-md">
                    <div class="col-3">
                        <q-field label="ID" stack-label dense borderless>
                            <template v-slot:control>
                                {{ project.id }}
                            </template>
                        </q-field>
                        <q-field label="Description" stack-label dense borderless>
                            <template v-slot:control>
                                <EditableField :object="project" :fieldName="'description'" @valueChanged="onDescriptionChanged" />
                            </template>
                        </q-field>
                        <q-field label="Tags" stack-label dense borderless>
                            <template v-slot:control>
                                <TagList :objectInfo="project" :objectClass="'PROJECT'" />
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
                                <AccessControlList :projectId="project.id" class="q-mt-xs" />
                            </template>
                        </q-field>
                    </div>
                    
                    <div class="col-4">
                        <PropertyTable :objectInfo="project" objectClass="'PROJECT'"/>
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
            <ExperimentList :projectId="projectId"></ExperimentList>
        </div>
        
        <rename-dialog v-model:show="showRenameDialog" objectClass="project" :object="project" @valueChanged="onNameChanged" />
        <delete-dialog v-model:show="showDeleteDialog" :id="project.id" :name="project.name" :objectClass="'project'" @onDeleted="onDeleted" />
    </q-page>
</template>

<style scoped lang="scss">
.action-button {
    margin: 3px;
}
</style>

<script setup>
import {computed, ref} from 'vue'
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

const store = useStore();
const route = useRoute();
const router = useRouter();

const projectId = parseInt(route.params.id);
const project = computed(() => store.getters['projects/getCurrentProject']());
store.dispatch('projects/loadById', projectId);

const showDeleteDialog = ref (false);
const showRenameDialog = ref(false);
const onNameChanged = function(newName) {
    store.dispatch('projects/renameProject', { id: projectId, name: newName });
};

const onDescriptionChanged = (newDescription) => {
    store.dispatch('projects/editProjectDescription', {id: projectId, description: newDescription});
};

const openDeleteDialog = () => {
    showDeleteDialog.value = true
}

const onDeleted = () => {
    router.push({name: 'browseProjects'})
}
const projectName = ref("")
</script>
