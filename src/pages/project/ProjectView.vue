<template >
  <q-breadcrumbs class="oa-breadcrumb" v-if="project">
      <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
      <q-breadcrumbs-el :label="'Projects'" icon="list" :to="'/projects'"/>
      <q-breadcrumbs-el :label="project.name" icon="folder" />
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md">

      <oa-section-header v-if="!project" :title="'Loading project...'" :icon="'folder'"/>
      <div v-else>
        <oa-section-header :title="project.name" :icon="'folder'"/>
        <div class="row q-pa-md oa-section-body">
            <div class="col-5 q-gutter-xs">
              <div class="row">
                <div class="col-3 text-weight-bold">ID:</div>
                <div class="col">{{ project.id }}</div>
              </div>
              <div class="row">
                <div class="col-3 text-weight-bold">Created On:</div>
                <div class="col">{{ FormatUtils.formatDate(project.createdOn) }}</div>
              </div>
              <div class="row">
                <div class="col-3 text-weight-bold">Created By:</div>
                <div class="col"><UserChip :id="project.createdBy" /></div>
              </div>
              <div class="row">
                <div class="col-3 text-weight-bold">Description:</div>
                <div class="col"><EditableField :object="project" :fieldName="'description'" @valueChanged="onDescriptionChanged" /></div>
              </div>
              <div class="row">
                <div class="col-3 text-weight-bold">Access:</div>
                <div class="col">
                  <AccessControlList :projectId="project.id" />
                </div>
              </div>
              <div class="row">
                <div class="col-3 text-weight-bold">Tags:</div>
                <div class="col">
                  <TagList :objectInfo="project" :objectClass="'PROJECT'" />
                </div>
              </div>
            </div>

            <div class="col-6">
              <PropertyTable :objectInfo="project" :objectClass="'PROJECT'"/>
            </div>

            <div class="col-1">
              <div class="row justify-end action-button">
                <q-btn size="sm" icon="edit" label="Rename" class="oa-button" @click="newProjectName = project.name; showRenameDialog = true"/>
              </div>
              <div class="row justify-end action-button">
                <q-btn size="sm" icon="delete" label="Delete" class="oa-button" @click="openDeleteDialog"/>
              </div>
            </div>
          </div>
        </div>
      </div>

    <div class="q-pa-md">
      <ExperimentList :projectId="projectId"></ExperimentList>
    </div>

    <q-dialog v-model="showRenameDialog">
      <q-card style="min-width: 30vw">
        <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
          Rename Project
        </q-card-section>
        <q-card-section>
          <div class="row">
              <div class="col-2 row items-center">
                <q-avatar icon="edit" color="primary" text-color="white" />
              </div>
              <div class="col-10">
                <span>New Project Name:</span><br/>
                <q-input dense v-model="newProjectName" autofocus />
              </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn label="Rename" color="primary" v-close-popup @click="doRenameProject"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

<!--    <delete-dialog v-model:show="showDialog" :id="experiment.id" :name="experiment.name" :objectClass="'experiment'" @onDeleted="onDeleted" />-->
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
import OaSectionHeader from "../../components/widgets/OaSectionHeader";
import DeleteDialog from "../../components/widgets/DeleteDialog";

import FormatUtils from "@/lib/FormatUtils.js"

const store = useStore();
const route = useRoute();
const router = useRouter();

const projectId = parseInt(route.params.id);
const project = computed(() => store.getters['projects/getCurrentProject']());
store.dispatch('projects/loadById', projectId);

const showDeleteDialog = ref (false)
const showRenameDialog = ref(false)
const newProjectName = ref(project.value ? project.value.name : '')
const doRenameProject = function () {
  store.dispatch('projects/renameProject', {
    id: projectId,
    name: newProjectName.value
  })
}

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
