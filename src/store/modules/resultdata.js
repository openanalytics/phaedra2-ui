import resultdataAPI from '@/api/resultdata.js'

const state = () => ({
    resultSets: []
})

const getters = {
    getById: (state) => (id) => {
        return state.resultSets.find(rs => rs.id == id)
    },
    getAll: (state) => () => {
        return state.resultSets
    },
    isLoaded: (state) => (id) => {
        return state.resultSets.find(rs => rs.id == id) != null
    }
}

const actions = {
    async loadById(ctx, id) {
        const rs = await resultdataAPI.getById(id)
        ctx.commit('cacheOne', rs)
    },
    async loadAll(ctx) {
        const all = await resultdataAPI.getAll()
        ctx.commit('cacheAll', all)
    }
}

const mutations = {
    cacheOne (state, rs) {
        let index = state.resultSets.indexOf(rs)
        if (index === -1) state.resultSets.push(rs)
    },
    cacheAll (state, all) {
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