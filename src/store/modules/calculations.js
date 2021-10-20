import calculationsAPI from "@/api/calculations";

const state = () => ({
    formulas: []
})

const getters = {
    getFormulas: (state) => () => {
        return state.formulas
    }
}

const actions = {
    async getAllFormulas(ctx) {
        const formulas = await calculationsAPI.getAllFormulas()
        ctx.commit('getAllFormulas', formulas)
    }
}

const mutations = {
    getAllFormulas(state, formulas) {
        state.formulas = formulas;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
