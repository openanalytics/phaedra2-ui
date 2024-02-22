import {defineStore} from "pinia"
import {useFormulasStore} from "@/stores/formulas";

export const useFeatureStore = defineStore("feature", {
    state: () => ({
        feature: {},
    }),
    actions: {
        async loadFeature(feature) {
            const formulaStore = useFormulasStore()

            this.feature = feature;
            this.feature["formula"] = formulaStore.getFormulaById(Number.parseInt(feature.formulaId))
        },
        reset() {
            this.feature = {}
        }
    }
})
