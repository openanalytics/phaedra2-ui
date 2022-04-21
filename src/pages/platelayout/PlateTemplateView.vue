<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="plateTemplate">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Templates'" icon="list" :to="'/templates'"/>
    <q-breadcrumbs-el :label="plateTemplate.name" icon="border_outer"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-md" v-if="!editdialog">
      <oa-section-header v-if="!plateTemplate" :title="'Loading template...'" :icon="'border_outer'"/>
      <div v-else>
        <oa-section-header :title="plateTemplate.name" :icon="'border_outer'"/>
        <div class="row col-4 q-pa-md oa-section-body">
          <div class="col col-4">
            <div class="row">
              <div class="col-3 text-weight-bold">ID:</div>
              <div class="col">{{ plateTemplate.id }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Dimensions:</div>
              <div class="col">{{ plateTemplate.rows }} x {{ plateTemplate.columns }} ({{ plateTemplate.rows * plateTemplate.columns }} wells)</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Description:</div>
              <div class="col">{{ plateTemplate.description }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Tags:</div>
              <div class="col">
                <TagList :objectInfo="plateTemplate" :objectClass="'PLATE_TEMPLATE'" />
              </div>
            </div>
          </div>

          <div class="col col-4">
            <PropertyTable :objectInfo="plateTemplate" :objectClass="'PLATE_TEMPLATE'"/>
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
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="delete" class="oa-button-delete" label="Delete"
                     @click="$refs.deleteDialog.showDialog = true"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <edit-plate-template v-model:show="editdialog"></edit-plate-template>

    <div class="q-pa-md" v-if="plateTemplate">
      <q-tabs
          inline-label dense no-caps
          align="left"
          class="q-px-sm oa-section-title"
          v-model="activeTab"
      >
        <q-tab name="overview" icon="view_module" label="Overview"/>
        <q-tab name="well-type" icon="text_snippet" label="Well Type"/>
        <q-tab name="substance" icon="view_module" label="Substance"/>
      </q-tabs>
      <div class="row oa-section-body">
        <q-tab-panels v-model="activeTab" animated style="width: 100%">
          <q-tab-panel name="overview" icon="view_module" label="Overview">
            <PlateTemplateLayout :plate="plateTemplate" :tab="'overview'"></PlateTemplateLayout>
          </q-tab-panel>
          <q-tab-panel name="well-type" icon="view_module" label="Well Type">
            <PlateTemplateLayout :plate="plateTemplate" :tab="'well-type'"></PlateTemplateLayout>
          </q-tab-panel>
          <q-tab-panel name="substance" icon="view_module" label="Substance">
            <PlateTemplateLayout :plate="plateTemplate" :tab="'substance'"></PlateTemplateLayout>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <delete-dialog ref="deleteDialog" v-model:id="plateTemplate.id" v-model:name="plateTemplate.name" :objectClass="'template'" @onDeleted="onDeleted" />

  </q-page>
</template>

<style scoped>
.action-button {
  margin: 3px;
}
</style>


<script>
import {computed, ref} from 'vue'
import {useStore} from 'vuex'

import TagList from "@/components/tag/TagList";
import PropertyTable from "@/components/property/PropertyTable";
import PlateTemplateLayout from "./PlateTemplateLayout";
import {useRoute, useRouter} from "vue-router";
import EditPlateTemplate from "./EditPlateTemplate";
import OaSectionHeader from "../../components/widgets/OaSectionHeader";
import DeleteDialog from "../../components/widgets/DeleteDialog";

export default {
  name: 'PlateTemplate',
  components: {
    EditPlateTemplate,
    PlateTemplateLayout,
    TagList,
    PropertyTable,
    OaSectionHeader,
    DeleteDialog
  },
  methods: {
    savePlateTemplate() {
      this.$store.dispatch('templates/savePlateTemplate')
    }
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const plateTemplateId = parseInt(route.params.id);

    store.dispatch('templates/loadById', plateTemplateId);

    const plateTemplate = computed(() => store.getters['templates/getCurrentPlateTemplate']());
    //store.dispatch('plates/loadPlateTags', plateTemplateId)

    return {
      plateTemplate,
      activeTab: ref('overview'),
      editdialog: ref(false),
      onDeleted: () => {
        router.push({name: 'dashboard'})
      }
    }
  }
}
</script>
