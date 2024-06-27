<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="plateStore.plate && experimentStore.experiment && projectStore.project">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el label="Projects" icon="list" :to="'/projects'"/>
    <q-breadcrumbs-el :label="projectStore.project.name" icon="folder" :to="'/project/' + projectStore.project.id"/>
    <q-breadcrumbs-el :label="experimentStore.experiment.name" icon="science" :to="'/experiment/' + experimentStore.experiment.id"/>
    <q-breadcrumbs-el :label="plateStore.plate.barcode" icon="view_module"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs" v-if="plateStore.plate">
    <div class="q-pa-sm">
      <oa-section v-if="!plateStore.plate" title="Loading plate..." icon="view_module"/>
      <oa-section v-else :title="plateStore.plate.barcode" icon="view_module" :collapsible="true">
        <div class="row q-pa-sm">
          <div class="col-3">
            <q-field label="ID" stack-label borderless dense>
              <template v-slot:control>
                {{ plateStore.plate.id }}
              </template>
            </q-field>
            <q-field label="Description" stack-label borderless dense>
              <template v-slot:control>
                <EditableField :object="plateStore.plate" fieldName="description" :read-only="readOnly"
                               @valueChanged="onDescriptionChanged"/>
              </template>
            </q-field>
            <q-field label="Tags" stack-label dense borderless>
              <template v-slot:control>
                <tag-list :tags="plateStore.plate.tags" :read-only="readOnly"
                          @addTag="onAddTag" @removeTag="onRemoveTag"
                          class="q-pt-xs"/>
              </template>
            </q-field>
          </div>

          <div class="col-3">
            <q-field label="Dimensions" stack-label borderless dense>
              <template v-slot:control>
                {{ plateStore.plate.rows }} x {{ plateStore.plate.columns }} ({{ plateStore.plate.rows * plateStore.plate.columns }} wells)
              </template>
            </q-field>
            <q-field label="Created On" stack-label dense borderless>
              <template v-slot:control>
                {{ FormatUtils.formatDate(plateStore.plate.createdOn) }}
              </template>
            </q-field>
            <q-field label="Created By" stack-label dense borderless>
              <template v-slot:control>
                <UserChip :id="plateStore.plate.createdBy"/>
              </template>
            </q-field>
          </div>

          <div class="col-4">
            <PropertyTable :properties="plateStore.plate.properties" :read-only="readOnly"
                           @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
          </div>

          <div class="col-2" v-if="!readOnly">
            <div class="row justify-end">
              <q-btn size="sm" icon="edit" label="Rename" class="oa-action-button" @click="showRenameDialog = true"/>
            </div>
            <div class="row justify-end">
              <q-btn size="sm" icon="delete" class="oa-action-button" label="Delete" @click="showDeleteDialog = true"/>
            </div>
            <div class="row justify-end">
              <q-btn size="sm" icon="calculate" class="oa-action-button" label="Recalculate" @click="showCalculateDialog = true"/>
            </div>
          </div>
        </div>
      </oa-section>
    </div>

    <splitpanes class="default-theme" :horizontal="horizontal">
      <pane class="q-pa-sm" v-if="plateStore.plate" style="background-color: #E6E6E6">
        <q-tabs inline-label dense no-caps align="left" class="oa-section-title" v-model="activeTab">
          <q-tab name="layout" icon="view_module" label="Layout" class="oa-section-title"/>
          <q-tab name="heatmap" icon="view_module" label="Heatmap" class="oa-section-title"/>
          <q-tab name="wells" icon="table_rows" label="Well List" class="oa-section-title"/>
          <q-tab name="measurements" icon="text_snippet" label="Measurements" class="oa-section-title"/>
          <q-tab name="results" icon="functions" label="Calculations" class="oa-section-title"/>
          <q-tab name="curves" icon="show_chart" label="Dose-Response Curves" class="oa-section-title"/>
        </q-tabs>
        <div class="row oa-section-body">
          <q-tab-panels v-model="activeTab" animated style="width: 100%; height: 100%">
            <q-tab-panel name="layout">
              <PlateLayout :plate="plateStore.plate" :wells="plateStore.wells" @wellStatusChanged="onWellStatusChanged"/>
            </q-tab-panel>
            <q-tab-panel name="heatmap">
              <PlateHeatmap :plate="plateStore.plate" :wells="plateStore.wells"
                            :measurements="plateStore.activeMeasurement !== undefined ? [plateStore.activeMeasurement] : []"
                            :protocols="plateStore.protocols" @wellStatusChanged="onWellStatusChanged"/>
            </q-tab-panel>
            <q-tab-panel name="wells" class="q-px-none">
              <WellList :plate="plateStore.plate" :wells="plateStore.wells" @wellStatusChanged="onWellStatusChanged"/>
            </q-tab-panel>
            <q-tab-panel name="measurements" icon="view_module" label="Layout" class="q-px-none">
              <MeasList :plate="plateStore.plate" :read-only="readOnly"/>
            </q-tab-panel>
            <q-tab-panel name="results" class="q-px-none">
              <ResultSetList :plate="plateStore.plate"/>
            </q-tab-panel>
            <q-tab-panel name="curves" icon="show_chart">
              <DRCList :plate="plateStore.plate" :curves="plateStore.curves" :protocols="plateStore.protocols" />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </pane>
      <pane v-if="uiStore.showDRCView" style="background-color: #E6E6E6" ref="drcViewPane">
        <DRCView :height="height" :width="width" :curves="uiStore.selectedDRCurves" :update="Date.now()"
                 @changeOrientation="horizontal = !horizontal"/>
      </pane>
      <pane class="q-pa-sm" v-if="uiStore.showChartViewer" style="background-color: #E6E6E6" ref="chartViewerPane">
        <ChartViewer :update="Date.now()" @changeOrientation="horizontal = !horizontal" @wellStatusChanged="onWellStatusChanged"/>
      </pane>
    </splitpanes>

    <rename-dialog v-model:show="showRenameDialog" objectClass="plate" fieldName="barcode" :object="plateStore.plate" @valueChanged="onNameChanged"/>
    <delete-dialog v-model:show="showDeleteDialog" :id="plateStore.plate.id" :name="plateStore.plate.barcode" :objectClass="'plate'" @onDeleted="onDeleted"/>
    <calculate-plate-dialog v-model:show="showCalculateDialog" :plates="[plateStore.plate]" :protocol-id="plateStore.activeResultSet?.protocolId"/>
  </q-page>
