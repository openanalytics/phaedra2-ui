<template>
  <div class="q-pa-md">
    <div class="q-px-sm oa-section-title">
      <div class="text-h6">Recent Projects</div>
    </div>
    <div class="row col-4 q-pa-lg" style="background-color: white">
      <ProjectCard :project="project" v-for="project in projects" :key="project.id"/>
    </div>
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

<style lang="scss">

</style>
