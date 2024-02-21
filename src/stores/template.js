import { defineStore } from "pinia"
import templateAPI from  "@/api/templates.js"
import templatesGraphQlAPI from '@/api/graphql/templates'
import metadataAPI from "@/api/metadata";
import projectsGraphQlAPI from "@/api/graphql/projects";

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
        loadTemplate(templateId) {
            const {onResult, onError} = templatesGraphQlAPI.templateById(templateId)
            onResult(({data}) => {
                this.template = data.plateTemplate
            })
        },
        async reloadTemplate() {
            const {onResult, onError} = templatesGraphQlAPI.templateById(this.template.id)
            onResult(({data}) => {
                this.template = data.plateTemplate
            })
        },
        async saveTemplate()  {
            await templateAPI.editPlateTemplate(this.template)
            await this.reloadTemplate()
            this.updated = false
        },
        async renameTemplate(newTemplateName) {
            await templateAPI.editPlateTemplate({id: this.template.id, name: newTemplateName})
            await this.reloadTemplate()
        },
        async editTemplateDescription(newDescription) {
            await templateAPI.editPlateTemplate({id: this.template.id, description: newDescription})
            await this.reloadTemplate()
        },
        async updateTemplateWell(well, property, value) {
            const index = this.template.wells.findIndex((w ) => (w.row === well.row && w.column === well.column))
            this.template.wells[index][property] = value
            this.updated = true
        },
        async updateTemplateWells(wells, property, value) {
            wells.forEach(w => this.updateTemplateWell(w, property, value))
        },
        async addTag(newTag) {
            await metadataAPI.addTag({'objectId': this.template.id, 'objectClass': 'PLATE_TEMPLATE', 'tag': newTag})
            await this.reloadTemplate()
        },
        async deleteTag(tag) {
            await metadataAPI.removeTag({'objectId': this.template.id, 'objectClass': 'PLATE_TEMPLATE', 'tag': tag })
            await this.reloadTemplate()
        },
        async addPropertty(newProperty) {
            await metadataAPI.addProperty({
                objectId: this.template.id,
                objectClass: 'PLATE_TEMPLATE',
                propertyName: newProperty.name,
                propertyValue: newProperty.value
            })
            await this.reloadTemplate()
        },
        async deleteProperty(property) {
            await metadataAPI.removeProperty({
                objectId: this.template.id,
                objectClass: 'PLATE_TEMPLATE',
                propertyName: property.propertyName
            })
            await this.reloadTemplate()
        }
    }
})
