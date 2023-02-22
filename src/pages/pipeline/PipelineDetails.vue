<template>
    <q-breadcrumbs class="oa-breadcrumb" v-if="pipeline">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el label="Pipelines" icon="route" :to="'/pipelines'"/>
        <q-breadcrumbs-el :label="pipeline.name" icon="route"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <div class="q-pa-md">
            <oa-section-header v-if="!pipeline" title="Loading..." icon="route"/>

            <div v-else>
                <q-expansion-item :label="pipeline.name" icon="route" 
                    expand-icon-class="text-white" header-class="text-h6 oa-section-title" default-opened dense>
                    <div class="row q-pa-md oa-section-body">
                        <div class="col-4 q-gutter-xs">
                            <div class="row">
                                <div class="col-3 text-weight-bold">ID:</div>
                                <div class="col">{{ pipeline.id }}</div>
                            </div>
                            <div class="row">
                                <div class="col-3 text-weight-bold">Name:</div>
                                <div class="col"><EditableField :object="pipeline" fieldName="name" @valueChanged="(val) => onPipelineEdited('name', val)" /></div>
                            </div>
                            <div class="row">
                                <div class="col-3 text-weight-bold">Version:</div>
                                <div class="col">{{ pipeline.versionNumber }}</div>
                            </div>
                            <div class="row">
                                <div class="col-3 text-weight-bold">Description:</div>
                                <div class="col"><EditableField :object="pipeline" fieldName="description" @valueChanged="(val) => onPipelineEdited('description', val)" /></div>
                            </div>
                            <div class="row">
                                <div class="col-3 text-weight-bold">Status:</div>
                                <div class="col text-grey">
                                    <StatusLabel :status="pipeline.status" />
                                    <q-toggle class="on-right" dense v-model="pipelineStatusToggle" @update:model-value="onStatusToggle" />
                                </div>
                            </div>
                        </div>
                        <div class="col-4 q-gutter-xs">
                            <div class="row">
                                <div class="col-3 text-weight-bold">Created On:</div>
                                <div class="col">{{ FormatUtils.formatDate(pipeline.createdOn) }}</div>
                            </div>
                            <div class="row">
                                <div class="col-3 text-weight-bold">Created By:</div>
                                <div class="col"><UserChip :id="pipeline.createdBy" /></div>
                            </div>
                            <div class="row">
                                <div class="col-3 text-weight-bold">Updated On:</div>
                                <div class="col">{{ FormatUtils.formatDate(pipeline.updatedOn) }}</div>
                            </div>
                            <div class="row">
                                <div class="col-3 text-weight-bold">Updated By:</div>
                                <div class="col"><UserChip :id="pipeline.updatedBy" /></div>
                            </div>
                        </div>
                        <div class="col-4 q-gutter-xs">
                            <div class="row justify-end action-button">
                                <q-btn size="sm" color="primary" icon="delete" class="oa-button-delete" label="Delete" @click="showDeleteDialog = true"/>
                            </div>
                        </div>
                    </div>
                </q-expansion-item>

                <q-expansion-item label="Configuration" icon="settings" class="q-mt-md"
                    expand-icon-class="text-white" header-class="text-h6 oa-section-title" default-opened dense>
                    <div class="row oa-section-body">
                        <div class="col-12 q-pa-md">
                            <q-card square class="bg-grey-3">
                                <div class="row q-pa-sm">
                                    <div class="col-11">
                                        <q-input v-model="configWorkingCopy" type="textarea" outlined :readonly="!editMode" input-style="padding-top: 0px;"></q-input>
                                    </div>
                                    <div class="col-1">
                                        <div class="row justify-end">
                                            <q-btn size="sm" color="primary" icon="edit" label="Edit" v-show="!editMode" @click="editMode = true" />
                                            <q-btn size="sm" color="primary" icon="save" label="Save" v-show="editMode" @click="exitEditMode(true)" />
                                            <q-btn size="sm" color="primary" icon="cancel" label="Cancel" v-show="editMode" @click="exitEditMode(false)" class="q-mt-sm" />
                                        </div>
                                    </div>
                                </div>
                            </q-card>
                        </div>
                    </div>
                </q-expansion-item>
            </div>
        </div>
    </q-page>

    <delete-dialog v-model:id="pipeline.id" v-model:name="pipeline.name" v-model:show="showDeleteDialog" objectClass="pipeline" @onDeleted="confirmDelete" />
    <confirm-dialog title="Change pipeline status" message="Are you sure you want to change the status of this pipeline?" v-model:show="showStatusDialog" @onConfirm="confirmStatusChange" />
</template>

<script setup>
    import {computed, ref, watch} from "vue";
    import {useStore} from "vuex";
    import {useRoute, useRouter} from 'vue-router';
    import FormatUtils from "@/lib/FormatUtils.js";
    import UserChip from "@/components/widgets/UserChip";
    import StatusLabel from "@/components/widgets/StatusLabel";
    import OaSectionHeader from "@/components/widgets/OaSectionHeader";
    import DeleteDialog from "@/components/widgets/DeleteDialog";
    import ConfirmDialog from "@/components/widgets/ConfirmDialog";
    import EditableField from "@/components/widgets/EditableField";

    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const pipelineId = parseInt(route.params.id);

    const pipeline = computed(() => store.getters['pipelines/getPipelineById'](pipelineId));
    store.dispatch('pipelines/loadPipelineById', pipelineId);

    const pipelineStatusToggle = ref(false);
    const showStatusDialog = ref(false);
    watch(pipeline, () => {
        pipelineStatusToggle.value = pipeline.value.status == 'ENABLED';
    });
    const onStatusToggle = (v) => {
        pipelineStatusToggle.value = !v;
        showStatusDialog.value = true;
    }
    const confirmStatusChange = () => {
        let newStatus = !pipelineStatusToggle.value;
        onPipelineEdited('status', newStatus ? 'ENABLED' : 'DISABLED');
    };

    const editMode = ref(false);
    const configWorkingCopy = ref("");
    watch(pipeline, () => {
        configWorkingCopy.value = FormatUtils.formatJSON(pipeline.value.config);
    });
    const exitEditMode = (saveChanges) => {
        editMode.value = false;
        if (saveChanges) {
            let newConfig = JSON.parse(configWorkingCopy.value);
            onPipelineEdited('config', newConfig);
        } else {
            configWorkingCopy.value = FormatUtils.formatJSON(pipeline.value.config);
        }
    };

    const onPipelineEdited = (fieldName, newValue) => {
        let pipelineWorkingCopy = {...pipeline.value};
        pipelineWorkingCopy[fieldName] = newValue;
        store.dispatch('pipelines/updatePipeline', pipelineWorkingCopy);
    };

    const showDeleteDialog = ref(false);
    const confirmDelete = () => {
        store.dispatch('pipelines/deletePipeline', pipelineId);
        router.push({name: 'browsePipelines'})
    }
</script>