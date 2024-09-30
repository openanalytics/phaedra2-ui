import {defineStore} from "pinia"
import calculationsAPI from "@/api/calculations"
import VersionUtils from "@/lib/VersionUtils"

export const useFormulasStore = defineStore("formulas",  {
    state: () => ({
        formulas: [],
        formulaInputs: {}
    }),
    getters: {
        getFormulaById: state => {
            return (formulaId) => state.formulas.find((formula) => formula.id === formulaId)
        },
        getFormulaInputsByFormulaId: state => {
            return (formulaId) => state.formulaInputs[formulaId] || []
        },
        getHigherVersionFormula: state => {
            // If a higher version for this formula exists, return it (the highest one available). Otherwise return null.
            return (formulaId) => {
                const formula = state.formulas.find(f => f.id === formulaId);
                if (!formula) return null;
                const highestVersionFormula = state.formulas.filter(f => f.name == formula.name).sort((f1, f2) => VersionUtils.compareVersions(f1.versionNumber, f2.versionNumber)).reverse()[0];
                if (VersionUtils.compareVersions(formula.versionNumber, highestVersionFormula.versionNumber) < 0) return highestVersionFormula;
                else return null;
            }
        }
    },
    actions: {
        async loadAllFormulas() {
            this.formulas = await calculationsAPI.getAllFormulas();
        },
        async loadFormulaInputs(formulaId) {
            this.formulaInputs[formulaId] = await calculationsAPI.getFormulaInputs(formulaId)
        }
    }

})
