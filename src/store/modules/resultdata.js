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
            for (const protocol of Object.values(plateResult.protocols)) {
                // note: we assume that only one measurement is loaded for each plate
                if (protocol.measurements?.length === 0) {
                    continue
                }
                // get first measurement and first resultSet (only the latest ResultSet is returned)
                const measurement = Object.values(protocol.measurements)[0][0];
                for (let resultData of measurement.resultData) {
                    if (result.indexOf(resultData.featureId) < 0)
                        result.push(resultData.featureId);
                    // featureIds.add(resultData.featureId);
                }
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
        if (ctx.getters['isPlateResultLoaded'](args.plateId)) {
            return;
        }
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
