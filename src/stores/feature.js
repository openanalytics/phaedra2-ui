import {defineStore} from "pinia"
import {useFormulasStore} from "@/stores/formulas";
import featuresAPI from "@/api/features.js";
import ArrayUtils from "@/lib/ArrayUtils";

export const useFeatureStore = defineStore("feature", {
    state: () => ({
        feature: {},
        defaultFeatureStats: []
    }),
    actions: {
        async loadFeature(feature) {
            const formulaStore = useFormulasStore()

            this.feature = feature;
            this.feature["formula"] = formulaStore.getFormulaById(Number.parseInt(feature.formulaId))
        },
        reset() {
            this.feature = {}
        },
        async loadDefaultFeatureStats() {
            this.defaultFeatureStats = await featuresAPI.getAllDefaultFeatureStats();
        },
        async createDefaultFeatureStat(featureStat) {
            const newFeatureStat = await featuresAPI.createDefaultFeatureStat(featureStat);
            this.defaultFeatureStats.push(newFeatureStat);
        },
        async updateDefaultFeatureStat(featureStat) {
            await featuresAPI.updateDefaultFeatureStat(featureStat);
            this.defaultFeatureStats = ArrayUtils.mergeBy(this.defaultFeatureStats, [featureStat], "id");
        },
        async deleteDefaultFeatureStat(featureStatId) {
            await featuresAPI.deleteDefaultFeatureStat(featureStatId);
            const index = this.defaultFeatureStats.find(s => s.id === this.featureStatId);
            this.defaultFeatureStats = this.defaultFeatureStats.filter(s => s.id != featureStatId);
        },
    }
})
