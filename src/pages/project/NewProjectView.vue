<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el label="New Project" icon="folder"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-md">
      <oa-section-header  :title="'New Project'" :icon="'folder'"/>
      <div class="row q-pa-md oa-section-body">
        <q-form class="row full-width" @submit="onSubmit" @reset="onReset">
          <div class="col-5">
            <q-input label="Name" v-model="newProject.name" lazy-rules
                     :rules="[ val => val && val.length > 0 || 'Project name is required']" dense/>
            <q-input label="Description" v-model="newProject.description" dense/>
            <q-select label="Admin Team" v-model="newProject.adminTeam" :options="teamNames" lazy-rules
                      :rules="[ val => val && val.length > 0 || 'An admin team must be selected']" dense/>
          </div>

          <div class="col-2"/>

          <div class="col-5">
            <div class="row justify-end">
              <q-btn size="sm" label="Create" type="submit" class="oa-action-button"/>
            </div>
            <div class="row justify-end">
              <router-link :to="{ name: 'browseProjects'}" class="nav-link">
                <q-btn size="sm" label="Cancel" type="reset" class="oa-action-button"/>
              </router-link>
            </div>
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
import OaSectionHeader from "../../components/widgets/OaSectionHeader";

export default {
  components: {OaSectionHeader},
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
        router.push({path: '/project/' + createdProject.id})
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
