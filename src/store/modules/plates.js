import plateAPI from '@/api/plates.js'
import axios from "axios";

const state = () => ({
    plates: []
})

const getters = {
    getByExperimentId: (state) => (id) => {
        return state.plates.filter(plate => plate.experimentId == id);
    },
    getById: (state) => (id) => {
        return state.plates.find(plate => plate.id == id)
    },
    isLoaded: (state) => (id) => {
        return state.plates.find(plate => plate.id == id) != null
    }
}

const actions = {
    async loadByExperimentId(ctx, id) {
        const plates = await plateAPI.getPlatesByExperimentId(id)
        ctx.commit('cachePlates', plates)
    },
    async loadById(ctx, id) {
        const plate = await plateAPI.getPlateById(id)
        ctx.commit('cachePlate', plate)
    },
    async loadPlateTags(ctx, experimentId) {
        await axios.get('http://localhost:6020/phaedra/metadata-service/tagged_objects/PLATE',
            {params: {objectId: experimentId}})
            .then(response => {
                ctx.commit('addTags', response.data)
            })
    },
    tagPlate(ctx, tagInfo) {
        axios.post('http://localhost:6020/phaedra/metadata-service/tags', tagInfo)
            .then(response => {
                if (response.status === 201) {
                    ctx.commit('addTag', tagInfo);
                }
                console.log(response)
            })
    },
    removeTag(ctx, projectTag) {
        axios.delete('http://localhost:6020/phaedra/metadata-service/tags', {data: projectTag})
            .then(response => {
                if (response.status === 200) {
                    ctx.commit('removeTag', projectTag);
                }
                console.log(response)
            })
    }
}

const mutations = {
    cachePlate (state, plate) {
        let index = state.plates.indexOf(plate)
        if (index === -1) state.plates.push(plate)
    },
    cachePlates(state, plates) {
        plates.forEach(plate => {
            let index = state.plates.indexOf(plate)
            if (index === -1) state.plates.push(plate)
        });
    },
    addTags(state, tags) {
        for (let i = 0; i < tags.length; i++) {
            var plate = state.plates.find(p => p.id === tags[i].objectId);
            if (!containsTagInfo(plate, tags[i]))
                plate.tags !== undefined ? plate.tags.push(tags[i]) : plate.tags = [ tags[i] ];
        }
    },
    addTag(state, tagInfo) {
        var plate = state.experiments.find(p => p.id === tagInfo.objectId);
        if (!containsTagInfo(plate, tagInfo))
            plate.tags !== undefined ? plate.tags.push(tagInfo) : plate.tags = [ tagInfo ];
    },
    removeTag(state, tagInfo) {
        var plate = state.experiments.find(p => p.id === tagInfo.objectId)
        if (containsTagInfo(plate, tagInfo)) {
            var i = plate.tags.findIndex(t => t.tag === tagInfo.tag);
            plate.tags.splice(i, 1);
        }
    }
}

function containsTagInfo(plate, tagInfo) {
    return plate.tags !== undefined && plate.tags.findIndex(t => t.tag === tagInfo.tag) > -1;
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
