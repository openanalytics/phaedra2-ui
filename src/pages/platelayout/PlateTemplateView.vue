<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="templateStore.template">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench' }" />
    <q-breadcrumbs-el :label="'Templates'" icon="list" :to="'/templates'" />
    <q-breadcrumbs-el
      :label="templateStore.template.name"
      icon="border_outer"
    />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm" v-if="!editdialog">
      <plate-template-details :template="templateStore.template"/>
    </div>

    <div class="q-pa-sm" v-if="templateStore.template">
      <q-tabs inline-label dense no-caps align="left" class="oa-section" v-model="activeTab">
        <q-tab name="overview" icon="view_module" label="Overview" />
        <q-tab name="well-type" icon="text_snippet" label="Well Type" />
        <q-tab name="substance" icon="view_module" label="Substance" />
        <q-tab name="concentration" icon="view_module" label="Concentration" />
      </q-tabs>

      <div class="oa-section-body">
        <q-tab-panels v-model="activeTab" animated style="width: 100%">
          <q-tab-panel name="overview" icon="view_module" label="Overview">
            <PlateTemplateLayout
              :plate="templateStore.template"
              :tab="activeTab"
            />
          </q-tab-panel>
          <q-tab-panel name="well-type" icon="view_module" label="Well Type">
            <PlateTemplateLayout
              :plate="templateStore.template"
              :tab="activeTab"
            />
          </q-tab-panel>
          <q-tab-panel name="substance" icon="view_module" label="Substance">
            <PlateTemplateLayout
              :plate="templateStore.template"
              :tab="activeTab"
            />
          </q-tab-panel>
          <q-tab-panel
            name="concentration"
            icon="view_module"
            label="Concentration"
          >
            <PlateTemplateLayout
              :plate="templateStore.template"
              :tab="activeTab"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useRoute } from "vue-router";

import { useLoadingHandler } from "../../composable/loadingHandler";
import PlateTemplateDetails from "@/pages/platelayout/PlateTemplateDetails.vue";
import PlateTemplateLayout from "@/pages/platelayout/PlateTemplateLayout.vue";

const route = useRoute();
const templateStore = useTemplateStore();

const activeTab = ref("overview");
const editdialog = ref(false);

const fetchTemplate = async () => {
  const templateId = parseInt(route.params.id);
  await templateStore.loadTemplate(templateId);
}

const loadingHandler = useLoadingHandler();
loadingHandler.handleLoadingDuring(fetchTemplate());

</script>
