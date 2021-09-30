<template>
  <div class="col q-pa-md">
    <div class="q-px-sm projects-recent-title">
      <div class="text-h6">Recent Projects</div>
    </div>
    <q-card class="row">
      <ProjectCard :project="project" v-for="project in projects" :key="project.id"/>
    </q-card>
  </div>
</template>

<script>
import ProjectCard from "@/components/dashboard/ProjectCard";

export default {
  props: {
    projects: []
  },
  name: "RecentProjects",
  components: {
    ProjectCard
  }
}
</script>

<style scoped>

</style>
