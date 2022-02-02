<template >
  <q-breadcrumbs class="breadcrumb" v-if="project">
      <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
      <q-breadcrumbs-el :label="project.name" icon="folder" />
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md">

      <div class="text-h6 q-px-sm oa-section-title" v-if="!project">
          Loading project...
      </div>

      <div v-else>
        <div class="row text-h6 items-center q-px-md oa-section-title">
          <q-icon name="folder" class="q-pr-sm"/>{{ project.name }}
        </div>

        <div class="row q-pa-md oa-section-body">
            <div class="col-4 q-gutter-xs">
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
                <div class="col">{{ project.createdBy }}</div>
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

            <div class="col-4">
              <PropertyTable :objectInfo="project" :objectClass="'PROJECT'"/>
            </div>

            <div class="col-4">
              <div class="row justify-end action-button">
                <q-btn size="sm" icon="edit" label="Rename" class="oa-button" @click="newProjectName = project.name; showRenameDialog = true"/>
              </div>
              <div class="row justify-end action-button">
                <q-btn size="sm" icon="delete" label="Delete" class="oa-button" @click="showDeleteDialog = true"/>
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

    <q-dialog v-model="showDeleteDialog">
      <q-card style="min-width: 30vw">
        <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
          <q-avatar icon="delete" color="primary" text-color="white"/> Delete Project
        </q-card-section>
        <q-card-section>
          <div class="row">
              <div class="col-10">
                <span>Are you sure you want to delete the project <b>{{project.name}}</b>?</span><br/>
                <span>Type <b>{{project.name}}</b> and press the button to confirm.</span>
                <q-input dense v-model="projectName" autofocus/><br>
                <span class="text-weight-bold text-negative">WARNING: All experiments, plates and associated data will be deleted!</span>
              </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn label="Delete project" color="negative" v-if="project.name == projectName" v-close-popup @click="doDeleteProject"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
  import {computed, ref} from 'vue'
  import {useStore} from 'vuex'
  import {useRoute, useRouter} from 'vue-router'

  import ExperimentList from "@/pages/project/ExperimentList.vue"
  import TagList from "@/components/tag/TagList"
  import PropertyTable from "@/components/property/PropertyTable";
  import EditableField from "@/components/widgets/EditableField";
  import AccessControlList from "@/components/widgets/AccessControlList";

  import FormatUtils from "@/lib/FormatUtils.js"

  export default {
    components: {
      ExperimentList,
      TagList,
      PropertyTable,
      EditableField,
      AccessControlList
    },

    setup() {
      const store = useStore();
      const route = useRoute();
      const router = useRouter();

      const projectId = parseInt(route.params.id);
      const project = computed(() => store.getters['projects/getCurrentProject']());
      store.dispatch('projects/loadById', projectId);

      const showRenameDialog = ref(false)
      const newProjectName = ref(project.value ? project.value.name : '')
      const doRenameProject = function() {
        store.dispatch('projects/renameProject', {
          id: projectId,
          name: newProjectName.value
        })
      }

      const showDeleteDialog = ref(false)
      const doDeleteProject = function() {
        store.dispatch('projects/deleteProject', projectId).then(() => {
            router.push({ name: 'dashboard' })
          })
      }

      const onDescriptionChanged = (newDescription) => {
        store.dispatch('projects/editProjectDescription', { id: projectId, description: newDescription });
      };

      return {
        projectId,
        project,

        showRenameDialog,
        newProjectName,
        doRenameProject,

        showDeleteDialog,
        doDeleteProject,

        onDescriptionChanged,
        FormatUtils
      }
    },
    data(){
      return {
        projectName: ref(""),
      }
    }
  }
</script>
