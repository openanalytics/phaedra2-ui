import calculationsAPI from "@/api/calculations";

const state = () => ({
    formulas: [],
    formulaInputs: {},

    calculationJobs: [],

    categories: [ 'CALCULATION', 'HIT_CALLING', 'OUTLIER_DETECTION', 'POLISHING' ],
    languages: [ 'JAVASCRIPT', 'R', 'JAVASTAT' ],
    scopes: [ 'PLATE', 'WELL', 'SUB_WELL' ]
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
    getCategories: (state) => () => {
        return state.categories;
    },
    getLanguages: (state) => () => {
        return state.languages;
    },
    getScopes: (state) => () => {
        return state.scopes;
    },
    getCalculationJobStatus: (state) => (plateId) => {
        return state.calculationJobs.find(j => j.plateId === plateId);
    }
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
        return formula;
    },
    async deleteFormula(ctx, id) {
        await calculationsAPI.deleteFormula(id);
        ctx.commit('uncacheFormula', id);
    },
    async startCalculation(ctx, calculationRequest) {
        calculationRequest.jobId = await calculationsAPI.startCalculation(calculationRequest);
        ctx.dispatch('refreshCalculationJobStatus', calculationRequest);
    },
    async refreshCalculationJobStatus(ctx, calculationRequest) {
        // Reload the plate, whose calculation flag is now changed.
        ctx.dispatch('plates/loadById', calculationRequest.plateId, {root:true});

        const jobStatus = await calculationsAPI.getCalculationJobStatus(calculationRequest.jobId);
        jobStatus.jobId = calculationRequest.jobId;
        ctx.commit('cacheCalculationJobStatus', jobStatus);

        // Keep updating until the job has been processed.
        if (jobStatus.statusCode === 'SCHEDULED') {
            setTimeout(() => {
                ctx.dispatch('refreshCalculationJobStatus', calculationRequest);
            }, 2000);
        }
    }
}

const mutations = {
    cacheAllFormulas(state, formulas) {
        state.formulas = formulas;
    },
    cacheFormula(state, formula) {
        let i = state.formulas.findIndex(f => f.id === formula.id);
        if (i >= 0) state.formulas.splice(i, 1);
        state.formulas.push(formula);
    },
    uncacheFormula(state, id) {
        let i = state.formulas.findIndex(f => f.id === id);
        if (i >= 0) state.formulas.splice(i, 1);
    },
    cacheFormulaInputs(state, info) {
        state.formulaInputs[info.id] = info.inputs;
    },
    cacheCalculationJobStatus(state, jobStatus) {
        let i = state.calculationJobs.findIndex(j => j.jobId === jobStatus.jobId);
        if (i >= 0) state.calculationJobs.splice(i, 1);
        state.calculationJobs.push(jobStatus);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
