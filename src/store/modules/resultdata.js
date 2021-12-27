import resultdataAPI from '@/api/resultdata.js'

const state = () => ({
    plateResults: {},
    latestPlateResult: {}
})

const getters = {
    getPlateResults: (state) => (plateId) => {
        return state.plateResults[plateId];
    },
    getLatestPlateResult: (state) => (plateId) => {
        return state.latestPlateResult[plateId];
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
    }
}

const actions = {
    async loadPlateResults(ctx, args) {
        await resultdataAPI.getPlateResults(args.plateId)
            .then(results => {
                ctx.commit('cachePlateResults', { plateId: args.plateId, results });
            });

    },
    async loadLatestPlateResult(ctx, args) {
        await resultdataAPI.getLatestPlateResult(args.plateId)
            .then(plateResult => {
                ctx.commit('cacheLatestPlateResult', { plateId: args.plateId, plateResult });
            });
    }
}

const mutations = {
    cachePlateResults(state, args) {
        state.plateResults[args.plateId] = args.results;
    },
    cacheLatestPlateResult(state, args) {
        state.latestPlateResult[args.plateId] = args.plateResult;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
