import calculationsAPI from "@/api/calculations";

const state = () => ({
    formulas: []
})

const getters = {
    getFormulas: (state) => () => {
        return state.formulas
    },
    areFormulasLoaded: (state) => () => {
        return state.formulas.length>1
    }
}

const actions = {
    async getAllFormulas(ctx) {
        await calculationsAPI.getAllFormulas().then( formulas => {
            ctx.commit('getAllFormulas', formulas)
        })
    },
    async startCalculation(ctx, cal){
        await calculationsAPI.startCalculation(cal)
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
