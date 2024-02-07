<template>
    <q-breadcrumbs class="oa-breadcrumb">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el label="Capture Scripts" icon="data_object" to="/datacapture/scripts" />
        <q-breadcrumbs-el :label="script.name" icon="data_object"/>
    </q-breadcrumbs>
    
    <q-page class="oa-root-div">
        <div class="q-pa-sm">
            <oa-section :title="script.name" icon="data_object" :collapsible="true">
                <div class="q-pa-md">
                    <div class="row q-col-gutter-md">
                        <div class="col-4">
                            <q-input v-model="script.name" label="Name" :readonly="!editMode" stack-label dense :borderless="!editMode"></q-input>
                            <q-input v-model="script.description" label="Description" :readonly="!editMode" stack-label dense :borderless="!editMode"></q-input>
                        </div>
                        <div class="col-3">
                            <q-input v-model="script.id" label="ID" readonly dense borderless></q-input>
                            <q-input v-model="script.version" label="Version" stack-label dense borderless></q-input>
                        </div>
                        <div class="col-2">
                            <q-field label="Created On" stack-label dense borderless>
                                <template v-slot:control>
                                    {{ FormatUtils.formatDate(script.createdOn) }}
                                </template>
                            </q-field>
                            <q-field label="Created By" stack-label dense borderless>
                                <template v-slot:control>
                                    <div class="q-pt-xs">
                                        <UserChip :id="script.createdBy"/>
                                    </div>
                                </template>
                            </q-field>
                        </div>
                        <div class="col-2">
                            <q-field label="Updated On" stack-label dense borderless>
                                <template v-slot:control>
                                    {{ FormatUtils.formatDate(script.updatedOn) }}
                                </template>
                            </q-field>
                            <q-field label="Updated By" stack-label dense borderless>
                                <template v-slot:control>
                                    <div class="q-pt-xs">
                                        <UserChip :id="script.updatedBy"/>
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
            <oa-section title="Code" class="q-pt-sm" :collapsible="true">
                <div class="q-pa-md">
                    <codemirror
                        :disabled="!editMode"
                        :extensions="editorConfig.extensions"
                        v-model="script.value"
                    />
                </div>
            </oa-section>
        </div>
    </q-page>
    
    <delete-dialog v-model:id="script.id" v-model:name="script.name" v-model:show="showDeleteDialog" objectClass="script" @onDeleted="confirmDelete" />
</template>

<script setup>
    import {ref} from 'vue'
    import {useStore} from "vuex";
    import {useRoute, useRouter} from 'vue-router';
    import { Codemirror } from 'vue-codemirror';
    import { javascript } from '@codemirror/lang-javascript';
    import FormatUtils from "@/lib/FormatUtils.js"
    import OaSection from "@/components/widgets/OaSection";
    import UserChip from "@/components/widgets/UserChip";
    import DeleteDialog from "@/components/widgets/DeleteDialog";

    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const scriptId = parseInt(route.params.id);
    const blankScript = {
        name: 'New Script',
        value: '// Enter script code here'
    };
    const script = ref(blankScript);
    const getWorkingCopy = () => {
        let originalScript = store.getters['datacapture/getCaptureScriptById'](scriptId) || blankScript;
        // Return a shallow copy of the script for editing
        script.value = {...originalScript};
    }

    const isNewScript = (route.params.id == 'new');
    if (!isNewScript) {
        store.dispatch('datacapture/loadCaptureScriptById', scriptId).then(getWorkingCopy);
    }
    
    const editMode = ref(isNewScript);
    const exitEditMode = async (saveChanges) => {
        editMode.value = false;
        if (saveChanges) {
            if (isNewScript) {
                let newScript = await store.dispatch('datacapture/createCaptureScript', script.value);
                router.push(`/datacapture/script/${newScript.id}`);
            } else {
                await store.dispatch('datacapture/updateCaptureScript', script.value);
                getWorkingCopy();
            }
        } else {
            if (isNewScript) router.push("/datacapture/scripts");
            else getWorkingCopy();
        }
    };

    const editorConfig = {
        extensions: [javascript()]
    };

    const showDeleteDialog = ref(false);
    const confirmDelete = async () => {
        await store.dispatch('datacapture/deleteCaptureScript', scriptId);
        router.push("/datacapture/scripts");
    }
</script>