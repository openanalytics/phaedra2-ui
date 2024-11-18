<template>
  <div v-if="recentProjects.length > 0" class="row q-pa-sm">
    <ProjectCard
      :project="project"
      v-for="project in recentProjects"
      :key="project.id"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import projectsGraphQlAPI from "@/api/graphql/projects";
import ProjectCard from "@/components/dashboard/ProjectCard";

const recentProjects = ref([]);

onMounted(() => {
  fetchNRecentProject(3);
});

const fetchNRecentProject = async (n) => {
  const data = await projectsGraphQlAPI.nMostRecentlyUpdatedProjects(n);
  recentProjects.value = data.projects
};
</script>
