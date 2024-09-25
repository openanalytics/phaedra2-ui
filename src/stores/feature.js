import {defineStore} from "pinia"
import {useFormulasStore} from "@/stores/formulas";
import featuresAPI from "@/api/features.js";
import ArrayUtils from "@/lib/ArrayUtils";

export const useFeatureStore = defineStore("feature", {
    state: () => ({
        feature: {},
        featureStats: {},
        defaultFeatureStats: []
    }),
    actions: {
        async loadFeature(feature) {
            const formulaStore = useFormulasStore()

            this.feature = feature;
            this.feature["formula"] = formulaStore.getFormulaById(Number.parseInt(feature.formulaId))

            this.featureStats[feature.id] = await featuresAPI.getFeatureStats(feature.id);
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
            this.defaultFeatureStats = this.defaultFeatureStats.filter(s => s.id != featureStatId);
        },

        async loadFeatureStats(featureId) {
            this.featureStats[featureId] = await featuresAPI.getFeatureStats(featureId);
        },
        async createFeatureStat(featureId, featureStat) {
            const newFeatureStat = await featuresAPI.createFeatureStat(featureId, featureStat);
            this.featureStats[featureId].push(newFeatureStat);
        },
        async updateFeatureStat(featureStat) {
            await featuresAPI.updateFeatureStat(featureStat);
            this.featureStats[featureId] = ArrayUtils.mergeBy(this.featureStats[featureId], [featureStat], "id");
        },
        async deleteFeatureStat(featureId, featureStatId) {
            await featuresAPI.deleteFeatureStat(featureStatId);
            this.featureStats[featureId] = this.featureStats[featureId].filter(s => s.id != featureStatId);
        },
    }
})
