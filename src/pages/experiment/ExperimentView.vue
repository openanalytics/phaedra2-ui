<template>
    <q-breadcrumbs class="oa-breadcrumb" v-if="experimentStore.experiment">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el :label="'Projects'" icon="list" :to="'/projects'"/>
        <q-breadcrumbs-el :label="projectStore.project.name" icon="folder" :to="{ name: 'project', params: { id: projectStore.project.id } }"/>
        <q-breadcrumbs-el :label="experimentStore.experiment.name" icon="science"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
        <div class="q-pa-sm">
            <oa-section v-if="!experimentStore.experiment" title="Loading experiment..." icon="science" />
            <oa-section v-else :title="experimentStore.experiment.name" icon="science" :collapsible="true">
                <div class="row q-pa-md">
                    <div class="col-3">
                        <q-field label="ID" stack-label dense borderless>
                            <template v-slot:control>
                                {{ experimentStore.experiment.id }}
                            </template>
                        </q-field>
                        <q-field label="Description" stack-label dense borderless>
                            <template v-slot:control>
                                <EditableField :object="experimentStore.experiment" fieldName="description" @valueChanged="onDescriptionChanged" />
                            </template>
                        </q-field>
                        <q-field label="Tags" stack-label dense borderless>
                            <template v-slot:control>
                              <TagList :tags="experimentStore.experiment.tags" @addTag="onAddTag" @removeTag="onRemoveTag"/>
                            </template>
                        </q-field>
                    </div>

                    <div class="col-3">
                        <q-field label="Created On" stack-label dense borderless>
                            <template v-slot:control>
                                {{ FormatUtils.formatDate(experimentStore.experiment.createdOn) }}
                            </template>
                        </q-field>
                        <q-field label="Created By" stack-label dense borderless>
                            <template v-slot:control>
                                <UserChip :id="experimentStore.experiment.createdBy"/>
                            </template>
                        </q-field>
                    </div>

                    <div class="col-4">
                        <PropertyTable :objectInfo="experimentStore.experiment" :objectClass="'EXPERIMENT'" :properties="experimentStore.experiment.properties" @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
                    </div>

                    <div class="col-2">
                        <div class="row justify-end">
                            <q-btn size="sm" icon="edit" label="Rename" class="oa-action-button" @click="showRenameDialog = true"/>
                        </div>
                        <div class="row justify-end">
                          <q-btn v-if="experimentStore.isOpen" size="sm" icon="lock" class="oa-action-button" label="Close" @click="handleCloseExperiment"/>
                          <q-btn v-if="!experimentStore.isOpen" size="sm" icon="unlock" class="oa-action-button" label="Open" @click="handleOpenExperiment"/>
                        </div>
                        <div class="row justify-end">
                            <q-btn size="sm" icon="delete" class="oa-action-button" label="Delete" @click="showDeleteDialog = true"/>
                        </div>
                    </div>
                </div>
            </oa-section>
        </div>

        <div class="q-pa-md" v-if="experimentStore.experiment">
            <q-tabs v-model="activeTab" inline-label dense no-caps align="left" class="oa-section-title">
                <q-tab name="overview" icon="table_rows" label="Overview"/>
                <q-tab name="statistics" icon="functions" label="Statistics"/>
                <q-tab name="heatmaps" icon="view_module" label="Heatmaps"/>
            </q-tabs>
            <div class="row oa-section-body">
                <q-tab-panels v-model="activeTab" animated class="full-width">
                    <q-tab-panel name="overview" class="q-px-none">
                        <PlateList :experiment="experimentStore.experiment" :plates="experimentStore.plates" v-model:newPlateTab="newPlateTab" />
                    </q-tab-panel>
                    <q-tab-panel name="statistics" class="q-px-none">
                        <PlateStatsList :experiment="experimentStore.experiment" :plates="experimentStore.plates"/>
                    </q-tab-panel>
                    <q-tab-panel name="heatmaps" class="q-px-none">
                        <PlateGrid :experiment="experimentStore.experiment" :plates="experimentStore.plates"/>
                    </q-tab-panel>
                </q-tab-panels>
            </div>
        </div>

        <div class="q-pa-md" v-if="newPlateTab">
            <oa-section title="New Plate" icon="add">
                <div class="col-12 q-pa-md">
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
                        <q-btn size="sm" label="Cancel" class="oa-action-button" @click="newPlateTab = false"/>
                        <q-btn size="sm" label="Add plate" class="oa-action-button" @click="createNewPlate"/>
                    </div>
                </div>
            </oa-section>
        </div>

      <div class="q-pa-sm">
        <ChartViewer/>
      </div>
      <rename-dialog v-model:show="showRenameDialog" objectClass="experiment" :object="experimentStore.experiment" @valueChanged="onNameChanged"/>
      <delete-dialog v-model:show="showDeleteDialog" :id="experimentStore.experiment?.id" :name="experimentStore.experiment?.name" :objectClass="'experiment'" @onDeleted="onDeleteExperiment"/>
    </q-page>
