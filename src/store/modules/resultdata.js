import resultdataAPI from '@/api/resultdata.js'

const state = () => ({
    resultSets: [],
    resultDatas: []
})

const getters = {
    getResultSetById: (state) => (id) => {
        return state.resultSets.find(rs => rs.id == id)
    },
    getResultDataById: (state) => (resultSetId, featureId) => {
        return state.resultDatas.find(rd => rd.resultSetId == resultSetId && rd.featureId == featureId)
    },
    getAllResultSets: (state) => () => {
        return state.resultSets
    },
    isResultSetLoaded: (state) => (id) => {
        return state.resultSets.find(rs => rs.id == id) != null
    }
}

const actions = {
    async loadResultSetById(ctx, id) {
        const rs = await resultdataAPI.getResultSetById(id)
        ctx.commit('cacheResultSet', rs)
    },
    async loadResultDataById(ctx, args) {
        const rd = await resultdataAPI.getResultDataById(args.resultSetId, args.featureId)
        ctx.commit('cacheResultData', rd)
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
    cacheResultData (state, rd) {
        let index = state.resultDatas.indexOf(rd)
        if (index >= 0) state.resultDatas.splice(index, 1)
        state.resultDatas.push(rd)
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