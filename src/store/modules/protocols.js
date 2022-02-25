import protocolAPI from '@/api/protocols.js'

const state = () => ({
    currentProtocolId: null,
    protocols: []
})

const getters = {
    getCurrentProtocol: (state) => () => {
        if (state.currentProtocolId) return state.protocols.find(p => p.id === state.currentProtocolId);
    },
    getById: (state) => (id) => {
        return state.protocols.find(protocol => protocol.id == id)
    },
    getByIds: (state) => (ids) => {
        return state.protocols.filter(protocol => ids && ids.includes(protocol.id))
    },
    getAll: (state) => () => {
        return state.protocols
    },
    isLoaded: (state) => (id) => {
        return state.protocols.find(protocol => protocol.id == id) != null
    },
    getLoadedIds: (state) => () => {
        return new Set(state.protocols.map(f => f.id))
    }
}

const actions = {
    async loadById(ctx, protocolId) {
        let protocol = ctx.getters.getById(protocolId);
        if (!protocol) {
            protocol = await protocolAPI.getProtocolById(protocolId);
            ctx.commit('cacheProtocols', [protocol]);
            ctx.dispatch('metadata/loadMetadata', { objectId: protocolId, objectClass: 'PROTOCOL' }, {root:true});
        }
        ctx.commit('setCurrentProtocolId', protocolId);
    },
    async loadByIds(ctx, ids) {
        const loadedIds = ctx.getters['getLoadedIds']()
        // Fetch only protocols that are currently unloaded
        const missingIds = Array.from(ids).filter(id => !loadedIds.has(id));
        if (missingIds.length === 0) {
            return;
        }
        const protocols = await protocolAPI.getProtocolsByIds(missingIds);
        ctx.commit('cacheProtocols', protocols);
    },
    async loadAll(ctx) {
        const protocols = await protocolAPI.getAllProtocols();
        const protocolIds = protocols.map(p => p.id);
        ctx.dispatch('metadata/loadMetadata', { objectId: protocolIds, objectClass: 'PROTOCOL' }, {root:true});
        ctx.commit('cacheProtocols', protocols);
    },
    //TODO Rename to saveNewProtocol
    async saveProtocol(ctx, protocol) {
        const newProtocol = await protocolAPI.createNewProtocol(protocol);
        ctx.commit('cacheProtocols', [newProtocol]);
        ctx.commit('setCurrentProtocolId', newProtocol.id);
        return newProtocol;
    },
    async deleteProtocol(ctx, id) {
        await protocolAPI.deleteProtocol(id);
        ctx.commit('deleteProtocol', id);
    },
    async editProtocol(ctx, protocol) {
        const updatedProtocol = await protocolAPI.editProtocol(protocol);
        ctx.commit('cacheProtocols', [updatedProtocol]);
    },
    async downloadAsJson({rootGetters}, id) {
        //TODO This should move out of the store. Suggested: into the lib folder.

        //Make hard copy of protocol and assign features + formulaName, delete id
        const protocol = {...rootGetters['protocols/getById'](id)}
        delete protocol.id
        //If there are features, add them
        if (rootGetters['features/getByProtocolId'](id)){
        protocol.features = rootGetters['features/getByProtocolId'](id).map(a => {return {...a}})
        protocol.features.forEach(f => {
            //Add formulaName
            if(rootGetters['calculations/getFormula'](f.formulaId))
                f.formulaName = rootGetters['calculations/getFormula'](f.formulaId).name
            //Load, remove ids and add civ
            if(rootGetters['features/getCalculationInputValueByFeatureId'](f.id)){
            f.calculationInputValues = rootGetters['features/getCalculationInputValueByFeatureId'](f.id).map(a => {return {...a}})
            f.calculationInputValues.forEach(c => {delete c.id; delete c.featureId})}
            delete f.id
            delete f.protocolId
        })}
        //Parse and save to default downloads folder, a lot of boilerplate code form stackoverflow
        const data = JSON.stringify(protocol)
        const blob = new Blob([data], {type: 'text/plain'})
        const e = document.createEvent('MouseEvents'),
            a = document.createElement('a');
        //File name
        a.download = protocol.name + ".json";
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    },
    async importAsJson({dispatch}, json) {
        const features = json.features
        delete json.features
        //Add new protocol without features
        const protocol = await dispatch('saveProtocol', json)
        //Add new features without formulaName, with new protocolId
        if (features){
        features.forEach(f => {
            const civs = f.calculationInputValues
            f.protocolId = protocol.id
            delete f.formulaName
            delete f.calculationInputValues
            dispatch('features/createFeature', {newFeature: f, civs: civs}, {root:true})
        })}
    }
}

const mutations = {
    setCurrentProtocolId(state, protocolId) {
        state.currentProtocolId = protocolId;
    },
    cacheProtocols (state, protocols) {
        protocols.forEach(protocol => {
            let index = state.protocols.findIndex(p => p.id === protocol.id);
            if (index >= 0) state.protocols.splice(index, 1)
            state.protocols.push(protocol)
        });
    },
    deleteProtocol(state, id) {
        state.protocols = state.protocols.filter(protocol => protocol.id !== id)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
