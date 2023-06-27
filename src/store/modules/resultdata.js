import resultdataAPI from '@/api/resultdata.js'

const state = () => ({
    plateResults: {},
    latestPlateResult: {},
    recentCalculations: [],
    latestResultSetIds: [],
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
    getResultSets: (state) => (plateId) => {
        return state.resultSets.filter(rs => rs.plateId === plateId);
    },
    getLatestResultSets: (state) => () => {
        return state.resultSets.filter(rs => state.latestResultSetIds.find(id => rs.id === id));
    },
    getLatestResultSetsForPlateMeas: (state) => (plateId, measId) => {
        return Object.values(state.resultSets
            .filter(rs => rs.plateId === plateId && rs.measId === measId)
            // Per protocol, keep only the most recent resultSet
            .reduce(function(acc, rs) {
                let pId = rs.protocolId;
                if (!acc[pId]) acc[pId] = rs;
                else acc[pId] = (acc[pId].executionStartTimeStamp.localeCompare(rs.executionStartTimeStamp) > 0) ? acc[pId] : rs;
                return acc;
            }, {})
        );
    },
    getResultData: (state) => (resultSetId) => {
        return state.resultData.filter(rd => rd.resultSetId === resultSetId);
    },
    getResultStats: (state) => (resultSetId) => {
        return state.resultStats.filter(stat => stat.resultSetId === resultSetId);
    },
    getMockWellData: (state) => (plateId) => {
        return state.mockWellData.filter(wd => wd.plateId === plateId);
    }
}

const actions = {
    async loadResultSets(ctx, plateId) {
        const resultSets = await resultdataAPI.getResultSetsByPlateId(plateId);
        ctx.commit('cacheResultSets', resultSets);
    },
    async loadLatestResultSets(ctx, count) {
        const resultSets = await resultdataAPI.getLatestResultSets(count);
        ctx.commit('cacheResultSets', resultSets);
        ctx.commit('cacheLatestResultSetIds', resultSets.map(rs => rs.id));
    },
    async loadResultData(ctx, resultSetId) {
        const resultData = await resultdataAPI.getResultDataByResultSetId(resultSetId);
        ctx.commit('cacheResultData', resultData);
    },
    async loadResultStats(ctx, resultSetId) {
        const resultStats = await resultdataAPI.getResultStatsByResultSetId(resultSetId);
        ctx.commit('cacheResultStats', resultStats);
    }
}

const mutations = {
    cacheResultSets(state, resultSets) {
        state.resultSets = mergeArraysByObjectId(state.resultSets, resultSets);
    },
    cacheResultData(state, resultData) {
        state.resultData = mergeArraysByObjectId(state.resultData, resultData);
    },
    cacheResultStats(state, resultStats) {
        state.resultStats = mergeArraysByObjectId(state.resultStats, resultStats);
    },
    cacheLatestResultSetIds(state, ids) {
        state.latestResultSetIds = ids;
    },
}

function mergeArraysByObjectId(a1, a2) {
    let newArray = [...a1];
    a2.forEach(o => {
        let index = newArray.findIndex(oo => oo.id === o.id);
        if (index >= 0) newArray.splice(index, 1);
        newArray.push(o);
    });
    return newArray;
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
