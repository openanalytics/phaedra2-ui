import { defineStore } from "pinia"
import calculationsAPI from "@/api/calculations"

export const useFormulasStore = defineStore("formulas",  {
    state: () => ({
        formulas: [],
        formulaInputs: {}
    }),
    getters: {
        getFormulaById: (state) => {
            return (formulaId) => state.formulas.find((formula) => formula.id === formulaId)
        },
        getFormulaInputsByFormulaId: state => {
            return (formulaId) => state.formulaInputs[formulaId] || []
        }
    },
    actions: {
        async loadAllFormulas() {
            this.formulas = await calculationsAPI.getAllFormulas();
        },
        async loadFormulaInputs(formulaId) {
            const formulaInputs = await calculationsAPI.getFormulaInputs(formulaId)
            this.formulaInputs[formulaId] = formulaInputs
        }
    }

})
