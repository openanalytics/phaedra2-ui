<template>
  <q-form class="full-width" @submit="onSubmit" @reset="onReset">
    <div>
      <q-input
        label="Name"
        v-model="newProject.name"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Project name is required',
        ]"
        dense
      />
    </div>
    <div>
      <q-input label="Description" v-model="newProject.description" dense />
    </div>
    <div class="q-pt-md">
      <q-select
        label="Admin Team"
        v-model="newProject.adminTeam"
        :options="teamNames"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'An admin team must be selected',
        ]"
        dense
      />
    </div>
    <div class="row justify-end q-pt-md">
      <router-link :to="{ name: 'browseProjects' }" class="nav-link">
        <q-btn label="Cancel" type="reset" color="primary" flat />
      </router-link>
      <q-btn label="Create" type="submit" color="primary" class="q-ml-sm" />
    </div>
  </q-form>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "@/stores/project";
import { useUserInfoStore } from "@/stores/userinfo";
import { useLoadingHandler } from "@/composable/loadingHandler";

const userInfo = computed(() => userInfoStore.userInfo);
const teamNames = computed(() => userInfo.value.teams);

const projectStore = useProjectStore();
const userInfoStore = useUserInfoStore();
const router = useRouter();

const newProject = ref({
  name: null,
  description: null,
});

const loadingHandler = useLoadingHandler();
const onSubmit = async () => {
  await loadingHandler.handleLoadingDuring(
    projectStore.createNewProject(newProject.value).then(() => {
      router.push({ path: "/project/" + projectStore.project.id });
    })
  );
};

const onReset = () => {
  newProject.value.name = null;
  newProject.value.description = null;
};
</script>
