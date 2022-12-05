import { defineStore } from "pinia"
import calculationsAPI from "@/api/calculations";

export const useFeatureStore = defineStore("feature",  {
    state: () => ({
        feature: {},
    }),
    actions: {
      async loadFeature(feature) {
          this.feature = feature;
          this.feature["formula"] = await calculationsAPI.getFormula(feature.formulaId)
      }
    }
})
