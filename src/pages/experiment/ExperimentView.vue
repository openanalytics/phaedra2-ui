<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="experiment && project">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Projects'" icon="list" :to="'/projects'"/>
    <q-breadcrumbs-el :label="project.name" icon="folder"
                      :to="{ name: 'project', params: { id: experiment.projectId } }"/>
    <q-breadcrumbs-el :label="experiment.name" icon="science"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md" v-if="!editdialog">

      <oa-section-header v-if="!experiment" :title="'Loading experiment...'" :icon="'science'"/>

      <div v-else>
        <oa-section-header :title="experiment.name" :icon="'science'"/>

        <div class="row q-pa-md oa-section-body">

          <div class="col-4 q-gutter-xs">
            <div class="row">
              <div class="col-3 text-weight-bold">ID:</div>
              <div class="col">{{ experiment.id }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Created On:</div>
              <div class="col">{{ FormatUtils.formatDate(experiment.createdOn) }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Created By:</div>
              <div class="col"><UserChip :id="experiment.createdBy" /></div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Description:</div>
              <div class="col">{{ experiment.description }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Tags:</div>
              <div class="col">
                <TagList :objectInfo="experiment" :objectClass="'EXPERIMENT'" />
              </div>
            </div>
          </div>

          <div class="col-4">
            <PropertyTable :objectInfo="experiment" :objectClass="'EXPERIMENT'"/>
          </div>

          <div class="col-4">
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="edit" class="oa-button-edit" label="Edit" @click="editdialog = true"/>
            </div>
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="delete" class="oa-button-delete" label="Delete" @click="openDeleteDialog" />
            </div>
          </div>

        </div>
      </div>
    </div>

    <edit-experiment v-model:show="editdialog" v-model:experiment="experiment"></edit-experiment>

    <div class="q-pa-md" v-if="experiment">
      <q-tabs
          v-model="activeTab"
          inline-label dense no-caps
          align="left"
          class="q-px-sm oa-section-title"
      >
        <q-tab name="overview" icon="table_rows" label="Overview"/>
        <q-tab name="statistics" icon="functions" label="Statistics"/>
        <q-tab name="heatmaps" icon="view_module" label="Heatmaps"/>
      </q-tabs>
      <div class="row oa-section-body">
<!--        <router-view class="router-view" :experiment="experiment" @message="newPlateTab=true"></router-view>-->
        <!--        <router-view v-model:experiment="experiment" v-model:newPlateTab="newPlateTab"></router-view>-->
        <q-tab-panels v-model="activeTab" animated style="width: 100%">
          <q-tab-panel name="overview" class="q-px-none">
            <PlateList :experiment="experiment" v-model:newPlateTab="newPlateTab" @showPlateInspector="openPlateInspector()"/>
          </q-tab-panel>
          <q-tab-panel name="statistics" class="q-px-none">
            <PlateStatsList :experiment="experiment"/>
          </q-tab-panel>
          <q-tab-panel name="heatmaps" class="q-px-none">
            <PlateGrid :experiment="experiment"/>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <div class="q-pa-md" v-if="newPlateTab">
      <oa-section-header :title="'New Plate'" :icon="'add'"/>
      <div class="col-12 q-pa-md oa-section-body">
        <div class="row" style="min-width: 90vw">
          <div class="col col-5">
            <q-input v-model="newPlate.barcode" square autofocus label="Barcode"></q-input>
            <q-input v-model="newPlate.description" square label="Description"></q-input><br>

          </div>
          <div class="col col-1">

          </div>
          <div class="col col-4">
            <q-input v-model="newPlate.rows" square label="Rows"></q-input>
            <q-input v-model="newPlate.columns" square label="Columns"></q-input><br>
          </div>
        </div>
        <div class="row justify-end">
          <q-btn flat label="Cancel" color="primary" @click="newPlateTab = false"/>
          <q-btn align="right" label="Add plate" v-close-popup color="primary" @click="createNewPlate"/>
        </div>
      </div>
    </div>

    <delete-dialog v-model:show="showDialog" :id="experiment.id" :name="experiment.name" :objectClass="'experiment'" @onDeleted="onDeleted" />
    <plate-inspector v-if="showPlateInspector" :plate="selectedPlate" @hidePlateInspector="closePlateInspector()"/>
  </q-page>
</template>

<style scoped lang="scss">
.experiment-header {
  margin: 10px;
}

.experiment-body {
  margin: 10px;
}

.action-button {
  margin: 3px;
}
</style>

<script setup>
import {ref, computed} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'

import TagList from "@/components/tag/TagList";
import UserChip from "@/components/widgets/UserChip";
import EditExperiment from "./EditExperiment";
import PropertyTable from "@/components/property/PropertyTable";
import PlateList from "@/pages/experiment/PlateList";
import PlateStatsList from "@/pages/experiment/PlateStatsList";
import PlateGrid from "@/pages/experiment/PlateGrid";
import DeleteDialog from "../../components/widgets/DeleteDialog";
import OaSectionHeader from "../../components/widgets/OaSectionHeader";
import FormatUtils from "@/lib/FormatUtils.js"
import PlateInspector from "@/components/plate/PlateInspector"

const store = useStore()
const route = useRoute()
const router = useRouter()

const experimentId = parseInt(route.params.id);

const projectId = ref(null);
const activeTab = ref('overview')

const newPlateTab = ref(false)
const newPlate = ref({
  barcode: null,
  description: null,
  rows: null,
  columns: null,
  sequence: null,
  linkStatus: "NOT_LINKED",
  calculationStatus: "CALCULATION_NEEDED",
  validationStatus: "VALIDATION_NOT_SET",
  approvalStatus: "APPROVAL_NOT_SET",
})
const experimentName = ref("")
const editdialog = ref(false)
const showDialog = ref(false);
const showPlateInspector = ref(false);

const experiment = computed(() => store.getters['experiments/getById'](experimentId) || {})
const project = computed(() => store.getters['projects/getById'](projectId.value))

store.dispatch('experiments/loadById', experimentId).then(() => {
  projectId.value = experiment.value.projectId;
  store.dispatch('projects/loadById', projectId.value);
})

const createNewPlate = () => {
  newPlate.value.sequence = "1"
  newPlate.value.experimentId = experimentId
  store.dispatch('plates/createNewPlate', newPlate.value)
  newPlateTab.value = false
}

const openDeleteDialog = () => {
  showDialog.value = true;
}

const onDeleted = () => {
  router.push({name: 'project', params: {id: project.value.id}})
}

const openPlateInspector = () => {
  showPlateInspector.value = true;
}

const closePlateInspector = () => {
  showPlateInspector.value = false
}
</script>
