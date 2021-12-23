import templateAPI from '@/api/templates.js'
import WellUtils from "../../lib/WellUtils";

const state = () => ({
    currentPlateTemplate: {},
    plateTemplates: []
})

const getters = {
    getById: (state) => (id) => {
        return state.plateTemplates.find(plateTemplate => plateTemplate.id === id)
    },
    isLoaded: (state) => (id) => {
        return state.plateTemplates.find(plateTemplate => plateTemplate.id === id) != null;
    },
    getCurrentPlateTemplate: (state) => () => {
        return state.currentPlateTemplate;
    },
    getAll: (state) => () => {
        return state.plateTemplates;
    }
}

const actions = {
    async loadById(ctx, plateTemplateId) {
        let plateTemplate = ctx.getters.getById(plateTemplateId)
        if (plateTemplate) {
            ctx.commit('loadPlateTemplate', plateTemplate)
        } else {
            try {
                plateTemplate = await templateAPI.getPlateTemplateById(plateTemplateId)
                console.log('Load plateTemplate by id');
                ctx.commit('loadPlateTemplate', plateTemplate)
            } catch (err) {
                console.error(err)
            }
        }

        //TODO add properties and tags load
    },
    async loadAll(ctx) {
        await templateAPI.getAllPlateTemplates()
            .then(response => {
                ctx.commit('cacheAllPlateTemplates', response)
            })
    },
    async createNewPlateTemplate(ctx, newPlateTemplate) {
        await templateAPI.createPlateTemplate(newPlateTemplate)
            .then((response) => {
                ctx.commit('cachePlateTemplate', response)
            })
    },
    async deletePlateTemplate(ctx, id) {
        await templateAPI.deletePlateTemplate(id)
            .then(() => {
                ctx.commit('uncachePlateTemplate', id)
            })
    },
    async updatePlateTemplate(ctx, args) {
        await templateAPI.editPlateTemplate(args)
        ctx.commit('updatePlateTemplate',args)
    },
    async updateWellTemplates(ctx, args) {
        //await templateAPI.editWellTemplates(args)
        ctx.commit('updateWellTemplates',args)
    }
}

const mutations = {
    loadPlateTemplate(state, plateTemplate) {
        if (state.currentPlateTemplate && state.currentPlateTemplate.id !== plateTemplate.id)
            state.currentPlateTemplate = plateTemplate;
    },
    cachePlateTemplate(state, plateTemplate) {
        if (!containsPlateTemplate(state, plateTemplate)) {
            state.plateTemplates.push(plateTemplate)
        }
    },
    uncachePlateTemplate(state, plateTemplateId) {
        let match = state.plateTemplates.find(p => p.id === plateTemplateId)
        if (match) state.plateTemplates.splice(state.plateTemplates.indexOf(match), 1)
    },
    cacheAllPlateTemplates(state, plateTemplates) {
        plateTemplates?.forEach(plateTemplate => {
            if (!containsPlateTemplate(plateTemplate))
                state.plateTemplates.push(plateTemplate)
        })
    },
    deletePlateTemplate(state, plateTemplate){
        state.plateTemplates = state.plateTemplates.filter(plate => plate.id !== plateTemplate.id)
    },
    updatePlateTemplate(state, template) {
        //Update plateTemplates list
        const i = state.plateTemplates.findIndex((obj => obj.id === template.id))
        state.plateTemplates[i].name = template.name
        state.plateTemplates[i].description = template.description
        //Update current currentPlateTemplate
        state.currentPlateTemplate.name = template.name
        state.currentPlateTemplate.description = template.description
    },
    updateWellTemplates(state, wells) {
        var date1 = new Date()
        wells.forEach(well => {
            //const i = state.currentPlateTemplate.wells.findIndex((obj => obj.id === well.id))
            const i = WellUtils.getWellNr(well.row,well.column,state.currentPlateTemplate.columns)-1
            state.currentPlateTemplate.wells[i].skipped = well.skipped
            state.currentPlateTemplate.wells[i].wellType = well.wellType
            state.currentPlateTemplate.wells[i].substanceName = well.substanceName
            state.currentPlateTemplate.wells[i].substanceType = well.substanceType
            state.currentPlateTemplate.wells[i].concentration = well.concentration
        })
        console.log(date1-new Date())
    }
}

function containsPlateTemplate(state, plateTemplate) {
    return state.plateTemplates !== undefined
        && state.plateTemplates.findIndex(t => t.id === plateTemplate.id) > -1;
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}