import { defineStore } from "pinia"
import templateAPI from  "@/api/templates.js"
import templatesGraphQlAPI from '@/api/graphql/templates'
import metadataAPI from "@/api/metadata";

export const useTemplateStore = defineStore("template", {
    state: () => ({
        template: {}
    }),
    actions: {
        loadTemplate(templateId) {
            const {onResult, onError} = templatesGraphQlAPI.templateById(templateId)
            onResult(({data}) => {
                this.template = data.plateTemplate
            })
        },
        async creatNewTemplate(newTemplate)  {
          this.template = await templateAPI.createPlateTemplate(newTemplate);
        },
        async saveTemplate()  {
            await templateAPI.editPlateTemplate(this.template)
            this.loadTemplate(this.template.id)
        },
        async renameTemplate(newTemplateName) {
            await templateAPI.editPlateTemplate({ id: this.template.id, name: newTemplateName })
            this.loadTemplate(this.template.id)
        },
        async editTemplateDescription(newDescription) {
            await templateAPI.editPlateTemplate({id: this.template.id, description: newDescription})
            this.loadTemplate(this.template.id)
        },
        async updateTemplateWell(well, property, value) {
            const index = this.template.wells.findIndex((w ) => (w.row === well.row && w.column === well.column))
            this.template.wells[index][property] = value
        },
        async updateTemplateWells(wells, property, value) {
            wells.forEach(w => this.updateTemplateWell(w, property, value))
        },
        async addTag(newTag) {
            await metadataAPI.addTag({'objectId': this.template.id, 'objectClass': 'PLATE_TEMPLATE', 'tag': newTag})
            await this.loadTemplate(this.template.id)
        },
        async deleteTag(tag) {
            await metadataAPI.removeTag({'objectId': this.template.id, 'objectClass': 'PLATE_TEMPLATE', 'tag': tag })
            await this.loadTemplate(this.template.id)
        },
        async addPropertty(newProperty) {
            await metadataAPI.addProperty({
                objectId: this.template.id,
                objectClass: 'PLATE_TEMPLATE',
                propertyName: newProperty.name,
                propertyValue: newProperty.value
            })
            await this.loadTemplate(this.template.id)
        },
        async deleteProperty(property) {
            await metadataAPI.removeProperty({
                objectId: this.template.id,
                objectClass: 'PLATE_TEMPLATE',
                propertyName: property.propertyName
            })
            await this.loadTemplate(this.template.id)
        }
    }
})
