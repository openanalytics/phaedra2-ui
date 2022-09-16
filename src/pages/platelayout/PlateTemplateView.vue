<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="template">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Templates'" icon="list" :to="'/templates'"/>
    <q-breadcrumbs-el :label="template.name" icon="border_outer"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-md" v-if="!editdialog">
      <oa-section-header v-if="!template" :title="'Loading template...'" :icon="'border_outer'"/>
      <div v-else>
        <oa-section-header :title="template.name" :icon="'border_outer'"/>
        <div class="row col-4 q-pa-md oa-section-body">
          <div class="col col-4">
            <div class="row">
              <div class="col-3 text-weight-bold">ID:</div>
              <div class="col">{{ template.id }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Dimensions:</div>
              <div class="col">{{ template.rows }} x {{ template.columns }}
                ({{ template.rows * template.columns }} wells)
              </div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Description:</div>
              <div class="col">{{ template.description }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Tags:</div>
              <div class="col">
                <TagList :objectInfo="template" :objectClass="'PLATE_TEMPLATE'"/>
              </div>
            </div>
          </div>

          <div class="col col-4">
            <PropertyTable :objectInfo="template" :objectClass="'PLATE_TEMPLATE'"/>
          </div>

          <div class="col col-4">
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="save" class="oa-button-edit" label="Save"
                     @click="savePlateTemplate"/>
            </div>
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="edit" class="oa-button-edit" label="Edit"
                     @click="editdialog = true"/>
            </div>
<!--            <div class="row justify-end action-button">-->
<!--&lt;!&ndash;              <q-file ref="importFile" />&ndash;&gt;-->
<!--              <q-btn size="sm" color="primary" icon="import_export" class="oa-button-edit" label="Import..." @click="importTemplateFromFile"/>-->
<!--            </div>-->
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="delete" class="oa-button-delete" label="Delete"
                     @click="$refs.deleteDialog.showDialog = true"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <edit-plate-template v-model:show="editdialog"></edit-plate-template>

    <div class="q-pa-md" v-if="template">
      <q-tabs
          inline-label dense no-caps
          align="left"
          class="q-px-sm oa-section-title"
          v-model="activeTab">
        <q-tab name="overview" icon="view_module" label="Overview"/>
        <q-tab name="well-type" icon="text_snippet" label="Well Type"/>
        <q-tab name="substance" icon="view_module" label="Substance"/>
      </q-tabs>
      <div class="row oa-section-body">
        <q-tab-panels v-model="activeTab" animated style="width: 100%">
          <q-tab-panel name="overview" icon="view_module" label="Overview">
            <PlateTemplateLayout :plate="template" :tab="'overview'"></PlateTemplateLayout>
          </q-tab-panel>
          <q-tab-panel name="well-type" icon="view_module" label="Well Type">
            <PlateTemplateLayout :plate="template" :tab="'well-type'"></PlateTemplateLayout>
          </q-tab-panel>
          <q-tab-panel name="substance" icon="view_module" label="Substance">
            <PlateTemplateLayout :plate="template" :tab="'substance'"></PlateTemplateLayout>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <delete-dialog v-if="template" ref="deleteDialog" v-model:id="template.id"
                   v-model:name="template.name" :objectClass="'template'" @onDeleted="onDeleted"/>

  </q-page>
</template>

<style scoped>
.action-button {
  margin: 3px;
}
</style>


<script setup>
import {computed, onMounted, ref} from "vue"
import {useTemplateStore} from "@/stores/template";
import {useRoute, useRouter} from "vue-router";

import TagList from "@/components/tag/TagList";
import PropertyTable from "@/components/property/PropertyTable";
import PlateTemplateLayout from "./PlateTemplateLayout";
import EditPlateTemplate from "./EditPlateTemplate";
import OaSectionHeader from "@/components/widgets/OaSectionHeader";
import DeleteDialog from "@/components/widgets/DeleteDialog";

const route = useRoute()
const router = useRouter()
const templateStore = useTemplateStore()

const activeTab = ref('overview')
const editdialog = ref(false)

const templateId = parseInt(route.params.id);
templateStore.loadTemplate(templateId)

const template = computed( () => {
  return templateStore.template
})

const savePlateTemplate = () => {
  templateStore.saveTemplate()
}

const onDeleted = () => {
  router.push({name: 'dashboard'})
}
</script>
