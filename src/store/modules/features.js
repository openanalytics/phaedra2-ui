import featuresAPI from '@/api/features.js'

const state = () => ({
    features: [],
    featuresInProtocol: {},
    calculationInputValuesInFeature: []
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
    },
    getCalculationInputValueByFeatureId: (state) => (featureId) => {
        return state.calculationInputValuesInFeature[featureId]
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
        for (const id of missingIds) {
            ctx.dispatch('metadata/loadMetadata', { objectId: missingIds, objectClass: 'FEATURE' }, {root:true});
        }
    },
    async loadByProtocolId(ctx, protocolId) {
        if (ctx.getters['isProtocolLoaded'](protocolId)) {
            return;
        }
        const features = await featuresAPI.getByProtocolId(protocolId)
        if (features) {
            ctx.commit('cacheMany', features)
            ctx.commit('cacheFeaturesInProtocol', {protocolId, features})
            features.forEach(f => {
                ctx.dispatch('getCalculationInputValue', f.id)
            })
        }
    },
    // async createFeature(ctx, args) {
    //     await featuresAPI.createFeature(args.newFeature)
    //         .then((result) => {
    //             ctx.commit('cacheOne', result);
    //             ctx.commit('features/cacheInProtocol', result, {root: true})
    //             args.civs.forEach(c => {
    //                 ctx.dispatch('createCalculationInputValue',{featureId: result.id, civ: c})
    //             })
    //         })
    // },
    async deleteFeature(ctx, id) {
        await featuresAPI.deleteFeature(id)
        ctx.commit('deleteFeature', id)
    },
    async editFeature(ctx, args) {
        await featuresAPI.editFeature(args.feature)
            .then(() => {
                ctx.commit('editFeature', args.feature)
                if (args.formulaChange){
                    //Delete previous civs
                    args.prev.forEach(c => {
                        ctx.dispatch('deleteCalculationInputValue',{featureId: args.feature.id, id: c.id})
                    })
                    //Remove all civs for this feature from cache
                    ctx.commit('uncacheFullCalculationInputValue', {featureId: args.feature.id})
                    args.civs.forEach(c => {
                        ctx.dispatch('createCalculationInputValue',{featureId: args.feature.id, civ: c})
                    })
                }
                else {
                    //Remove all civs for this feature from cache
                    ctx.commit('uncacheFullCalculationInputValue', {featureId: args.feature.id})
                    args.civs.forEach(c => {
                        ctx.dispatch('updateCalculationInputValue',{featureId: args.feature.id, civ: c})
                    })
                }
            })
    },
    async getCalculationInputValue(ctx, featureId) {
        await featuresAPI.getCalculationInputValue(featureId)
            .then(response => {
                ctx.commit('cacheCalculationInputValues', response)
            })
    },
    async createCalculationInputValue(ctx, args) {
        await featuresAPI.createCalculationInputValue(args.featureId, args.civ)
            .then(response => {
                ctx.commit('cacheCalculationInputValue', response)
            })
    },
    async updateCalculationInputValue(ctx, args){
        await featuresAPI.updateCalculationInputValue(args.featureId, args.civ)
            .then((response) => {
                ctx.commit('cacheCalculationInputValue',response)
            })
    },
    async deleteCalculationInputValue(ctx, args){
        await featuresAPI.deleteCalculationInputValue(args.id)
    },
    async addNewFeatureToProtocol(ctx, feature) {
        ctx.commit('cacheInProtocol', feature)
    }
}

const mutations = {
    cacheOne(state, feature) {
        let index = state.features.indexOf(feature)
        if (index === -1) state.features.push(feature)
    },
    cacheMany(state, features) {
        features?.forEach(feature => {
            let index = state.features.indexOf(feature)
            if (index === -1) state.features.push(feature)
        });
    },
    cacheFeaturesInProtocol(state, args) {
        state.featuresInProtocol[args.protocolId] = args.features
    },
    cacheInProtocol(state, feature) {
        if (state.featuresInProtocol[feature.protocolId])
            state.featuresInProtocol[feature.protocolId].push(feature);
        else
            state.featuresInProtocol[feature.protocolId] = [feature];
    },
    deleteFeature(state, id) {
        const f = state.features.find(f => f.id === id)
        state.features = state.features.filter(feature => feature.id !== id)
        if (f){
            let i = state.featuresInProtocol[f.protocolId].findIndex(t => t.id === id);
            state.featuresInProtocol[f.protocolId].splice(i, 1);}
    },
    editFeature(state, feature) {
        //Replace properties in state.plates
        let i = state.features.findIndex(t => t.id === feature.id);
        if (i > -1) {
            for (const property in feature) {
                state.features[i][property] = feature[property]
            }
        }
        //Replace properties in state.featureInProtocol
        let j = state.featuresInProtocol[feature.protocolId].findIndex(t => t.id === feature.id);
        if (j > -1) {
            for (const property in feature) {
                state.featuresInProtocol[feature.protocolId][j][property] = feature[property]
            }
        }
    },
    cacheCalculationInputValues(state, civ) {
        if (civ && civ.length > 0)
            state.calculationInputValuesInFeature[civ[0].featureId] = civ;
    },
    cacheCalculationInputValue(state,civ) {
        if(!state.calculationInputValuesInFeature[civ.featureId])
            state.calculationInputValuesInFeature[civ.featureId] = [civ]
        else
            state.calculationInputValuesInFeature[civ.featureId].push(civ)
    },
    updateCalculationInputValue(state,civ) {
        let i = state.calculationInputValuesInFeature[civ.featureId].findIndex(t => t.id === civ.id);
        if (i>0) {
            for (const property in civ) {
                state.calculationInputValuesInFeature[civ.featureId][i][property] = civ[property]
            }
        }
    },
    uncacheCalculationInputValue(state,args) {
        state.calculationInputValuesInFeature = state.calculationInputValuesInFeature[args.featureId].filter(t => t !== args.id)
    },
    uncacheFullCalculationInputValue(state,args) {
        state.calculationInputValuesInFeature = state.calculationInputValuesInFeature[args.featureId] = []
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
