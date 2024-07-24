<template>
  <!-- <div class="q-pa-sm"> -->
  <!-- <oa-section title="Recent Projects" icon="folder" :collapsible="true"> -->
  <div v-if="recentProjects.length > 0" class="row q-pa-sm">
    <ProjectCard
      :project="project"
      v-for="project in recentProjects"
      :key="project.id"
    />
  </div>
  <!-- </oa-section> -->
  <!-- </div> -->
</template>

<script setup>
import { onMounted, ref } from "vue";
import projectsGraphQlAPI from "@/api/graphql/projects";
import ProjectCard from "@/components/dashboard/ProjectCard";

const recentProjects = ref([]);

onMounted(() => {
  fetchNRecentProject(3);
});

const fetchNRecentProject = (n) => {
  const { onResult } = projectsGraphQlAPI.nMostRecentlyUpdatedProjects(n);
  onResult(({ data }) => (recentProjects.value = data.projects));
};
</script>
