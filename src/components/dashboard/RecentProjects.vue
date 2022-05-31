<template>
  <div class="q-pa-md">
    <oa-section-header :title="'Recent Projects'" :icon="'folder'"/>
    <div class="row col-4 q-pa-lg oa-section-body">
      <ProjectCard :project="project" v-for="project in projects" :key="project.id"/>
    </div>
  </div>
</template>

<script setup>
import ProjectCard from "@/components/dashboard/ProjectCard";
import OaSectionHeader from "../widgets/OaSectionHeader";

const props = defineProps({
  projects: Array
})

</script>

<style lang="scss">
@import "src/css/oa.global";

</style>
