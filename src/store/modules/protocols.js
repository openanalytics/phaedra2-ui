import protocolAPI from '@/api/protocols.js'

const state = () => ({
    protocols: []
})

const getters = {
    getById: (state) => (id) => {
        return state.protocols.find(protocol => protocol.id == id)
    },
    getAll: (state) => () => {
        return state.protocols
    },
    isLoaded: (state) => (id) => {
        return state.protocols.find(protocol => protocol.id == id) != null
    }
}

const actions = {
    async loadById(ctx, id) {
        const protocol = await protocolAPI.getProtocolById(id)
        ctx.commit('cacheProtocol', protocol)
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