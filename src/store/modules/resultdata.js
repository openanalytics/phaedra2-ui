import resultdataAPI from '@/api/resultdata.js'

const state = () => ({
    plateResults: {},
    latestPlateResult: {},
    recentCalculations: []
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
    },
    getRecentCalculations: (state) => () => {
        return state.recentCalculations;
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
    },
    async loadRecentCalculations(ctx) {
        await resultdataAPI.getAllResults()
            .then(result => {
                console.log(result)
                ctx.commit('cacheRecentCalculations',result)
            })
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
        console.log(args)
        state.recentCalculations = args.sort((p1, p2) => {
            let p1Time = new Date((p1.executionEndTimeStamp)?p1.executionEndTimeStamp:p1.executionStartTimeStamp).getTime()
            let p2Time = new Date((p2.executionEndTimeStamp)?p2.executionEndTimeStamp:p2.executionStartTimeStamp).getTime()
            return  p2Time - p1Time;
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
