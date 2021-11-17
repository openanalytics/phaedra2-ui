import plateAPI from '@/api/plates.js'
import axios from "axios";

const state = () => ({
    currentPlate: null,
    plates: [],
    platesInExperiment: {}
})

const getters = {
    getByExperimentId: (state) => (id) => {
        return state.platesInExperiment[id];
    },
    getById: (state) => (id) => {
        return state.plates.find(plate => plate.id === id);
    },
    isLoaded: (state) => (id) => {
        return state.plates.find(plate => plate.id === id) != null;
    },
    isExperimentLoaded: (state) => (experimentId) => {
        return state.platesInExperiment[experimentId] !== undefined;
    },
    getCurrentPlate: (state) => () => {
        return state.currentPlate;
    },
    getCurrentPlateMeasurements: (state) => () => {
        return state.currentPlate.measurements;
    }
}

const actions = {
    async loadByExperimentId(ctx, id) {
        if (ctx.getters['isExperimentLoaded'](id)) {
            return;
        }
        await plateAPI.getPlatesByExperimentId(id).then(plates => {
            ctx.commit('cachePlates', plates)
            ctx.commit('cachePlatesInExperiment', {experimentId: id, plates})
        })
    },
    async loadById(ctx, id) {
        let plate = await plateAPI.getPlateById(id);
        plate.measurements = await plateAPI.getPlateMeasurementsByPlateId(id);
        ctx.commit('cachePlate', plate)
    },
    async loadPlateTags(ctx, plateId) {
        await axios.get('http://localhost:6020/phaedra/metadata-service/tagged_objects/PLATE',
            {params: {objectId: plateId}})
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
    removeTag(ctx, plateTag) {
        axios.delete('http://localhost:6020/phaedra/metadata-service/tags', {data: plateTag})
            .then(response => {
                if (response.status === 200) {
                    ctx.commit('removeTag', plateTag);
                }
                console.log(response)
            })
    },
    async addMeasurement(ctx, plateMeasurement) {
        const requestUrl = 'http://localhost:6010/phaedra/plate-service/plate/' + plateMeasurement.plateId + '/measurement';
        await axios.post(requestUrl, plateMeasurement)
            .then(response => {
                if (response.status === 200) {
                    ctx.commit('addMeasurement', response.data);
                }
            });
    },
}

const mutations = {
    cachePlate(state, plate) {
        state.currentPlate = plate;
    },
    cachePlates(state, plates) {
        plates?.forEach(plate => {
            if (!state.plates.find(it => it.id === plate.id)) {
                state.plates.push(plate)
            }
        });
    },
    addTags(state, tags) {
        for (let i = 0; i < tags.length; i++) {
            // var plate = state.plates.find(p => p.id === tags[i].objectId);
            let plate = state.currentPlate || state.plates.find(p => p.id === tags[i].objectId);
            if (!containsTagInfo(plate, tags[i]))
                plate.tags !== undefined ? plate.tags.push(tags[i]) : plate.tags = [tags[i]];
        }
    },
    addTag(state, tagInfo) {
        // var plate = state.plates.find(p => p.id === tagInfo.objectId);
        let plate = state.currentPlate || state.plates.find(p => p.id === tagInfo.objectId);
        if (!containsTagInfo(plate, tagInfo))
            plate.tags !== undefined ? plate.tags.push(tagInfo) : plate.tags = [tagInfo];
    },
    removeTag(state, tagInfo) {
        // let plate = state.plates.find(p => p.id === tagInfo.objectId)
        let plate = state.currentPlate || state.plates.find(p => p.id === tagInfo.objectId);
        if (containsTagInfo(plate, tagInfo)) {
            let i = plate.tags.findIndex(t => t.tag === tagInfo.tag);
            plate.tags.splice(i, 1);
        }
    },
    cachePlatesInExperiment(state, args) {
        state.platesInExperiment[args.experimentId] = args.plates;
    },
    addMeasurement(state, plateMeasurement) {
        state.currentPlate?.measurements ? state.currentPlate.measurements.push(plateMeasurement) : state.currentPlate.measurements = [plateMeasurement];
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
