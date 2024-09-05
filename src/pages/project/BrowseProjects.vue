<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard' }" />
    <q-breadcrumbs-el label="Projects" icon="list" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <oa-section title="Projects" icon="folder" class="q-pa-sm">
      <ProjectBrowser />
    </oa-section>
  </q-page>
</template>

<script setup>
import ProjectBrowser from "@/components/project/browser/ProjectBrowser.vue";
import OaSection from "@/components/widgets/OaSection";
</script>