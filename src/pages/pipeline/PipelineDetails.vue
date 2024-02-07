<template>
    <q-breadcrumbs class="oa-breadcrumb" v-if="pipeline">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el label="Pipelines" icon="list" :to="'/pipelines'"/>
        <q-breadcrumbs-el :label="pipeline.name" icon="route"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <div class="q-pa-sm">
            <oa-section v-if="!pipeline" title="Loading..." icon="route"/>
            <oa-section v-else :title="pipeline.name" icon="route" :collapsible="true">
                <div class="row q-pa-md">
                    <div class="col-4">
                        <q-field label="ID" stack-label dense borderless>
                            <template v-slot:control>
                                {{ pipeline.id }}
                            </template>
                        </q-field>
                        <q-field label="Description" stack-label dense borderless>
                            <template v-slot:control>
                                <EditableField :object="pipeline" fieldName="description" @valueChanged="(val) => onPipelineEdited('description', val)" />
                            </template>
                        </q-field>
                        <q-field label="Version" stack-label dense borderless>
                            <template v-slot:control>
                                {{ pipeline.versionNumber }}
                            </template>
                        </q-field>
                        <q-field label="Status" stack-label dense borderless>
                            <template v-slot:control>
                                <StatusLabel :status="pipeline.status" />
                                <q-toggle class="on-right" dense v-model="pipelineStatusToggle" @update:model-value="onStatusToggle" />
                            </template>
                        </q-field>
                    </div>
                    <div class="col-4">
                        <q-field label="Created On" stack-label dense borderless>
                            <template v-slot:control>
                                {{ FormatUtils.formatDate(pipeline.createdOn) }}
                            </template>
                        </q-field>
                        <q-field label="Created By" stack-label dense borderless>
                            <template v-slot:control>
                                <div class="q-pt-xs">
                                    <UserChip :id="pipeline.createdBy"/>
                                </div>
                            </template>
                        </q-field>
                        <q-field label="Updated On" stack-label dense borderless>
                            <template v-slot:control>
                                {{ FormatUtils.formatDate(pipeline.updatedOn) }}
                            </template>
                        </q-field>
                        <q-field label="Updated By" stack-label dense borderless>
                            <template v-slot:control>
                                <div class="q-pt-xs">
                                    <UserChip :id="pipeline.updatedBy"/>
                                </div>
                            </template>
                        </q-field>
                    </div>
                    <div class="col-4 q-gutter-xs">
                        <div class="row justify-end action-button">
                            <q-btn size="sm" color="primary" icon="delete" class="oa-button-delete" label="Delete" @click="showDeleteDialog = true"/>
                        </div>
                    </div>
                </div>
            </oa-section>

            <oa-section title="Configuration" icon="settings" :collapsible="true" class="q-pt-sm">
                <div class="row oa-section-body">
                    <div class="col-12 q-pa-md">
                        <div class="row">
                            <div class="col-11">
                                <codemirror
                                    :disabled="!editMode"
                                    :extensions="editorConfig.extensions"
                                    v-model="configWorkingCopy"
                                />
                            </div>
                            <div class="col-1">
                                <div class="row justify-end">
                                    <q-btn size="sm" color="primary" icon="edit" label="Edit" v-show="!editMode" @click="editMode = true" />
                                    <q-btn size="sm" color="primary" icon="save" label="Save" v-show="editMode" @click="exitEditMode(true)" />
                                    <q-btn size="sm" color="primary" icon="cancel" label="Cancel" v-show="editMode" @click="exitEditMode(false)" class="q-mt-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </oa-section>
        </div>
    </q-page>

    <delete-dialog v-model:id="pipeline.id" v-model:name="pipeline.name" v-model:show="showDeleteDialog" objectClass="pipeline" @onDeleted="confirmDelete" />
    <confirm-dialog title="Change pipeline status" message="Are you sure you want to change the status of this pipeline?" v-model:show="showStatusDialog" @onConfirm="confirmStatusChange" />
</template>

<script setup>
    import {computed, ref, watch} from "vue";
    import {useStore} from "vuex";
    import {useRoute, useRouter} from 'vue-router';
    import { Codemirror } from 'vue-codemirror';
    import { json } from '@codemirror/lang-json';
    import FormatUtils from "@/lib/FormatUtils.js";
    import UserChip from "@/components/widgets/UserChip";
    import StatusLabel from "@/components/widgets/StatusLabel";
    import OaSection from "@/components/widgets/OaSection";
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

    const editorConfig = {
        extensions: [json()]
    };

    const showDeleteDialog = ref(false);
    const confirmDelete = () => {
        store.dispatch('pipelines/deletePipeline', pipelineId);
        router.push({name: 'browsePipelines'})
    }
</script>