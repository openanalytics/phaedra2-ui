import {defineStore} from "pinia"
import calculationsAPI from "@/api/calculations"
import VersionUtils from "@/lib/VersionUtils"
import {ref} from "vue";

export const useFormulasStore = defineStore("formulas", () => {
  const formula = ref({})
  const formulas = ref([])
  const formulaInputs = ref({})

  const loadFormula = async (formulaId) => {
    const data = await calculationsAPI.getFormula(formulaId);
    formula.value = data;
    await loadFormulaInputs(formulaId);
  }

  const reloadFormula = async () => {
    await loadFormula(formula.value.id);
  }

  const createFormula = async (formula) => {
    const created = await calculationsAPI.createFormula(formula);
    formula.value = created;
  }

  const updateFormula = async (formula) => {
    const updated = await calculationsAPI.updateFormula(formula.id, formula);
    await loadFormula(updated.id)
  }

  const loadAllFormulas = async () => {
    formulas.value = await calculationsAPI.getAllFormulas();
  }

  const loadFormulaInputs = async (formulaId) => {
    formulaInputs.value[formulaId] = await calculationsAPI.getFormulaInputs(
        formulaId)
  }

  const getFormulaById = (formulaId) => {
    return formulas.value.find((formula) => formula.id === formulaId)
  }

  const getFormulaInputsByFormulaId = async (formulaId) => {
    return formulaInputs.value[formulaId] || []
  }

  const getHigherVersionFormula = (formulaId) => {
    // If a higher version for this formula exists, return it (the highest one available). Otherwise return null.
    const formula = formulas.value.find(f => f.id === formulaId);
    if (!formula) {
      return null;
    }
    const highestVersionFormula = formulas.value.filter(
        f => f.name == formula.name).sort(
        (f1, f2) => VersionUtils.compareVersions(f1.versionNumber,
            f2.versionNumber)).reverse()[0];
    if (VersionUtils.compareVersions(formula.versionNumber,
        highestVersionFormula.versionNumber) < 0) {
      return highestVersionFormula;
    } else {
      return null;
    }
  }

  const getLatestFormulas = async () => {
    const oldVersions = formulas.value.map(f => f.previousVersionId);
    return formulas.value.filter(f => !oldVersions.includes(f.id));
  }

  return {
    formula,
    formulas,
    formulaInputs,
    loadFormula,
    reloadFormula,
    createFormula,
    updateFormula,
    loadAllFormulas,
    loadFormulaInputs,
    getFormulaById,
    getFormulaInputsByFormulaId,
    getHigherVersionFormula,
    getLatestFormulas,
  }
})
