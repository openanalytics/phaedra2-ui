<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="plate && experiment && project">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Projects'" icon="list" :to="'/projects'"/>
    <q-breadcrumbs-el :label="project.name" icon="folder" :to="'/project/' + project.id"/>
    <q-breadcrumbs-el :label="experiment.name" icon="science" :to="'/experiment/' + experiment.id"/>
    <q-breadcrumbs-el :label="plate.barcode" icon="view_module"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div v-if="!editdialog">
      <q-expansion-item :label="plate.barcode" icon="view_module"
                        header-class="q-pa-xs oa-section-title"
                        expand-icon-class="text-white"
                        default-opened dense>
        <div class="row q-pa-sm oa-section-body">
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
                <TagList :objectInfo="plate" :objectClass="'PLATE'"/>
              </div>
            </div>
          </div>

          <div class="col col-4">
            <PropertyTable :objectInfo="plate" :objectClass="'PLATE'"/>
          </div>

          <div class="col col-4">
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="edit" class="oa-button-edit dense" label="Edit"
                     @click="editdialog = true"/>
            </div>
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="delete" class="oa-button-delete" label="Delete"
                     @click="openDeleteDialog"/>
            </div>
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="" class="oa-button" label="Recalculate"/>
            </div>
          </div>
        </div>
      </q-expansion-item>
    </div>

    <edit-plate v-model:show="editdialog" v-model:plate="plate"></edit-plate>

    <div class="q-pa-sm" v-if="plate">
      <q-tabs
          inline-label dense no-caps
          align="left"
          class="q-pa-xs oa-section-title"
          v-model="activeTab"
      >
        <q-tab name="layout" icon="view_module" label="Layout" class="q-pa-xs oa-section-title"/>
        <q-tab name="heatmap" icon="view_module" label="Heatmap" class="q-pa-xs oa-section-title"/>
        <q-tab name="wells" icon="table_rows" label="Well List" class="q-pa-xs oa-section-title"/>
        <q-tab name="measurements" icon="text_snippet" label="Measurements" class="q-pa-xs oa-section-title"/>
        <q-tab name="results" icon="functions" label="Calculations" class="q-pa-xs oa-section-title"/>
      </q-tabs>
      <div class="row oa-section-body">
        <q-tab-panels v-model="activeTab" animated style="width: 100%">
          <q-tab-panel name="layout">
            <PlateLayout :plate="plate"/>
          </q-tab-panel>
          <q-tab-panel name="heatmap">
            <PlateHeatmap :plate="plate"/>
          </q-tab-panel>
          <q-tab-panel name="wells">
            <WellList :plate="plate"/>
          </q-tab-panel>
          <q-tab-panel name="measurements" icon="view_module" label="Layout">
            <MeasList :plate="plate"/>
          </q-tab-panel>
          <q-tab-panel name="results">
            <ResultSetList :plate="plate"/>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <div class="q-pa-sm" v-if="plate && curves">
      <q-expansion-item label="Dose-Response Curves" icon="show_chart"
                        header-class="q-pa-xs oa-section-title"
                        expand-icon-class="text-white"
                        default-opened dense ref="curvelist">
        <Splitpanes class="default-theme" @resize="updateWidth">
          <Pane :size="100 - sizeChartPane">
            <DoseResponseCurves :plate="plate" :curves="curves" @handle-selection="showSelectedCurves"/>
          </Pane>
          <Pane :size="sizeChartPane">
            <Splitpanes class="default-theme" horizontal="horizontal" @resize="updateHeight" :style="{height: chartPaneHeight + 'px'}">
              <Pane :size="chartPaneHeight">
                <DoseResponseCurve :plate="plate" :width="width" :height="height"/>
              </Pane>
              <Pane :size="chartPaneHeight">
                <DoseResponseCurveProperties :plate="plate"></DoseResponseCurveProperties>
              </Pane>
            </Splitpanes>
          </Pane>
        </Splitpanes>
      </q-expansion-item>
    </div>
    <delete-dialog ref="deleteDialog" v-model:id="plate.id" v-model:name="plate.barcode" v-model:show="showDialog"
                   :objectClass="'plate'" @onDeleted="onDeleted"/>
  </q-page>
</template>

<style scoped>
.action-button {
  margin: 3px;
}
</style>

<script setup>
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'
import { Splitpanes, Pane } from 'splitpanes'

import TagList from "@/components/tag/TagList"
import EditPlate from "./EditPlate";
import PropertyTable from "@/components/property/PropertyTable";
import PlateLayout from "@/pages/plate/PlateLayout";
import PlateHeatmap from "@/pages/plate/PlateHeatmap";
import MeasList from "@/pages/plate/MeasList";
import WellList from "@/pages/plate/WellList";
import ResultSetList from "./ResultSetList";
import DoseResponseCurves from "@/pages/plate/DoseResponseCurves"
import DeleteDialog from "@/components/widgets/DeleteDialog";
import DoseResponseCurve from "@/components/curve/DoseResponseCurve";
import DoseResponseCurveProperties from "@/components/curve/DoseResponseCurveProperties";

const store = useStore()

const route = useRoute()
const router = useRouter()

const plateId = parseInt(route.params.id);

const plate = computed(() => store.getters['plates/getCurrentPlate']());
const experiment = computed(() => store.getters['experiments/getCurrentExperiment']());
const project = computed(() => store.getters['projects/getCurrentProject']());

const sizeChartPane = ref(0)

store.dispatch('plates/loadById', plateId).then(() => {
  if (!experiment.value.id) {
    store.dispatch('experiments/loadById', plate.value.experimentId).then(() => {
      if (!project.value.id) {
        store.dispatch('projects/loadById', experiment.value.projectId);
      }
    });
  }
})

const curves = computed(() => store.getters['curvedata/getCurvesByPlateId'](plateId))
store.dispatch('curvedata/loadPlateCurves', plateId).then(() => {
  if (curves.value) {
    const featureIds = [...new Set(curves.value?.map(c => c.featureId))]
    store.dispatch('features/loadByIds', featureIds)
  }
})

const activeTab = ref('layout')
const editdialog = ref(false)
const showDialog = ref(false)
const curvelist = ref(null)

const openDeleteDialog = () => {
  showDialog.value = true;
}

const height = ref(400);
const width = ref(500)
const onDeleted = () => {
  router.push({name: 'experiment', params: {id: experiment.value.id}})
}
const updateHeight = (events) => {
  height.value = events[0].size;
}

const updateWidth = (events) => {
  width.value = events[1].size;
}

const chartPaneHeight = ref(0)
const showSelectedCurves = (args) => {
  sizeChartPane.value = 50
  chartPaneHeight.value = args
}

</script>
