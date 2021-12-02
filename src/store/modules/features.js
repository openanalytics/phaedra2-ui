import featuresAPI from '@/api/features.js'

const state = () => ({
    features: [],
    featuresInProtocol: {}
})

const getters = {
    getById: (state) => (id) => {
        return state.features.find(f => f.id === id)
    },
    getByIds: (state) => (ids) => {
        return state.features.filter(f => ids.includes(f.id))
    },
    getByProtocolId: (state) => (protocolId) => {
        return state.featuresInProtocol[protocolId]
    },
    getByProtocolIds: (state) => (protocolIds) => {
        return state.features.filter(f => protocolIds && protocolIds.includes(f.protocolId))
    },
    isLoaded: (state) => (id) => {
        return state.features.find(f => f.id === id) != null
    },
    getLoadedIds: (state) => () => {
        return new Set(state.features.map(f => f.id))
    },
    isProtocolLoaded: (state) => (protocolId) => {
        return state.featuresInProtocol[protocolId] !== undefined
    }
}

const actions = {
    async loadByIds(ctx, ids) {
        const loadedIds = ctx.getters['getLoadedIds']()
        const missingIds = Array.from(ids).filter(id => !loadedIds.has(id))
        if (missingIds.length === 0) {
            return
        }
        const features = await featuresAPI.getByIds(missingIds)
        ctx.commit('cacheMany', features)
    },
    async loadByProtocolId(ctx, protocolId) {
        if (ctx.getters['isProtocolLoaded'](protocolId)) {
            return;
        }
        const features = await featuresAPI.getByProtocolId(protocolId)
        if(features){
            ctx.commit('cacheMany', features)
            ctx.commit('cacheFeaturesInProtocol', {protocolId, features})
        }
    }
}

const mutations = {
    cacheOne (state, feature) {
        let index = state.features.indexOf(feature)
        if (index === -1) state.features.push(feature)
    },
    cacheMany (state, features) {
        features?.forEach(feature => {
            let index = state.features.indexOf(feature)
            if (index === -1) state.features.push(feature)
        });
    },
    cacheFeaturesInProtocol (state, args) {
        state.featuresInProtocol[args.protocolId] = args.features
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
