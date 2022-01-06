import calculationsAPI from "@/api/calculations";

const state = () => ({
    formulas: [],
    formulaInputs: {}
})

const getters = {
    getFormula: (state) => (id) => {
        return state.formulas.find(f => f.id === id)
    },
    getFormulas: (state) => () => {
        return state.formulas
    },
    areFormulasLoaded: (state) => () => {
        return state.formulas.length>1
    },
    getFormulaInputs: (state) => (id) => {
        return state.formulaInputs[id];
    },
}

const actions = {
    async getFormula(ctx, id) {
        const formula = await calculationsAPI.getFormula(id);
        ctx.commit('cacheFormula', formula);
    },
    async getFormulaInputs(ctx, id) {
        const formulaInputs = await calculationsAPI.getFormulaInputs(id);
        ctx.commit('cacheFormulaInputs', { id: id, inputs: formulaInputs });
    },
    async getAllFormulas(ctx) {
        const formulas = await calculationsAPI.getAllFormulas();
        ctx.commit('cacheAllFormulas', formulas);
    },
    async createFormula(ctx, formula) {
        const newFormula = await calculationsAPI.createFormula(formula);
        ctx.commit('cacheFormula', newFormula);
        return newFormula;
    },
    async updateFormula(ctx, args) {
        const formula = await calculationsAPI.updateFormula(args.id, args.formula);
        ctx.commit('cacheFormula', formula);
    },
    async deleteFormula(ctx, id) {
        await calculationsAPI.deleteFormula(id);
        ctx.commit('uncacheFormula', id);
    },
    async startCalculation(ctx, cal) {
        await calculationsAPI.startCalculation(cal)
    }
}

const mutations = {
    cacheAllFormulas(state, formulas) {
        state.formulas = formulas;
    },
    cacheFormula(state, formula) {
        let i = state.formulas.findIndex(f => f.id == formula.id);
        if (i >= 0) state.formulas.splice(i, 1);
        state.formulas.push(formula);
    },
    uncacheFormula(state, id) {
        let i = state.formulas.findIndex(f => f.id == id);
        if (i >= 0) state.formulas.splice(i, 1);
    },
    cacheFormulaInputs(state, info) {
        state.formulaInputs[info.id] = info.inputs;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
