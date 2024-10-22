<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard' }" />
    <q-breadcrumbs-el label="Projects" icon="list" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <oa-section title="Projects" icon="folder" class="q-pa-sm">
      <ProjectsList :projects="projects" @updated="fetchAllProjects" />
    </oa-section>
  </q-page>
</template>

<script setup>
import OaSection from "@/components/widgets/OaSection";
import ProjectsList from "@/components/project/ProjectsList.vue";
import { onMounted, ref } from "vue";
import projectsGraphQlAPI from "@/api/graphql/projects";

const projects = ref([]);

const fetchAllProjects = () => {
  const { onResult, onError } = projectsGraphQlAPI.projects();
  onResult(({ data }) => {
    projects.value = data.projects;
  });
  //TODO: implement onError event!
};

onMounted(() => {
  fetchAllProjects();
});
</script>
