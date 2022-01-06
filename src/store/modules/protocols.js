import protocolAPI from '@/api/protocols.js'
import metadataAPI from '@/api/metadata.js'

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
    async loadById(ctx, protocolId) {
        // Load protocol by id
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

        // Load protocol tags
        if (protocol && !protocol.tags) {
            await metadataAPI.getObjectTags(protocolId, 'PROTOCOL')
                .then(tags => {
                    ctx.commit('loadTags', tags);
                })
        }
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
        if (protocol.id !== undefined) {
            const newProtocol = await protocolAPI.createNewProtocol(protocol)
            ctx.commit('loadProtocol', newProtocol)
        }
    },
    async tagProtocol(ctx, tag) {
        await metadataAPI.addTag(tag)
            .then(result => {
                const isCreated = result;
                isCreated ? ctx.commit('addTag', tag) : console.log("TODO: Show error message");
            })
    },
    async removeTag(ctx, tag) {
        await metadataAPI.removeTag(tag)
            .then(result => {
                const isDeleted = result;
                isDeleted ? ctx.commit('removeTag', tag) : console.log("TODO: Show error message");
            });
    },
    async deleteProtocol(ctx, protocol){
        await protocolAPI.deleteProtocol(protocol)
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
    loadTags(state, tags) {
        for (let i = 0; i < tags.length; i++) {
            if (!containsTag(state.currentProtocol, tags[i]))
                state.currentProtocol.tags ? state.currentProtocol.tags.push(tags[i]) : state.currentProtocol.tags = [tags[i]];
        }
    },
    addTag(state, tagInfo) {
        const protocol = state.protocols.find(protocol => protocol.id === tagInfo.objectId);
        if (!containsTag(protocol, tagInfo))
            protocol.tags !== undefined ? protocol.tags.push(tagInfo) : protocol.tags = [tagInfo];
    },
    removeTag(state, tagInfo) {
        const protocol = state.protocols.find(protocol => protocol.id === tagInfo.objectId)
        if (containsTag(protocol, tagInfo)) {
            const i = protocol.tags.findIndex(t => t.tag === tagInfo.tag);
            protocol.tags.splice(i, 1);
        }
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

function containsTag(protocol, tagInfo) {
    return protocol.tags !== undefined && protocol.tags.findIndex(t => t.tag === tagInfo.tag) > -1;
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
