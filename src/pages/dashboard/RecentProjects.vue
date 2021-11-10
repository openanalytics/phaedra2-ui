<template>
  <div class="q-pa-md">
    <div class="q-px-sm oa-section-title">
      <div class="row text-h6 items-center">
        <q-icon name="folder" class="on-left"/>Recent Projects
      </div>
    </div>
    <div class="row col-4 q-pa-lg oa-section-body">
      <ProjectCard :project="project" v-for="project in projects" :key="project.id"/>
    </div>
  </div>
</template>

<script>

import ProjectCard from "@/pages/dashboard/ProjectCard";

  export default {
    props: {
      projects: Array
    },
    name: "RecentProjects",
    components: {
      ProjectCard
    }
  }
</script>

<style lang="scss">
  @import "src/css/oa.global";

</style>
