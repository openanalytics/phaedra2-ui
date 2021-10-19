import protocolAPI from '@/api/protocols.js'

const state = () => ({
    protocols: []
})

const getters = {
    getById: (state) => (id) => {
        return state.protocols.find(protocol => protocol.id == id)
    },
    getByIds: (state) => (ids) => {
        console.log(JSON.stringify(state.protocols));
        console.log(ids);
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
    }
}

const mutations = {
    cacheProtocol (state, protocol) {
        let index = state.protocols.indexOf(protocol)
        if (index === -1) state.protocols.push(protocol)
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}