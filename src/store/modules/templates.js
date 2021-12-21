import templateAPI from '@/api/templates.js'

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
        await templateAPI.updatePlateTemplate(args)
            .then(() => {
                ctx.commit('updatePlateTemplate', args)
            })
        //To get all wellTemplates again, fetch plate from database
        await templateAPI.getPlateTemplateById(args.id)
            .then(newPlateTemplate => {
                ctx.commit('cachePlateTemplate', newPlateTemplate)
                ctx.commit('loadPlateTemplate', newPlateTemplate)
            })
    },
    async updateWellTemplates(ctx, args) {
        await templateAPI.editWellTemplates(args)
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
    updateWellTemplates(state, wells) {
        wells.forEach(well => {
            const i = state.currentPlateTemplate.wells.findIndex((obj => obj.id === well.id))
            state.currentPlateTemplate.wells[i] = well
        })
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