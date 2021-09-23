import featuresAPI from '@/api/features.js'

const state = () => ({
    features: []
})

const getters = {
    getById: (state) => (id) => {
        return state.features.find(f => f.id == id)
    },
    getByProtocolId: (state) => (protocolId) => {
        return state.features.filter(f => f.protocolId == protocolId)
    },
    isLoaded: (state) => (id) => {
        return state.features.find(f => f.id == id) != null
    }
}

const actions = {
    async loadById(ctx, id) {
        const feature = await featuresAPI.getById(id)
        ctx.commit('cacheOne', feature)
    },
    async loadByProtocolId(ctx, protocolId) {
        const features = await featuresAPI.getByProtocolId(protocolId)
        ctx.commit('cacheMany', features)
    }
}

const mutations = {
    cacheOne (state, feature) {
        let index = state.features.indexOf(feature)
        if (index === -1) state.features.push(feature)
    },
    cacheMany (state, features) {
        features.forEach(feature => {
            let index = state.features.indexOf(feature)
            if (index === -1) state.features.push(feature)
        });
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}