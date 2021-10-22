import resultdataAPI from '@/api/resultdata.js'

const state = () => ({
    resultSets: [],
    resultDatas: [],
    resultDataStats: [],
    latestPlateResult: {}
})

const getters = {
    getResultSetById: (state) => (id) => {
        return state.resultSets.find(rs => rs.id == id)
    },
    getResultSetsByPlateIds: (state) => (plateIds) => {
        return state.resultSets.filter(rs => plateIds && plateIds.includes(rs.plateId))
    },
    getAllResultSets: (state) => () => {
        return state.resultSets
    },
    isResultSetLoaded: (state) => (id) => {
        return state.resultSets.find(rs => rs.id == id) != null
    },
    getResultDataById: (state) => (resultSetId, featureId) => {
        return state.resultDatas.find(rd => rd.resultSetId == resultSetId && rd.featureId == featureId)
    },
    isResultDataLoaded: (state) => (resultSetId, featureId) => {
        return state.resultDatas.find(rd => rd.resultSetId == resultSetId && rd.featureId == featureId) != null
    },
    getStatsByResultSetIds: (state) => (resultSetIds, featureIds) => {
        return state.resultDataStats.filter(stats => resultSetIds.includes(stats.resultSetId) && featureIds.includes(stats.featureId))
    },
    getLatestPlateResult: (state) => (plateId) => {
        return state.latestPlateResult[plateId];
    },
    isPlateResultLoaded: (state) => (plateId) => {
        return state.latestPlateResult[plateId] !== undefined;
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
    async loadResultSetById(ctx, id) {
        await resultdataAPI.getResultSetById(id)
            .then(result => {
                ctx.commit('cacheResultSet', result);
            });
    },
    async loadResultSetsByPlateIds(ctx, plateIds) {
        await resultdataAPI.getResultSetsByPlateIds(plateIds)
            .then(results => {
                ctx.commit('cacheResultSets', results);
            });
    },
    async loadResultDataById(ctx, args) {
        await resultdataAPI.getResultDataById(args.resultSetId, args.featureId)
            .then(result => {
                ctx.commit('cacheResultData', result);
            });

    },
    async loadStatsByResultSetIds(ctx, args) {
        await resultdataAPI.getStatsByResultSetIds(args.resultSetIds, args.featureIds)
            .then(result => {
                ctx.commit('cacheResultDataStats', result);
            });
    },
    async loadAllResultSets(ctx) {
        await resultdataAPI.getAllResultSets()
            .then(result => {
                ctx.commit('cacheAllResultSets', result);
            });
    },
    async loadLatestPlateResult(ctx, args) {
        if (ctx.getters['isPlateResultLoaded'](args.plateId)) {
            return;
        }
        await resultdataAPI.getLatestPlateResult(args.plateId)
            .then(plateResult => {
                ctx.commit('cacheLatestPlateResult', {plateId: args.plateId, plateResult});
            });
    }
}

const mutations = {
    cacheResultSet(state, rs) {
        let index = state.resultSets.indexOf(rs)
        if (index >= 0) state.resultSets.splice(index, 1)
        state.resultSets.push(rs)
    },
    cacheResultSets(state, results) {
        results.forEach(rs => {
            let index = state.resultSets.indexOf(rs)
            if (index === -1) state.resultSets.push(rs)
        });
    },
    cacheResultData(state, rd) {
        let index = state.resultDatas.indexOf(rd)
        if (index >= 0) state.resultDatas.splice(index, 1)
        state.resultDatas.push(rd)
    },
    cacheResultDataStats(state, stats) {
        stats.forEach(stat => {
            let index = state.resultDataStats.indexOf(stat)
            if (index === -1) state.resultDataStats.push(stat)
        });
    },
    cacheAllResultSets(state, all) {
        state.resultSets = all;
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
