<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="plateStore.plate && experimentStore.experiment && projectStore.project">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el label="Projects" icon="list" :to="'/projects'"/>
    <q-breadcrumbs-el :label="projectStore.project.name" icon="folder" :to="'/project/' + projectStore.project.id"/>
    <q-breadcrumbs-el :label="experimentStore.experiment.name" icon="science" :to="'/experiment/' + experimentStore.experiment.id"/>
    <q-breadcrumbs-el :label="plateStore.plate.barcode" icon="view_module"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs" v-if="plateStore.plate">
    <plate-details/>

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
      <pane class="q-pa-sm" v-if="uiStore.showImageView" style="background-color: #E6E6E6" ref="imageViewPane" >
        <div class="row oa-section-title">
          <div class="col text-h6 q-ml-md">
            Well Image
          </div>
          <div class="col-1 text-h6">
            <q-btn icon="close" @click="closeImageView" class="q-pa-xs" size="md" flat/>
          </div>
        </div>
        <WellImageViewer/>
      </pane>
    </splitpanes>

    <calculate-plate-dialog v-model:show="showCalculateDialog" :plates="[plateStore.plate]" :protocol-id="plateStore.activeResultSet?.protocolId"/>
  </q-page>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {Splitpanes, Pane} from 'splitpanes'


import PlateLayout from "@/pages/plate/PlateLayout"
import PlateHeatmap from "@/pages/plate/PlateHeatmap"
import MeasList from "@/pages/plate/MeasList"
import WellList from "@/pages/plate/WellList"
import ResultSetList from "./ResultSetList"

import CalculatePlateDialog from "@/components/plate/CalculatePlateDialog"
import {useProjectStore} from "@/stores/project";
import {useExperimentStore} from "@/stores/experiment";
import {usePlateStore} from "@/stores/plate";
import DRCList from "@/components/curve/DRCList.vue";
import DRCView from "@/components/curve/DRCView.vue";
import ChartViewer from "@/components/chart/ChartViewer.vue";
import {useUIStore} from "@/stores/ui";
import {useNotification} from "@/composable/notification";
import {useLoadingHandler} from "@/composable/loadingHandler";
import WellImageViewer from "@/components/image/WellImageViewer.vue";
import PlateDetails from "@/pages/plate/PlateDetails.vue";

const route = useRoute();
const projectStore = useProjectStore()
const experimentStore = useExperimentStore()
const plateStore = usePlateStore()
const uiStore = useUIStore()
const router = useRouter()

const horizontal = ref(false)
const height = ref(400)
const width = ref(500)
const activeTab = ref(route.query.activeTab ?? 'layout')

const readOnly = ref(plateStore.isApproved || experimentStore.isClosed)

const drcViewPane = ref()
const chartViewerPane = ref()
const imageViewPane = ref()

const plateId = parseInt(route.params.plateId)
const loadingHandler = useLoadingHandler()
onMounted(() => {
  plateStore.loadPlate(plateId)
})

const showCalculateDialog = ref(false);
const wellStatusNotification = useNotification()
const onWellStatusChanged = () => {
  wellStatusNotification.showInfo(
      "Plate's well(s) status has changed! Recalculate plate?",
      () => { showCalculateDialog.value = true },
      () => { }
  )
}

const closeImageView = () => {
  uiStore.showImageView = false
}
</script>
