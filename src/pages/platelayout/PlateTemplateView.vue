<template>
    <q-breadcrumbs class="oa-breadcrumb" v-if="template">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el :label="'Templates'" icon="list" :to="'/templates'"/>
        <q-breadcrumbs-el :label="template.name" icon="border_outer"/>
    </q-breadcrumbs>
    
    <q-page class="oa-root-div">
        <div class="q-pa-md" v-if="!editdialog">
            <oa-section v-if="!template" title="Loading template..." icon="border_outer" />
            <oa-section v-else :title="template.name" icon="border_outer" :collapsible="true">
                <div class="row q-pa-md">
                    <div class="col-3">
                        <q-field label="ID" stack-label borderless dense>
                            <template v-slot:control>
                                {{ template.id }}
                            </template>
                        </q-field>
                        <q-field label="Dimensions" stack-label borderless dense>
                            <template v-slot:control>
                                {{ template.rows }} x {{ template.columns }} ({{ template.rows * template.columns }} wells)
                            </template>
                        </q-field>
                        <q-field label="Description" stack-label borderless dense>
                            <template v-slot:control>
                                {{ template.description }}
                            </template>
                        </q-field>
                        <q-field label="Tags" stack-label borderless dense>
                            <template v-slot:control>
                                <TagList :objectInfo="templateStore.template" :objectClass="'PLATE_TEMPLATE'" />
                            </template>
                        </q-field>
                    </div>

                    <div class="col-3">
                        <q-field label="Created On" stack-label dense borderless>
                            <template v-slot:control>
                                {{ FormatUtils.formatDate(template.createdOn) }}
                            </template>
                        </q-field>
                        <q-field label="Created By" stack-label dense borderless>
                            <template v-slot:control>
                                <UserChip :id="template.createdBy" />
                            </template>
                        </q-field>
                        <q-field label="Updated On" stack-label dense borderless>
                            <template v-slot:control>
                                {{ FormatUtils.formatDate(template.updatedOn) }}
                            </template>
                        </q-field>
                        <q-field label="Updated By" stack-label dense borderless>
                            <template v-slot:control>
                                <UserChip :id="template.updatedBy" />
                            </template>
                        </q-field>
                    </div>

                    <div class="col-4">
                        <PropertyTable :objectInfo="templateStore.template" :objectClass="'PLATE_TEMPLATE'" :read-only="true"/>
                    </div>
                                            
                    <div class="col-2">
                        <div class="row justify-end action-button">
                            <q-btn size="sm" icon="save" class="oa-action-button" label="Save"
                            @click="savePlateTemplate"/>
                        </div>
                        <div class="row justify-end action-button">
                            <q-btn size="sm" icon="edit" class="oa-action-button" label="Edit"
                            @click="editdialog = true"/>
                        </div>
                        <div class="row justify-end action-button">
                            <q-btn size="sm" icon="delete" class="oa-action-button" label="Delete"
                            @click="openDeleteDialog"/>
                        </div>
                    </div>
                </div>
            </oa-section>
        </div>

        <edit-plate-template v-model:show="editdialog"></edit-plate-template>

        <div class="q-pa-md" v-if="template">
            <q-tabs inline-label dense no-caps align="left" class="oa-section-title" v-model="activeTab">
                <q-tab name="overview" icon="view_module" label="Overview"/>
                <q-tab name="well-type" icon="text_snippet" label="Well Type"/>
                <q-tab name="substance" icon="view_module" label="Substance"/>
            </q-tabs>
            <div class="row oa-section-body">
                <q-tab-panels v-model="activeTab" animated style="width: 100%">
                    <q-tab-panel name="overview" icon="view_module" label="Overview">
                        <PlateTemplateLayout :plate="template" :tab="'overview'"></PlateTemplateLayout>
                    </q-tab-panel>
                    <q-tab-panel name="well-type" icon="view_module" label="Well Type">
                        <PlateTemplateLayout :plate="template" :tab="'well-type'"></PlateTemplateLayout>
                    </q-tab-panel>
                    <q-tab-panel name="substance" icon="view_module" label="Substance">
                        <PlateTemplateLayout :plate="template" :tab="'substance'"></PlateTemplateLayout>
                    </q-tab-panel>
                </q-tab-panels>
            </div>
        </div>
        
        <delete-dialog v-if="template" ref="deleteDialog" v-model:id="template.id"
            v-model:name="template.name" v-model:show="showDeleteDialog" :objectClass="'template'" @onDeleted="onDeleted"/>
    </q-page>
</template>

<script setup>
import {computed, ref} from "vue"
import {useTemplateStore} from "@/stores/template";
import {useRoute, useRouter} from "vue-router";

import FormatUtils from "@/lib/FormatUtils.js";

import TagList from "@/components/tag/TagList";
import PropertyTable from "@/components/property/PropertyTable";
import PlateTemplateLayout from "./PlateTemplateLayout";
import EditPlateTemplate from "./EditPlateTemplate";
import OaSection from "@/components/widgets/OaSection";
import DeleteDialog from "@/components/widgets/DeleteDialog";
import UserChip from "@/components/widgets/UserChip";

const route = useRoute()
const router = useRouter()
const templateStore = useTemplateStore()

const activeTab = ref('overview')
const editdialog = ref(false)
const showDeleteDialog = ref(false)

const templateId = parseInt(route.params.id);
templateStore.loadTemplate(templateId)

const template = computed( () => {
    return templateStore.template
})

const savePlateTemplate = () => {
    templateStore.saveTemplate()
}

const onDeleted = () => {
    router.push({name: 'dashboard'})
}

const openDeleteDialog = () => {
    showDeleteDialog.value = true
}
</script>
                