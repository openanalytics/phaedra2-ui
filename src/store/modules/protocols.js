import protocolAPI from '@/api/protocols.js'
import axios from "axios";
import metadataAPI from "@/api/metadata";

const state = () => ({
    currentProtocol: {},
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
    async loadById(ctx, protocolId) {
        // Load protocol by id
        const protocol = ctx.getters.getById(protocolId);
        if (protocol) {
            ctx.commit('loadProtocol', protocol)
        } else {
            await protocolAPI.getProtocolById(protocolId)
                .then(result => {
                    ctx.commit('loadProtocol', result)
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
    async loadProtocolsTags(ctx, protocolId) {
        await axios.get('http://localhost:6020/phaedra/metadata-service/tagged_objects/PROTOCOL',
            {params: {objectId: protocolId}})
            .then(response => {
                ctx.commit('addTags', response.data)
            })
    },
    tagProtocol(ctx, tag) {
        metadataAPI.addTag(tag)
            .then(result => {
                const isCreated = result;
                isCreated ? ctx.commit('addTag', tag) : console.log("TODO: Show error message");
            })
    },
    removeTag(ctx, tag) {
        metadataAPI.removeTag(tag)
            .then(result => {
                const isDeleted = result;
                isDeleted ? ctx.commit('removeTag', tag) : console.log("TODO: Show error message");
            });
    },
    async addNewFeature(ctx, newFeature) {
        await protocolAPI.addNewFeature(newFeature)
            .then(() => {
                ctx.commit('addFeature', newFeature);
                ctx.commit('features/cacheInProtocol', newFeature, { root: true })
            })
    },
    async deleteProtocol(ctx, protocol){
        await protocolAPI.deleteProtocol(protocol)
            .then(() => {
                ctx.commit('deleteProtocol', protocol)
            })
    },
    async editProtocol(ctx, protocol) {
        await protocolAPI.editProtocol(protocol)
            .then(() => {
                ctx.commit('deleteProtocol', protocol)
                ctx.commit('loadProtocol', protocol)
            })
    }
}

const mutations = {
    loadProtocol(state, protocol) {
        let index = state.protocols.indexOf(protocol)
        if (index === -1)
            state.protocols.push(protocol)
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
    addTags(state, tags) {
        for (let i = 0; i < tags.length; i++) {
            const protocol = state.protocols.find(protocol => protocol.id === tags[i].objectId);
            if (!containsTagInfo(protocol, tags[i]))
                protocol.tags !== undefined ? protocol.tags.push(tags[i]) : protocol.tags = [tags[i]];
        }
    },
    addTag(state, tagInfo) {
        const protocol = state.protocols.find(protocol => protocol.id === tagInfo.objectId);
        if (!containsTagInfo(protocol, tagInfo))
            protocol.tags !== undefined ? protocol.tags.push(tagInfo) : protocol.tags = [tagInfo];
    },
    removeTag(state, tagInfo) {
        const protocol = state.protocols.find(protocol => protocol.id === tagInfo.objectId)
        if (containsTagInfo(protocol, tagInfo)) {
            const i = protocol.tags.findIndex(t => t.tag === tagInfo.tag);
            protocol.tags.splice(i, 1);
        }
    },
    addFeature(state, feature) {
        const protocol = state.protocols.find(protocol => protocol.id === feature.protocolId)
        if (!containsFeature(protocol, feature))
            protocol.features !== undefined ? protocol.features.push(feature) : protocol.features = [feature];
    },
    deleteProtocol(state, pr){
        state.protocols = state.protocols.filter(protocol => protocol.id !== pr.id)
    }
}

function containsTagInfo(protocol, tagInfo) {
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
