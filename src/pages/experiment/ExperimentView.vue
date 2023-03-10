<template>
    <q-breadcrumbs class="oa-breadcrumb" v-if="experiment && project">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el :label="'Projects'" icon="list" :to="'/projects'"/>
        <q-breadcrumbs-el :label="project.name" icon="folder" :to="{ name: 'project', params: { id: experiment.projectId } }"/>
        <q-breadcrumbs-el :label="experiment.name" icon="science"/>
    </q-breadcrumbs>
    
    <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
        <div class="q-pa-md">
            <oa-section v-if="!experiment" title="Loading experiment..." icon="science" />
            <oa-section v-else :title="experiment.name" icon="science" :collapsible="true">
                <div class="row q-pa-md">
                    <div class="col-3">
                        <q-field label="ID" stack-label dense borderless>
                            <template v-slot:control>
                                {{ experiment.id }}
                            </template>
                        </q-field>
                        <q-field label="Description" stack-label dense borderless>
                            <template v-slot:control>
                                <EditableField :object="experiment" fieldName="description" @valueChanged="onDescriptionChanged" />
                            </template>
                        </q-field>
                        <q-field label="Tags" stack-label dense borderless>
                            <template v-slot:control>
                                <TagList :objectInfo="experiment" :objectClass="'EXPERIMENT'" />
                            </template>
                        </q-field>
                    </div>
                    
                    <div class="col-3">
                        <q-field label="Created On" stack-label dense borderless>
                            <template v-slot:control>
                                {{ FormatUtils.formatDate(experiment.createdOn) }}
                            </template>
                        </q-field>
                        <q-field label="Created By" stack-label dense borderless>
                            <template v-slot:control>
                                <UserChip :id="experiment.createdBy"/>
                            </template>
                        </q-field>
                    </div>

                    <div class="col-4">
                        <PropertyTable :objectInfo="experiment" :objectClass="'EXPERIMENT'"/>
                    </div>
                    
                    <div class="col-2">
                        <div class="row justify-end">
                            <q-btn size="sm" icon="edit" label="Rename" class="oa-action-button" @click="showRenameDialog = true"/>
                        </div>
                        <div class="row justify-end">
                            <q-btn size="sm" icon="delete" class="oa-action-button" label="Delete" @click="showDeleteDialog = true"/>
                        </div>
                    </div>
                </div>
            </oa-section>
        </div>
        
        <div class="q-pa-md" v-if="experiment">
            <q-tabs v-model="activeTab" inline-label dense no-caps align="left" class="oa-section-title">
                <q-tab name="overview" icon="table_rows" label="Overview"/>
                <q-tab name="statistics" icon="functions" label="Statistics"/>
                <q-tab name="heatmaps" icon="view_module" label="Heatmaps"/>
            </q-tabs>
            <div class="row oa-section-body">
                <q-tab-panels v-model="activeTab" animated class="full-width">
                    <q-tab-panel name="overview" class="q-px-none">
                        <PlateList :experiment="experiment" v-model:newPlateTab="newPlateTab" />
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
        
        <rename-dialog v-model:show="showRenameDialog" objectClass="experiment" :object="experiment" @valueChanged="onNameChanged" />
        <delete-dialog v-model:show="showDeleteDialog" :id="experiment.id" :name="experiment.name" :objectClass="'experiment'" @onDeleted="onDeleted" />
    </q-page>
</template>

<script setup>
import {ref, computed} from 'vue'
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

const store = useStore();
const route = useRoute();
const router = useRouter();

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

const experiment = computed(() => store.getters['experiments/getById'](experimentId) || {});
const project = computed(() => store.getters['projects/getById'](projectId.value));

store.dispatch('experiments/loadById', experimentId).then(() => {
    projectId.value = experiment.value.projectId;
    store.dispatch('projects/loadById', projectId.value);
})

const createNewPlate = () => {
    newPlate.value.sequence = "1";
    newPlate.value.experimentId = experimentId;
    store.dispatch('plates/createNewPlate', newPlate.value);
    newPlateTab.value = false;
}

const showRenameDialog = ref(false);
const onNameChanged = function(newName) {
    store.dispatch('experiments/editExperiment', { id: experimentId, name: newName });
};

const showDeleteDialog = ref(false);
const onDeleted = () => {
    router.push({name: 'project', params: {id: project.value.id}})
}

const onDescriptionChanged = (newDescription) => {
    store.dispatch('experiments/editExperiment', { id: experiment.value.id, description: newDescription });
};
</script>
            