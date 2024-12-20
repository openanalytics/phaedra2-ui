<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench' }" />
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
import { ref } from "vue";
import projectsGraphQlAPI from "@/api/graphql/projects";
import { useLoadingHandler } from "../../composable/loadingHandler";

const projects = ref([]);
const fetchAllProjects = async () => {
  const data = await projectsGraphQlAPI.projects()
  projects.value = data.projects;
};

const loadingHandler = useLoadingHandler();
loadingHandler.handleLoadingDuring(fetchAllProjects());
</script>
