<template>
    <div v-if="projects.length > 0" class="row q-pa-sm">
        <ProjectCard :project="project" v-for="project in projects" :key="project.id"/>
    </div>
</template>

<script setup>
    import ProjectCard from "@/components/dashboard/ProjectCard";
    const props = defineProps({ projects: Array });
</script>
