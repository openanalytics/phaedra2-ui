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
    },
    getPlateTemplatesByPlateDimensions: (state) => (plate) => {
        if (plate)
            return state.plateTemplates.filter(pt => pt.rows === plate.rows && pt.columns === plate.columns)
        else
            return state.plateTemplates;
    }
}

const actions = {
    // async loadById(ctx, plateTemplateId) {
    //     let plateTemplate = ctx.getters.getById(plateTemplateId)
    //     if (plateTemplate) {
    //         ctx.commit('loadPlateTemplate', plateTemplate)
    //     } else {
    //         try {
    //             plateTemplate = await templateAPI.getPlateTemplateById(plateTemplateId)
    //             ctx.commit('loadPlateTemplate', plateTemplate)
    //         } catch (err) {
    //             console.error(err)
    //         }
    //     }
    //
    //     //TODO add properties and tags load
    // },
    // async loadAll(ctx) {
    //     const response = await templateAPI.getAllPlateTemplates();
    //     ctx.commit('cacheAllPlateTemplates', response);
    // },
    // async createNewPlateTemplate(ctx, newPlateTemplate) {
    //     const createdTemplate = await templateAPI.createPlateTemplate(newPlateTemplate);
    //     // ctx.commit('cachePlateTemplate', createdTemplate);
    //     return createdTemplate;
    // },
    // async deletePlateTemplate(ctx, id) {
    //     await templateAPI.deletePlateTemplate(id)
    //         .then(() => {
    //             ctx.commit('uncachePlateTemplate', id)
    //         })
    // },
    // async updatePlateTemplate(ctx, args) {
    //     await templateAPI.editPlateTemplate(args)
    //     ctx.commit('updatePlateTemplate', args)
    // },
    // async updateWellTemplates(ctx, args) {
    //     ctx.commit('updateWellTemplates', args)
    // },
    // async savePlateTemplate(ctx) {
    //     ctx.commit('savePlateTemplate')
    // }
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
        state.plateTemplates = plateTemplates
    },
    deletePlateTemplate(state, plateTemplate) {
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
    updateWellTemplates(state, args) {
        const modifiedWells = [];
        state.currentPlateTemplate.wells.forEach(well => modifiedWells.push({...well}));
        args.wells.forEach(well => {
            const modifiedWell = modifiedWells.find(w => w.row === well.row && w.column === well.column);
            modifiedWell[args.field] = args.entry;
        })
        state.currentPlateTemplate.wells = [...modifiedWells];
    },
    async savePlateTemplate(state) {
        await templateAPI.editWellTemplates(state.currentPlateTemplate.wells)
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