</template>

<script setup>
import {onMounted, ref, watchEffect} from 'vue'
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
import DeleteDialog from "@/components/widgets/DeleteDialog"
import RenameDialog from "@/components/widgets/RenameDialog"
import CalculatePlateDialog from "@/components/plate/CalculatePlateDialog"
import {useProjectStore} from "@/stores/project";
import {useExperimentStore} from "@/stores/experiment";
import {usePlateStore} from "@/stores/plate";
import DRCList from "@/components/curve/DRCList.vue";
import DRCView from "@/components/curve/DRCView.vue";
import ChartViewer from "@/components/chart/ChartViewer.vue";
import {useUIStore} from "@/stores/ui";
import {useNotification} from "@/composable/notification";

const route = useRoute();
const projectStore = useProjectStore()
const experimentStore = useExperimentStore()
const plateStore = usePlateStore()
const uiStore = useUIStore()
const router = useRouter()

const horizontal = ref(false)
const height = ref(400)
const width = ref(500)

const readOnly = ref(plateStore.isApproved || experimentStore.isClosed)

const drcViewPane = ref()
const chartViewerPane = ref()

const plateId = parseInt(route.params.plateId)
onMounted(() => {
  plateStore.loadPlate(plateId)
})

watchEffect(() => {
  if (plateStore.isLoaded(plateId)) {
    const experimentId = plateStore.plate.experimentId;
    if (experimentStore.isLoaded(experimentId)) {
      const projectId = experimentStore.experiment.projectId
      if (!projectStore.isLoaded(projectId))
        projectStore.loadProject(projectId);
    } else {
      experimentStore.loadExperiment(experimentId);
    }
  }
})

const activeTab = ref(route.query.activeTab ?? 'layout')

const showDeleteDialog = ref(false);
const showCalculateDialog = ref(false);

const showRenameDialog = ref(false);
const onNameChanged = async (newBarcode) => {
  await plateStore.renamePlate(newBarcode)
};

const onDescriptionChanged = async (newDescription) => {
  await plateStore.editPlateDescription(newDescription)
};

const onDeleted = async () => {
  await plateStore.deletePlate()
  await router.push({name: 'experiment', params: {id: experimentStore.experiment.id}})
}

const onAddTag = async (newTag) => {
  await plateStore.addTag(newTag)
}

const onRemoveTag = async (tag) => {
  await plateStore.deleteTag(tag)
}

const onAddProperty = async (newProperty) => {
  await plateStore.addPropertty(newProperty)
}

const onRemoveProperty = async (property) => {
  await plateStore.deleteProperty(property)
}

const wellStatusNotification = useNotification()
const onWellStatusChanged = () => {
  wellStatusNotification.showInfoNotification(
      "Plate's well(s) status has changed! Recalculate plate?",
      () => { showCalculateDialog.value = true },
      () => { }
  )
}
</script>
