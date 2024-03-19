import calculationsAPI from "@/api/calculations";
import {defineStore} from "pinia";

export const useCalcStore = defineStore('calculation', {
    state: () => ({
        formulas: [],
        formulaInputs: {},

        calculationJobs: [],

        categories: [ 'CALCULATION', 'HIT_CALLING', 'OUTLIER_DETECTION', 'POLISHING' ],
        languages: [ 'JAVASCRIPT', 'R', 'JAVASTAT' ],
        scopes: [ 'PLATE', 'WELL', 'SUB_WELL' ]
    }),
    actions: {
        async getFormula(id) {
            const formula = await calculationsAPI.getFormula(id);
            const index = this.formulas.findIndex((f) => {
                return f.id === id
            })
            this.formulas[index] = {...this.formulas[index], ...formula}
        },
        async getFormulaInputs(id) {
            const formulaInputs = await calculationsAPI.getFormulaInputs(id);
            this.formulaInputs[id] = formulaInputs
        },
        async getAllFormulas() {
            const formulas = await calculationsAPI.getAllFormulas();
            this.formulas = formulas
        },
        async createFormula(formula) {
            const newFormula = await calculationsAPI.createFormula(formula);
            this.formulas.push(newFormula)
            return newFormula;
        },
        async updateFormula(args) {
            const formula = await calculationsAPI.updateFormula(args.id, args.formula);
            const index = this.formulas.findIndex((f) => {
                return f.id === id
            })
            this.formulas[index] = {...this.formulas[index], ...formula}
            return formula;
        },
        async deleteFormula(id) {
            await calculationsAPI.deleteFormula(id);
            const index = this.formulas.findIndex((f) => {
                return f.id === id
            })
            this.formulas.splice(index, 1)
        },
        async startCalculation(calculationRequest) {
            calculationRequest.jobId = await calculationsAPI.startCalculation(calculationRequest)
            await this.refreshCalculationJobStatus(calculationRequest)
        },
        async refreshCalculationJobStatus(calculationRequest) {
            // TODO: Reload the plate, whose calculation flag is now changed.
            // ctx.dispatch('plates/loadById', calculationRequest.plateId, {root: true});

            const jobStatus = await calculationsAPI.getCalculationJobStatus(calculationRequest.jobId);
            jobStatus.jobId = calculationRequest.jobId;


            const index = this.calculationJobs.findIndex((c) => {
                return c.jobId === jobStatus.jobId
            })
            if (index > -1)
                this.calculationJobs[index] = { ...this.calculationJobs[index], ...jobStatus }
            else
                this.calculationJobs.push(jobStatus)

            // Keep updating until the job has been processed.
            if (jobStatus.statusCode === 'SCHEDULED') {
                setTimeout(() => {
                    this.refreshCalculationJobStatus(calculationRequest)
                }, 2000);
            }
        }
    }
})
