import resultdataAPI from '@/api/resultdata.js'

const state = () => ({
    resultSets: [],
    resultData: [],
    resultStats: [],

    latestResultSetIds: []
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
