import { defineStore } from "pinia"
import templateAPI from  "@/api/templates.js"

export const useTemplateStore = defineStore("template", {
    state: () => ({
        template: {}
    }),
    actions: {
        async loadTemplate(templateId) {
            this.template = await templateAPI.getPlateTemplateById(templateId)
        },
        async creatNewTemplate(newTemplate)  {
          this.template = await templateAPI.createPlateTemplate(newTemplate);
        },
        async saveTemplate()  {
            await templateAPI.editPlateTemplate(this.template)
        },
        async updateTemplateWell(well, property, value) {
            const index = this.template.wells.findIndex((w ) => (w.row === well.row && w.column === well.column))
            this.template.wells[index][property] = value
        },
        async updateTemplateWells(wells, property, value) {
            wells.forEach(w => this.updateTemplateWell(w, property, value))
        }
    }
})
