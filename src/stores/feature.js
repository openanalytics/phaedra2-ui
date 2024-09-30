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
            this.feature.formula = formulaStore.getFormulaById(Number.parseInt(feature.formulaId))
            if (!this.feature.stats) this.feature.stats = await featuresAPI.getFeatureStats(feature.id) || [];
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

        async saveFeatureStats(feature) {
            if (!feature.stats) return;
            const newStats = feature.stats;
            const currentStats = await featuresAPI.getFeatureStats(feature.id);

            // Delete removed stats
            currentStats.filter(s => !newStats.find(ns => ns.id == s.id)).map(async s => await featuresAPI.deleteFeatureStat(feature.id, s.id));
            // Save new stats
            newStats.filter(s => !s.id).map(async s => await featuresAPI.createFeatureStat(feature.id, s));
            // Save modified stats
            for (let ns of newStats) {
                const cs = currentStats.find(s => s.id == ns.id);
                if (!cs) continue;
                const isEqual = (ns.formulaId == cs.formulaId) && (ns.name == cs.name) && (ns.plateStat == cs.plateStat) && (ns.welltypeStat == cs.welltypeStat);
                if (!isEqual) await featuresAPI.updateFeatureStat(ns);
            }
        },
    }
})
