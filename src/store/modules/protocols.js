import protocolAPI from '@/api/protocols.js'

const state = () => ({
    currentProtocol: {},
    protocols: []
})

const getters = {
    getCurrentProtocol: (state) => () => {
        return state.currentProtocol;
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
        if (protocol) {
            ctx.commit('loadProtocol', protocol)
        } else {
            try {
                protocol = await protocolAPI.getProtocolById(protocolId);
                ctx.commit('loadProtocol', protocol)
            }catch (err) {
                console.error(err);
            }
        }

        ctx.dispatch('metadata/loadMetadata', { objectId: protocolId, objectClass: 'PROTOCOL' }, {root:true});
    },
    async loadByIds(ctx, ids) {
        const loadedIds = ctx.getters['getLoadedIds']()
        const missingIds = Array.from(ids).filter(id => !loadedIds.has(id))
        if (missingIds.length === 0) {
            return
        }
        const protocols = await protocolAPI.getProtocolsByIds(missingIds)
        console.log(protocols);
        ctx.commit('cacheProtocols', protocols)
    },
    async loadAll(ctx) {
        const protocols = await protocolAPI.getAllProtocols()
        ctx.commit('cacheAllProtocols', protocols)
    },
    async saveProtocol(ctx, protocol) {
        const newProtocol = await protocolAPI.createNewProtocol(protocol)
        ctx.commit('loadProtocol', newProtocol)
        return newProtocol
    },
    async deleteProtocol(ctx, protocol){
        await protocolAPI.deleteProtocol(protocol.id)
            .then(() => {
                ctx.commit('deleteProtocol', protocol)
            })
    },
    async editProtocol(ctx, data) {
        ctx.commit('editProtocol', data);
        const protocol = ctx.getters.getCurrentProtocol();
        await protocolAPI.editProtocol(protocol)
            .then(() => {
                ctx.commit('loadProtocol', protocol)
            })
    },
    async downloadAsJson({rootGetters}, id) {
        //Make hard copy of protocol and assign features + formulaName
        const protocol = {...rootGetters['protocols/getById'](id)}
        delete protocol.id
        protocol.features = rootGetters['features/getByProtocolId'](id).map(a => {return {...a}})
        protocol.features.forEach(f => {
            delete f.id
            delete f.protocolId
            if(rootGetters['calculations/getFormula'](f.formulaId))
                f.formulaName = rootGetters['calculations/getFormula'](f.formulaId).name
        })
        //Parse and save to default downloads folder
        const data = JSON.stringify(protocol)
        const blob = new Blob([data], {type: 'text/plain'})
        const e = document.createEvent('MouseEvents'),
            a = document.createElement('a');
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
        console.log(protocol, 'before foreach')
        //Add new features without formulaName, with new protocolId
        features.forEach(f => {
            delete f.formulaName
            console.log(protocol)
            f.protocolId = protocol.id
            console.log('protocols:',f)
            dispatch('features/createFeature', {newFeature: f}, {root:true})
        })
    }
}

const mutations = {
    loadProtocol(state, protocol) {
        state.currentProtocol = protocol;
    },
    cacheProtocols (state, protocols) {
        protocols.forEach(protocol => {
            // TODO broken
            let index = state.protocols.indexOf(protocol)
            if (index >= 0) state.protocols.splice(index, 1)
            state.protocols.push(protocol)
            console.log(JSON.stringify(state.protocols))
        });
    },
    cacheAllProtocols (state, protocols) {
        state.protocols = protocols;
    },
    addFeature(state, feature) {
        const protocol = state.protocols.find(protocol => protocol.id === feature.protocolId)
        if (!containsFeature(protocol, feature))
            protocol.features !== undefined ? protocol.features.push(feature) : protocol.features = [feature];
    },
    editProtocol(state, data) {
        state.currentProtocol.name = data.name;
        state.currentProtocol.description = data.description;
    },
    deleteProtocol(state, pr){
        state.protocols = state.protocols.filter(protocol => protocol.id !== pr.id)
    }
}

function containsFeature(protocol, feature) {
    return protocol.features !== undefined && protocol.features.findIndex(f => f.id === feature.id) > -1;
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
