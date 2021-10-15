import resultdataAPI from '@/api/resultdata.js'

const state = () => ({
    resultSets: [],
    resultDatas: [],
    resultDataStats: []
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
}

const actions = {
    async loadResultSetById(ctx, id) {
        const rs = await resultdataAPI.getResultSetById(id)
        ctx.commit('cacheResultSet', rs)
    },
    async loadResultSetsByPlateIds(ctx, plateIds) {
        const results = await resultdataAPI.getResultSetsByPlateIds(plateIds)
        ctx.commit('cacheResultSets', results)
    },
    async loadResultDataById(ctx, args) {
        const rd = await resultdataAPI.getResultDataById(args.resultSetId, args.featureId)
        ctx.commit('cacheResultData', rd)
    },
    async loadStatsByResultSetIds(ctx, args) {
        const stats = await resultdataAPI.getStatsByResultSetIds(args.resultSetIds, args.featureIds)
        ctx.commit('cacheResultDataStats', stats)
    },
    async loadAllResultSets(ctx) {
        const all = await resultdataAPI.getAllResultSets()
        ctx.commit('cacheAllResultSets', all)
    }
}

const mutations = {
    cacheResultSet (state, rs) {
        let index = state.resultSets.indexOf(rs)
        if (index >= 0) state.resultSets.splice(index, 1)
        state.resultSets.push(rs)
    },
    cacheResultSets (state, results) {
        results.forEach(rs => {
            let index = state.resultSets.indexOf(rs)
            if (index === -1) state.resultSets.push(rs)
        });
    },
    cacheResultData (state, rd) {
        let index = state.resultDatas.indexOf(rd)
        if (index >= 0) state.resultDatas.splice(index, 1)
        state.resultDatas.push(rd)
    },
    cacheResultDataStats (state, stats) {
        stats.forEach(stat => {
            let index = state.resultDataStats.indexOf(stat)
            if (index === -1) state.resultDataStats.push(stat)
        });
    },
    cacheAllResultSets (state, all) {
        state.resultSets = all;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}