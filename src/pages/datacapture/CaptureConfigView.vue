<template>
    <q-breadcrumbs class="oa-breadcrumb">
        <q-breadcrumbs-el icon="home" :to="{ name: 'workbench'}"/>
        <q-breadcrumbs-el label="Capture Configurations" icon="settings" to="/datacapture/configs" />
        <q-breadcrumbs-el :label="config.name" icon="settings"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <div class="q-pa-sm">
            <oa-section :title="config.name" icon="settings" :collapsible="true">
                <div class="q-pa-md">
                    <div class="row q-col-gutter-md">
                        <div class="col-4">
                            <q-input v-model="config.name" label="Name" :readonly="!editMode" stack-label dense :borderless="!editMode"></q-input>
                            <q-input v-model="config.description" label="Description" :readonly="!editMode" stack-label dense :borderless="!editMode"></q-input>
                        </div>
                        <div class="col-3">
                            <q-input v-model="config.id" label="ID" readonly dense borderless></q-input>
                            <q-input v-model="config.version" label="Version" stack-label dense borderless></q-input>
                        </div>
                        <div class="col-2">
                            <q-field label="Created On" stack-label dense borderless>
                                <template v-slot:control>
                                    {{ FormatUtils.formatDate(config.createdOn) }}
                                </template>
                            </q-field>
                            <q-field label="Created By" stack-label dense borderless>
                                <template v-slot:control>
                                    <div class="q-pt-xs">
                                        <UserChip :id="config.createdBy"/>
                                    </div>
                                </template>
                            </q-field>
                        </div>
                        <div class="col-2">
                            <q-field label="Updated On" stack-label dense borderless>
                                <template v-slot:control>
                                    {{ FormatUtils.formatDate(config.updatedOn) }}
                                </template>
                            </q-field>
                            <q-field label="Updated By" stack-label dense borderless>
                                <template v-slot:control>
                                    <div class="q-pt-xs">
                                        <UserChip :id="config.updatedBy"/>
                                    </div>
                                </template>
                            </q-field>
                        </div>
                        <div class="col-1">
                            <div class="row justify-end">
                                <q-btn size="sm" color="primary" icon="edit" label="Edit" v-show="!editMode" @click="editMode = true" />
                                <q-btn size="sm" color="primary" icon="save" label="Save" v-show="editMode" @click="exitEditMode(true)" />
                                <q-btn size="sm" color="primary" icon="cancel" label="Cancel" v-show="editMode" @click="exitEditMode(false)" class="q-mt-sm" />
                                <q-btn size="sm" color="primary" icon="delete" label="Delete" v-show="!editMode" @click="showDeleteDialog = true" class="oa-button-delete q-mt-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </oa-section>
            <oa-section title="Configuration" class="q-pt-sm" :collapsible="true">
                <div class="q-pa-md">
                    <codemirror
                        :disabled="!editMode"
                        :extensions="editorConfig.extensions"
                        v-model="config.value"
                    />
                </div>
            </oa-section>
        </div>
    </q-page>

    <delete-dialog v-model:id="config.id" v-model:name="config.name" v-model:show="showDeleteDialog" objectClass="config" @onDeleted="confirmDelete" />
</template>

<script setup>
    import {ref} from 'vue'
    import {useStore} from "vuex";
    import {useRoute, useRouter} from 'vue-router';
    import { Codemirror } from 'vue-codemirror';
    import { json } from '@codemirror/lang-json';
    import FormatUtils from "@/lib/FormatUtils.js"
    import OaSection from "@/components/widgets/OaSection";
    import UserChip from "@/components/widgets/UserChip";
    import DeleteDialog from "@/components/widgets/DeleteDialog";

    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const configId = parseInt(route.params.id);
    const blankConfig = {
        name: 'New Configuration',
        value: '{}'
    };
    const config = ref(blankConfig);
    const getWorkingCopy = () => {
        let originalConfig = store.getters['datacapture/getCaptureConfigById'](configId) || blankConfig;
        // Return a shallow copy of the config for editing
        config.value = {...originalConfig};
    }

    const isNewConfig = (route.params.id == 'new');
    if (!isNewConfig) {
        store.dispatch('datacapture/loadCaptureConfigById', configId).then(getWorkingCopy);
    }

    const editMode = ref(isNewConfig);
    const exitEditMode = async (saveChanges) => {
        editMode.value = false;
        if (saveChanges) {
            if (isNewConfig) {
                let newConfig = await store.dispatch('datacapture/createCaptureConfig', config.value);
                router.push(`/datacapture/config/${newConfig.id}`);
            } else {
                await store.dispatch('datacapture/updateCaptureConfig', config.value);
                getWorkingCopy();
            }
        } else {
            if (isNewConfig) router.push("/datacapture/configs");
            else getWorkingCopy();
        }
    };

    const editorConfig = {
        extensions: [json()]
    };

    const showDeleteDialog = ref(false);
    const confirmDelete = async () => {
        await store.dispatch('datacapture/deleteCaptureConfig', configId);
        router.push("/datacapture/configs");
    }
</script>
