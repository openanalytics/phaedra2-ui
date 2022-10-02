<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="plate && experiment && project">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Projects'" icon="list" :to="'/projects'"/>
    <q-breadcrumbs-el :label="project.name" icon="folder" :to="'/project/' + project.id"/>
    <q-breadcrumbs-el :label="experiment.name" icon="science" :to="'/experiment/' + experiment.id"/>
    <q-breadcrumbs-el :label="plate.barcode" icon="view_module"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md" v-if="!editdialog">
      <oa-section-header v-if="!plate" :title="'Loading plate...'" :icon="'view_module'"/>
      <div v-else>
        <oa-section-header :title="plate.barcode" :icon="'view_module'"/>
        <div class="row q-pa-md oa-section-body">
          <div class="col-4 q-gutter-xs">
            <div class="row">
              <div class="col-3 text-weight-bold">ID:</div>
              <div class="col">{{ plate.id }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Dimensions:</div>
              <div class="col">{{ plate.rows }} x {{ plate.columns }} ({{ plate.rows * plate.columns }} wells)</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Description:</div>
              <div class="col">{{ plate.description }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Tags:</div>
              <div class="col">
                <TagList :objectInfo="plate" :objectClass="'PLATE'" />
              </div>
            </div>
          </div>

          <div class="col col-4">
            <PropertyTable :objectInfo="plate" :objectClass="'PLATE'"/>
          </div>

          <div class="col col-4">
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="edit" class="oa-button-edit" label="Edit" @click="editdialog = true"/>
            </div>
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="delete" class="oa-button-delete" label="Delete" @click="openDeleteDialog"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <edit-plate v-model:show="editdialog" v-model:plate="plate"></edit-plate>

    <div class="q-pa-md" v-if="plate">
      <q-tabs
          inline-label dense no-caps
          align="left"
          class="q-px-sm oa-section-title"
          v-model="activeTab"
      >
        <q-tab name="layout" icon="view_module" label="Layout"/>
        <q-tab name="heatmap" icon="view_module" label="Heatmap"/>
        <q-tab name="measurements" icon="text_snippet" label="Measurements"/>
        <q-tab name="wells" icon="table_rows" label="Well List"/>
        <q-tab name="results" icon="assignment_turned_in" label="Results"/>
        <q-tab name="curve" icon="show_chart" label="Dose Response Curve"/>
      </q-tabs>
      <div class="row oa-section-body">
        <q-tab-panels v-model="activeTab" animated style="width: 100%">
          <q-tab-panel name="layout">
            <PlateLayout :plate="plate" />
          </q-tab-panel>
          <q-tab-panel name="heatmap">
            <PlateHeatmap :plate="plate" />
          </q-tab-panel>
          <q-tab-panel name="measurements" icon="view_module" label="Layout">
            <MeasList :plate="plate" />
          </q-tab-panel>
          <q-tab-panel name="wells">
            <WellList :plate="plate" />
          </q-tab-panel>
          <q-tab-panel name="results">
            <ResultSetList :plate="plate" />
          </q-tab-panel>
          <q-tab-panel name="curve" icon="show_chart" >
            <DoseResponseCurve :plate="plate"/>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <delete-dialog ref="deleteDialog" v-model:id="plate.id" v-model:name="plate.barcode" v-model:show="showDialog" :objectClass="'plate'" @onDeleted="onDeleted" />
  </q-page>
</template>

<style scoped>
.plate-header {
  margin: 10px;
}

.plate-body {
  margin: 10px;
}

.action-button {
  margin: 3px;
}

.router-view {
  margin: 10px;
  padding-bottom: 10px;
}
</style>

<script setup>
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'

import TagList from "@/components/tag/TagList"
import EditPlate from "./EditPlate";
import PropertyTable from "@/components/property/PropertyTable";
import PlateLayout from "@/pages/plate/PlateLayout";
import PlateHeatmap from "@/pages/plate/PlateHeatmap";
import MeasList from "@/pages/plate/MeasList";
import WellList from "@/pages/plate/WellList";
import ResultSetList from "./ResultSetList";
import DoseResponseCurve from "@/components/plate/DoseResponseCurve"
import OaSectionHeader from "@/components/widgets/OaSectionHeader";
import DeleteDialog from "@/components/widgets/DeleteDialog";

const store = useStore()
const route = useRoute()
const router = useRouter()

const plateId = parseInt(route.params.id);

const plate = computed(() => store.getters['plates/getCurrentPlate']());
const experiment = computed(() => store.getters['experiments/getCurrentExperiment']());
const project = computed(() => store.getters['projects/getCurrentProject']());

store.dispatch('plates/loadById', plateId).then(() => {
  if (!experiment.value.id) {
    store.dispatch('experiments/loadById', plate.value.experimentId).then(() => {
      if (!project.value.id) {
        store.dispatch('projects/loadById', experiment.value.projectId);
      }
    });
  }
})

const activeTab = ref('layout')
const editdialog = ref(false)
const showDialog = ref(false)

const openDeleteDialog = () => {
  showDialog.value = true;
}

const onDeleted = () => {
  router.push({name: 'experiment', params: {id: experiment.value.id}})
}
</script>
