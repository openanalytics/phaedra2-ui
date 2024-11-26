import { defineStore } from "pinia"
import templateAPI from  "@/api/templates.js"
import templatesGraphQlAPI from '@/api/graphql/templates'
import {addTag, deleteTag, addProperty, deleteProperty} from "@/lib/MetadataUtils";

export const useTemplateStore = defineStore("template", {
    state: () => ({
        template: null,
        updated: false
    }),
    getters: {
        isUpdated: (state) => {
            return state.updated
        }
    },
    actions: {
        async loadTemplate(templateId) {
            const data = await templatesGraphQlAPI.templateById(templateId)
            this.template = data.plateTemplate
        },
        async reloadTemplate() {
            const data = await templatesGraphQlAPI.templateById(this.template.id)
            this.template = data.plateTemplate
        },
        async saveTemplate()  {
            await templateAPI.editPlateTemplate(this.template)
            await this.reloadTemplate()
            this.updated = false
        },
        async renameTemplate(newTemplateName) {
            this.template.name = newTemplateName
            await this.saveTemplate()
        },
        async deleteTemplate() {
            await templateAPI.deletePlateTemplate(this.template?.id)
            this.reset()
        },
        async editTemplateDescription(newDescription) {
            this.template.description = newDescription
            await this.saveTemplate()
        },
        async updateTemplateWell(well, property, value) {
            const index = this.template.wells.findIndex((w ) => (w.row === well.row && w.column === well.column))
            this.template.wells[index][property] = value
            this.updated = true
        },
        async updateTemplateWells(wells, property, value) {
            wells.forEach(w => this.updateTemplateWell(w, property, value))
        },
        async handleAddTag(newTag) {
            await addTag(this.template.id, 'PLATE_TEMPLATE', newTag, this.reloadTemplate)
        },
        async handleDeleteTag(tag) {
            await deleteTag(this.template.id, 'PLATE_TEMPLATE', tag, this.reloadTemplate)
        },
        async handleAddProperty(newProperty) {
            await addProperty(this.template.id,'PLATE_TEMPLATE', newProperty, this.reloadTemplate)
        },
        async handleDeleteProperty(property) {
            await deleteProperty(this.template.id,'PLATE_TEMPLATE', property, this.reloadTemplate)
        },
        reset() {
            this.template = {}
            this.updated = false
        },
    }
})
