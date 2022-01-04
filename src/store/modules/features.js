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
            return features
        }
    },
    async deleteFeature(ctx, feature){
        //First find and delete featureStats
        await featuresAPI.getFeatureStatsByFeatureId(feature.id)
            .then(response => {
                response.forEach(f => {
                    featuresAPI.deleteFeatureStat(feature.id,f.id)
                })
            }).then(()=>{
                //If all featureStats are deleted, delete feature
                featuresAPI.deleteFeature(feature.id)
            })
        ctx.commit('deleteFeature', feature)
    },
    async editFeature(ctx, feature){
        await featuresAPI.editFeature(feature)
            .then(() => {
                ctx.commit('editFeature', feature)
            })
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
    },
    cacheInProtocol(state, feature) {
        if (state.featuresInProtocol[feature.protocolId])
            state.featuresInProtocol[feature.protocolId].push(feature);
        else
            state.featuresInProtocol[feature.protocolId] = [feature];
    },
    deleteFeature(state, feature){
        state.features = state.features.filter(feature => feature.id !== feature.id)
        let i = state.featuresInProtocol[feature.protocolId].findIndex(t => t.id === feature.id);
        state.featuresInProtocol[feature.protocolId].splice(i, 1);
    },
    editFeature(state, feature){
        //Replace properties in state.plates
        let i = state.features.findIndex(t => t.id === feature.id);
        if(i){
            for (const property in feature){
                state.features[i] = feature[property]
            }
        }
        //Replace properties in state.featureInProtocol
        let j = state.featuresInProtocol[feature.protocolId].findIndex(t => t.id === feature.id);
        console.log(j)
        if (j>-1) {
            for (const property in feature){
                state.featuresInProtocol[feature.protocolId][j][property] = feature[property]
            }
            console.log(state.featuresInProtocol[feature.protocolId][j])
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
