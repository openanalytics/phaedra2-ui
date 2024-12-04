<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench' }" />
    <q-breadcrumbs-el :label="'Projects'" icon="list" :to="'/projects'" />
    <q-breadcrumbs-el label="New Project" icon="folder" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="New Project" icon="folder">
        <div class="q-pa-sm">
          <CreateProjectForm />
        </div>
      </oa-section>
    </div>
  </q-page>
</template>

<script setup>
import OaSection from "@/components/widgets/OaSection";
import CreateProjectForm from "@/components/project/forms/CreateProjectForm.vue";
</script>
