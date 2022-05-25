import resultdataAPI from '@/api/resultdata.js'

const state = () => ({
    plateResults: {},
    latestPlateResult: {},
    recentCalculations: []})

const getters = {
    getPlateResults: (state) => (plateId, measId) => {
        return state.plateResults[plateId]?.filter(pr => measId == null || pr.measId === measId);
    },
    getLatestPlateResult: (state) => (plateId, measId) => {
        return state.latestPlateResult[plateId]?.filter(pr => measId == null || pr.measId === measId);
    },
    getLatestPlateResultFeatureIds: (state) => (plateIds) => {
        const result = [];
        for (const plateId of plateIds) {
            const plateResult = state.latestPlateResult[plateId];
            if (!plateResult) continue;

            let featureIds = [... new Set(plateResult.map(rs => rs.featureId))]
            for (const i in featureIds) {
                result.push(featureIds[i])
            }
        }
        return result;
    },
    getRecentCalculations: (state) => () => {
        return state.recentCalculations;
    },
}

const actions = {
    async loadPlateResults(ctx, args) {
        await resultdataAPI.getPlateResults(args.plateId)
            .then(results => {
                ctx.commit('cachePlateResults', { plateId: args.plateId, results });
            });

    },
    async loadLatestPlateResult(ctx, args) {
        await resultdataAPI.getLatestPlateResult(args.plateId, args.measurementId)
            .then(plateResult => {
                ctx.commit('cacheLatestPlateResult', {plateId: args.plateId, plateResult});
            });
    },
    async loadRecentCalculations(ctx, n) {
        const result = await resultdataAPI.getRecentCalculationResults(n);
        ctx.commit('cacheRecentCalculations', result)
    }
}

const mutations = {
    cachePlateResults(state, args) {
        state.plateResults[args.plateId] = args.results;
    },
    cacheLatestPlateResult(state, args) {
        state.latestPlateResult[args.plateId] = args.plateResult;
    },
    cacheRecentCalculations(state, args) {
        state.recentCalculations = args
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
