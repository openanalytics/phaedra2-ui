import protocolAPI from '@/api/protocols.js'
import axios from "axios";

const state = () => ({
    protocols: [],
    formulas: []
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
    },
    async saveProtocol(ctx, protocol) {
        if (protocol.id !== undefined) {
            const newProtocol = await protocolAPI.createNewProtocol(protocol)
            ctx.commit('cacheProtocol', newProtocol)
        }
    },
    async loadProtocolsTags(ctx, protocolId) {
        await axios.get('http://localhost:6020/phaedra/metadata-service/tagged_objects/PROTOCOL',
            {params: {objectId: protocolId}})
            .then(response => {
                ctx.commit('addTags', response.data)
            })
    },
    tagProtocol(ctx, tagInfo) {
        axios.post('http://localhost:6020/phaedra/metadata-service/tags', tagInfo)
            .then(response => {
                if (response.status === 201) {
                    ctx.commit('addTag', tagInfo);
                }
                console.log(response)
            })
    },
    removeTag(ctx, protocolTag) {
        axios.delete('http://localhost:6020/phaedra/metadata-service/tags', {data: protocolTag})
            .then(response => {
                if (response.status === 200) {
                    ctx.commit('removeTag', protocolTag);
                }
                console.log(response)
            })
    },
    addNewFeature(ctx, newFeature) {
        axios.post('http://localhost:6030/phaedra/protocol-service/features', newFeature)
            .then(response => {
                if (response.status === 201) {
                    ctx.commit('addFeature', response.data);
                }
                console.log(response)
            })
    }
}

const mutations = {
    cacheProtocol(state, protocol) {
        let index = state.protocols.indexOf(protocol)
        if (index === -1)
            state.protocols.push(protocol)
    },
    cacheAllProtocols(state, protocols) {
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
        if (containsFeature(protocol, feature))
            protocol.features !== undefined ? protocol.features.push(feature) : protocol.features = [feature];
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
