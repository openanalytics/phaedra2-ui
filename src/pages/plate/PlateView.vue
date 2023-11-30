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
                <EditableField :object="plateStore.plate" fieldName="description" @valueChanged="onDescriptionChanged"/>
              </template>
            </q-field>
            <q-field label="Tags" stack-label dense borderless>
              <template v-slot:control>
                <TagList :tags="plateStore.plate.tags" :objectId="plateStore.plate.id" :objectClass="'PLATE'"/>
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
            <PropertyTable :objectInfo="plateStore.plate" :objectClass="'PLATE'"/>
          </div>

          <div class="col-2">
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

    <Splitpanes class="default-theme" @resize="updateWidth">
      <Pane :size="100 - paneSize" class="q-pa-sm" v-if="plateStore.plate" style="background-color: #E6E6E6">
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
              <PlateLayout :plate="plateStore.plate" :wells="plateStore.wells"/>
            </q-tab-panel>
            <q-tab-panel name="heatmap">
              <PlateHeatmap :plate="plateStore.plate" :wells="plateStore.wells"/>
            </q-tab-panel>
            <q-tab-panel name="wells">
              <WellList :plate="plateStore.plate" :wells="plateStore.wells"/>
            </q-tab-panel>
            <q-tab-panel name="measurements" icon="view_module" label="Layout">
              <MeasList :plate="plateStore.plate"/>
            </q-tab-panel>
            <q-tab-panel name="results">
              <ResultSetList :plate="plateStore.plate"/>
            </q-tab-panel>
            <q-tab-panel name="curves" icon="show_chart">
              <DRCList :plate="plateStore.plate" :curves="plateStore.curves" @showDRCView="handleShowDRCView"/>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </Pane>
      <Pane v-if="showDRCViewPane" style="background-color: #E6E6E6" ref="drcViewPane">
        <component :is="drcView" v-bind="drcViewProps" @closeDRCView="handleCloseDRCView"/>
      </Pane>
    </Splitpanes>

    <rename-dialog v-model:show="showRenameDialog" objectClass="plate" fieldName="barcode" :object="plateStore.plate" @valueChanged="onNameChanged"/>
    <delete-dialog v-model:show="showDeleteDialog" :id="plateStore.plate.id" :name="plateStore.plate.barcode" :objectClass="'plate'" @onDeleted="onDeleted"/>
    <calculate-plate-dialog v-model:show="showCalculateDialog" :plate="plateStore.plate"/>
  </q-page>
</template>

<script setup>
import {defineComponent, reactive, ref, watchEffect} from 'vue'
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

const route = useRoute();
const projectStore = useProjectStore()
const experimentStore = useExperimentStore()
const plateStore = usePlateStore()
const router = useRouter();

const plateId = parseInt(route.params.plateId);
plateStore.loadPlate(plateId);

const height = ref(400);
const width = ref(500);

const drcView = ref(defineComponent(DRCView))
const drcViewPane = ref()
const showDRCViewPane = ref(false)
const drcViewProps = reactive({height: height.value, width: width.value, curve: null})

watchEffect(() => {
  // Load parent experiment and project, if needed.
  if (plateStore.isLoaded(plateId)) {
    const expId = plateStore.plate.experimentId;
    experimentStore.loadExperiment(expId);
    if (experimentStore.isLoaded(expId)) projectStore.loadProject(experimentStore.experiment.projectId);
  }
});

const activeTab = ref('layout')
const sizeChartPane = ref(0)

const showDeleteDialog = ref(false);
const showCalculateDialog = ref(false);

const showRenameDialog = ref(false);
const onNameChanged = function (newBarcode) {
  plateStore.renamePlate(newBarcode)
};

const onDescriptionChanged = (newDescription) => {
  plateStore.editPlateDescription(newDescription)
};

const onDeleted = () => {
  router.push({name: 'experiment', params: {id: experimentStore.experiment.id}})
}

const updateHeight = (events) => {
  height.value = events[0].size;
  drcViewProps.height = events[0].size
}

const updateWidth = (events) => {
  width.value = events[1].size;
  drcViewProps.width = events[1].size
}

const chartPaneHeight = ref(0)
const showSelectedCurves = (args) => {
  sizeChartPane.value = 40
  chartPaneHeight.value = args
}

const handleShowDRCView = (data) => {
  showDRCViewPane.value = true
  drcViewProps.curves = [...data]
}

const handleCloseDRCView = () => {
  showDRCViewPane.value = false
}

</script>

<style scoped>
.action-button {
  margin: 3px;
}
</style>