</template>

<script setup>
import {ref, watchEffect, computed, onMounted} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'

import TagList from "@/components/tag/TagList";
import UserChip from "@/components/widgets/UserChip";
import EditableField from "@/components/widgets/EditableField";
import PropertyTable from "@/components/property/PropertyTable";
import PlateList from "@/pages/experiment/PlateList";
import PlateStatsList from "@/pages/experiment/PlateStatsList";
import PlateGrid from "@/pages/experiment/PlateGrid";
import DeleteDialog from "@/components/widgets/DeleteDialog";
import RenameDialog from "@/components/widgets/RenameDialog";
import OaSection from "@/components/widgets/OaSection";
import FormatUtils from "@/lib/FormatUtils.js"

import ChartViewer from "@/components/chart/ChartViewer.vue";
import {useExperimentStore} from "@/stores/experiment";
import {useProjectStore} from "@/stores/project";

const store = useStore();
const projectStore = useProjectStore()
const experimentStore = useExperimentStore()
const route = useRoute();
const router = useRouter();

const experimentId = parseInt(route.params.experimentId)
onMounted(() => {
  experimentStore.loadExperiment(experimentId)
})

watchEffect(() => {
  if (experimentStore.isLoaded(experimentId)) {
    const projectId = experimentStore.experiment.projectId
    if (!projectStore.isLoaded(projectId))
      projectStore.loadProject(projectId)
  }
});

const activeTab = ref('overview')
const charts = computed(() => store.getters['ui/getChartViews']())

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

const createNewPlate = () => {
  newPlate.value.sequence = "1";
  newPlate.value.experimentId = experimentId;
  experimentStore.addPlate(newPlate.value)
  newPlateTab.value = false;
}

const showRenameDialog = ref(false);
const onNameChanged = function(newName) {
    experimentStore.renameExperiment(newName)
};

const showDeleteDialog = ref(false);
const onDeleteExperiment = () => {
    experimentStore.deleteExperiment()
    router.push({name: 'project', params: {id: projectStore.project.id}})
}

const onDescriptionChanged = (newDescription) => {
  experimentStore.editExperimentDescription(newDescription)
}

const resizeChartView = (event) => {
  console.log("resize:" + JSON.stringify(event))
}

const handleCloseExperiment = () => {
  experimentStore.closeExperiment()
}

const handleOpenExperiment = () => {
  experimentStore.openExperiment()
}

const onAddTag = async (newTag) => {
  await experimentStore.addTag(newTag)
}

const onRemoveTag = async (tag) => {
  await experimentStore.deleteTag(tag)
}

const onAddProperty = async (newProperty) => {
  await experimentStore.addPropertty(newProperty)
}

const onRemoveProperty = async (property) => {
  await experimentStore.deleteProperty(property)
}
</script>
