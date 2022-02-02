<template>
  <q-breadcrumbs class="breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el label="New Project" icon="folder" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-md">
      <div class="row text-h6 items-center q-px-md oa-section-title">
        <q-icon name="folder" class="q-pr-sm"/>New Project
      </div>

      <div class="row q-pa-md oa-section-body">
        <q-form class="full-width" @submit="onSubmit" @reset="onReset">

          <q-input label="Name" v-model="newProject.name" lazy-rules :rules="[ val => val && val.length > 0 || 'Project name is required']" />
          
          <q-input label="Description" v-model="newProject.description" class="q-mb-md" />

          <q-select label="Admin Team" v-model="newProject.adminTeam" :options="teamNames" lazy-rules :rules="[ val => val && val.length > 0 || 'An admin team must be selected']" />

          <div class="row justify-end q-pt-md">
            <q-btn label="Create" type="submit" color="primary"/>
            <q-btn label="Cancel" type="reset" color="primary" flat class="on-right"/>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
  import {ref, computed} from "vue";
  import {useStore} from 'vuex';
  import {useRouter} from 'vue-router';

  export default {
    setup() {
      const exported = {};
      const store = useStore();
      const router = useRouter();

      exported.newProject = ref({
        name: null,
        description: null
      });

      exported.onSubmit = () => {
        store.dispatch('projects/createNewProject', exported.newProject.value).then(createdProject => {
          router.push({ path: '/project/' + createdProject.id })
        })
      };
      exported.onReset = () => {
        exported.newProject.value.name = null;
        exported.newProject.value.description = null;
      };

      const userInfo = computed(() => store.getters['userinfo/getUserInfo']());
      exported.teamNames = computed(() => userInfo.value.teams);

      return exported;
    }
  }
</script>