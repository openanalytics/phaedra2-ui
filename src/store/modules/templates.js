import templateAPI from '@/api/templates.js'

const state = () => ({
    currentPlateTemplate: {},
    plateTemplates: [],
    wellTemplatesinPlateTemplate: {}
})

const getters = {
    getById: (state) => (id) => {
        return state.plateTemplates.find(plateTemplate => plateTemplate.id === id)
    }
}

const actions = {
    async loadById(ctx, plateTemplateId) {
        let plateTemplate = ctx.getters.getById(plateTemplateId)
        if (plateTemplate) {
            ctx.commit('loadPlateTemplate', plateTemplate)
        }
        else {
            try {
                plateTemplate = await templateAPI.getPlateTemplateById(plateTemplateId)
                console.log('Load plateTemplate by id');
                ctx.commit('loadPlateTemplate', plateTemplate)
            } catch (err){
                console.error(err)
            }
        }
    }
}

const mutations = {
    loadPlate(state, plateTemplate) {
        if (state.currentPlateTemplate && state.currentPlateTemplate.id !== plateTemplate.id)
            state.currentPlateTemplate = plateTemplate;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}