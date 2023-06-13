<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="plate && experiment && project">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el label="Projects" icon="list" :to="'/projects'"/>
    <q-breadcrumbs-el :label="project.name" icon="folder" :to="'/project/' + project.id"/>
    <q-breadcrumbs-el :label="experiment.name" icon="science" :to="'/experiment/' + experiment.id"/>
    <q-breadcrumbs-el :label="plate.barcode" icon="view_module"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md">
      <oa-section v-if="!plate" title="Loading plate..." icon="view_module"/>
      <oa-section v-else :title="plate.barcode" icon="view_module" :collapsible="true">
        <div class="row q-pa-md">
          <div class="col-3">
            <q-field label="ID" stack-label borderless dense>
              <template v-slot:control>
                {{ plate.id }}
              </template>
            </q-field>
            <q-field label="Description" stack-label borderless dense>
              <template v-slot:control>
                <EditableField :object="plate" fieldName="description" @valueChanged="onDescriptionChanged"/>
              </template>
            </q-field>
            <q-field label="Tags" stack-label dense borderless>
              <template v-slot:control>
                <TagList :objectInfo="plate" :objectClass="'PLATE'"/>
              </template>
            </q-field>
          </div>

          <div class="col-3">
            <q-field label="Dimensions" stack-label borderless dense>
              <template v-slot:control>
                {{ plate.rows }} x {{ plate.columns }} ({{ plate.rows * plate.columns }} wells)
              </template>
            </q-field>
            <q-field label="Created On" stack-label dense borderless>
              <template v-slot:control>
                {{ FormatUtils.formatDate(plate.createdOn) }}
              </template>
            </q-field>
            <q-field label="Created By" stack-label dense borderless>
              <template v-slot:control>
                <UserChip :id="plate.createdBy"/>
              </template>
            </q-field>
          </div>

          <div class="col-4">
            <PropertyTable :objectInfo="plate" :objectClass="'PLATE'"/>
          </div>

          <div class="col-2">
            <div class="row justify-end">
              <q-btn size="sm" icon="edit" label="Rename" class="oa-action-button" @click="showRenameDialog = true"/>
            </div>
            <div class="row justify-end">
              <q-btn size="sm" color="primary" icon="delete" class="oa-action-button" label="Delete"
                     @click="showDeleteDialog = true"/>
            </div>
            <div class="row justify-end">
              <q-btn size="sm" color="primary" icon="calculate" class="oa-action-button" label="Recalculate"
                     @click="showCalculateDialog = true"/>
            </div>
          </div>
        </div>
      </oa-section>
    </div>

    <div class="q-pa-md" v-if="plate">
      <q-tabs inline-label dense no-caps align="left" class="oa-section-title" v-model="activeTab">
        <q-tab name="layout" icon="view_module" label="Layout" class="oa-section-title"/>
        <q-tab name="heatmap" icon="view_module" label="Heatmap" class="oa-section-title"/>
        <q-tab name="wells" icon="table_rows" label="Well List" class="oa-section-title"/>
        <q-tab name="measurements" icon="text_snippet" label="Measurements" class="oa-section-title"/>
        <q-tab name="results" icon="functions" label="Calculations" class="oa-section-title"/>
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

    <div class="q-pa-md" v-if="plate && curves">
      <oa-section title="Dose-Response Curves" icon="show_chart" :collapsible="true">
        <Splitpanes class="default-theme" @resize="updateWidth">
          <Pane :size="100 - sizeChartPane">
            <DoseResponseCurves :plate="plate" :curves="curves" @handle-selection="showSelectedCurves"/>
          </Pane>
          <Pane :size="sizeChartPane">
            <Splitpanes class="default-theme" horizontal="horizontal" @resize="updateHeight"
                        :style="{height: chartPaneHeight + 'px'}">
              <Pane :size="chartPaneHeight">
                <DoseResponseCurve :plate="plate" :width="width" :height="height"/>
              </Pane>
              <Pane :size="chartPaneHeight" style="overflow: auto">
                <DoseResponseCurveProperties :plate="plate"></DoseResponseCurveProperties>
              </Pane>
            </Splitpanes>
          </Pane>
        </Splitpanes>
      </oa-section>
    </div>

    <rename-dialog v-model:show="showRenameDialog" objectClass="plate" fieldName="barcode" :object="plate"
                   @valueChanged="onNameChanged"/>
    <delete-dialog ref="deleteDialog" v-model:id="plate.id" v-model:name="plate.barcode" v-model:show="showDeleteDialog"
                   :objectClass="'plate'" @onDeleted="onDeleted"/>
    <calculate-plate-dialog v-model:show="showCalculateDialog" :plateId="plate.id"/>
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
import {Splitpanes, Pane} from 'splitpanes'

import FormatUtils from "@/lib/FormatUtils.js"

import TagList from "@/components/tag/TagList"
import UserChip from "@/components/widgets/UserChip";
import EditableField from "@/components/widgets/EditableField";
import PropertyTable from "@/components/property/PropertyTable"
import PlateLayout from "@/pages/plate/PlateLayout"
import PlateHeatmap from "@/pages/plate/PlateHeatmap"
import MeasList from "@/pages/plate/MeasList"
import WellList from "@/pages/plate/WellList"
import ResultSetList from "./ResultSetList"
import OaSection from "@/components/widgets/OaSection";
import DoseResponseCurves from "@/components/curve/DoseResponseCurves"
import DeleteDialog from "@/components/widgets/DeleteDialog"
import RenameDialog from "@/components/widgets/RenameDialog"
import DoseResponseCurve from "@/components/curve/DoseResponseCurve"
import DoseResponseCurveProperties from "@/components/curve/DoseResponseCurveProperties"
import CalculatePlateDialog from "@/components/plate/CalculatePlateDialog"

const store = useStore();
const route = useRoute();
const router = useRouter();

const plateId = parseInt(route.params.id);

const plate = computed(() => store.getters['plates/getCurrentPlate']());
const experiment = computed(() => store.getters['experiments/getCurrentExperiment']());
const project = computed(() => store.getters['projects/getCurrentProject']());

const activeTab = ref('layout')
const sizeChartPane = ref(0)

store.dispatch('plates/loadById', plateId).then(() => {
  if (!experiment.value.id) {
    store.dispatch('experiments/loadById', plate.value.experimentId).then(() => {
      if (!project.value.id) {
        store.dispatch('projects/loadById', experiment.value.projectId);
      }
    });
  }
});

const curves = computed(() => store.getters['curvedata/getCurvesByPlateId'](plateId))
store.dispatch('curvedata/loadPlateCurves', plateId).then(() => {
  if (curves.value) {
    const featureIds = [...new Set(curves.value?.map(c => c.featureId))]
    store.dispatch('features/loadByIds', featureIds)
  }
});

const showDeleteDialog = ref(false);
const showCalculateDialog = ref(false);

const showRenameDialog = ref(false);
const onNameChanged = function (newName) {
  store.dispatch('plates/editPlate', {id: plateId, barcode: newName});
};

const onDescriptionChanged = (newDescription) => {
  store.dispatch('plates/editPlate', {id: plateId, description: newDescription});
};

const height = ref(400);
const width = ref(500);
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
