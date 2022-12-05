import resultdataAPI from '@/api/resultdata.js'

const state = () => ({
    plateResults: {},
    latestPlateResult: {},
    recentCalculations: [],
    mockWellData:
        //List of well data
        [{id: 8795, plateId: 101, row: 1, column: 1, wellType: 'LC', featureName: 0.232, featurename2: 0.324},
        {id: 8796, plateId: 101, row: 1, column: 2, wellType: 'LC'},
        {id: 8797, plateId: 101, row: 1, column: 3, wellType: 'LC'},
        {id: 8798, plateId: 101, row: 1, column: 4, wellType: 'LC'},
        {id: 8799, plateId: 101, row: 1, column: 5, wellType: 'LC'},
        {id: 8800, plateId: 101, row: 1, column: 6, wellType: 'LC'},
        {id: 8801, plateId: 101, row: 1, column: 7, wellType: 'HC'},
        {id: 8802, plateId: 101, row: 1, column: 8, wellType: 'HC'},
        {id: 8803, plateId: 101, row: 1, column: 9, wellType: 'HC'},
        {id: 8804, plateId: 101, row: 1, column: 10, wellType: 'HC'},
        {id: 8805, plateId: 101, row: 1, column: 11, wellType: 'HC'},
        {id: 8806, plateId: 101, row: 1, column: 12, wellType: 'HC'},]
    })

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
    getMockWellData: (state) => (plateId) => {
        return state.mockWellData.filter(wd => wd.plateId === plateId);
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
