<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el :label="'Projects'" icon="list" :to="'/projects'"/>
    <q-breadcrumbs-el label="New Project" icon="folder"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-md">
      <oa-section  title="New Project" icon="folder">
        <div class="q-pa-md">
          <q-form class="full-width" @submit="onSubmit" @reset="onReset">
            <div>
              <q-input label="Name" v-model="newProject.name" lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Project name is required']" dense/>
            </div>
            <div>
              <q-input label="Description" v-model="newProject.description" dense/>
            </div>
            <div class="q-pt-md">
              <q-select label="Admin Team" v-model="newProject.adminTeam" :options="teamNames" lazy-rules
                        :rules="[ val => val && val.length > 0 || 'An admin team must be selected']" dense/>
            </div>
            <div class="row justify-end q-pt-md">
                <router-link :to="{ name: 'browseProjects'}" class="nav-link">
                    <q-btn label="Cancel" type="reset" color="primary" flat />
                </router-link>
                <q-btn label="Create" type="submit" color="primary" class="q-ml-sm" />
            </div>
          </q-form>
        </div>
      </oa-section>
    </div>
  </q-page>
</template>

<script>
import {ref, computed} from "vue";
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import OaSection from "@/components/widgets/OaSection";

export default {
  components: {OaSection},
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
