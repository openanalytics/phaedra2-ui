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
        async saveTemplate() {
            await templateAPI.editPlateTemplate(this.template)
            if (this.template.wells)
                await templateAPI.editWellTemplates(this.template.wells)
            // await this.loadTemplate(this.template.id)
        },
        async updateTemplateWell(well, property, value) {
            const index = this.template.wells.findIndex((w ) => (w.row === well.row && w.column === well.column))
            this.template.wells[index][property] = value
        },
        async updateTemplateWells(wells, property, value) {
            for (let w in wells)
                this.updateTemplateWell(wells[w], property, value)
        }
    }
})
