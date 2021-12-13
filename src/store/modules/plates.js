import plateAPI from '@/api/plates.js'
import metadataAPI from '@/api/metadata.js'

const state = () => ({
    currentPlate: {},
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
    async loadById(ctx, plateId) {
        // Load plate by id
        let plate = ctx.getters.getById(plateId);
        if (plate) {
            ctx.commit('loadPlate', plate);
        } else {
            try {
                plate = await plateAPI.getPlateById(plateId);
                console.log('Load plate by id');
                ctx.commit('loadPlate', plate);
            } catch (err) {
                console.error(err);
            }
        }

        if (plate && !plate.properties) {
            // Load plate properties
            metadataAPI.getObjectProperties(plateId, 'PLATE')
                .then(result => {
                    console.log('Load plate properties');
                    ctx.commit('loadProperties', result);
                })
        }

        if (plate && !plate.tags) {
            // Load plate tags
            metadataAPI.getObjectTags(plateId, 'PLATE')
                .then(result => {
                    console.log('Load plate tags');
                    ctx.commit('loadTags', result);
                })
        }

        if (plate && !plate.measurements) {
            plateAPI.getPlateMeasurementsByPlateId(plateId)
                .then(result => {
                    console.log('Load plate measurements');
                    ctx.commit('loadMeasurements', result);
                });
        }
    },
    async createNewPlate(ctx, plate) {
        const newPlate = await plateAPI.addPlate(plate)
        ctx.commit('cacheNewPlate', newPlate)
    },
    async tagPlate(ctx, tag) {
        await metadataAPI.addTag(tag)
            .then(isAdded => {
                isAdded ? ctx.commit('addTag', tagInfo) : console.log("TODO: Show error message");
            });
    },
    async removeTag(ctx, tag) {
        await metadataAPI.removeTag(tag)
            .then(isDeleted => {
                isDeleted ? ctx.commit('removeTag', tag) : console.log("TODO: Show error message");
            })
    },
    async addProperty(ctx, property) {
        await metadataAPI.addProperty(property)
            .then(isAdded => {
                isAdded ? ctx.commit('addProperty', propertyInfo) : console.log("TODO: Show error message");
            });
    },
    async removeProperty(ctx, property) {
        await metadataAPI.removeProperty(property)
            .then(isDeleted => {
                isDeleted ? ctx.commit('removeProperty', property) : console.log("TODO: Show error message");
            });
    },
    async addMeasurement(ctx, plateMeasurement) {
        const meas = await plateAPI.linkMeasurement(plateMeasurement.plateId, plateMeasurement);
        ctx.commit('addMeasurement', meas);
    },
    async deletePlate(ctx, plate) {
        await plateAPI.deletePlateById(plate.id)
            .then(() => {
                ctx.commit('deletePlate', plate)
            })
    },
    async editPlate(ctx, plate) {
        await plateAPI.editPlate(plate)
            .then(() => {
                ctx.commit('deletePlate', plate)
            })
        //To get all wells again, fetch plate from database
        await plateAPI.getPlateById(plate.id)
            .then(newPlate => {
                ctx.commit('cacheNewPlate', newPlate)
                ctx.commit('loadPlate', newPlate)
            })
    }
}

const mutations = {
    loadPlate(state, plate) {
        if (state.currentPlate && state.currentPlate.id !== plate.id)
            state.currentPlate = plate;
    },
    cachePlates(state, plates) {
        plates?.forEach(plate => {
            if (!state.plates.find(it => it.id === plate.id)) {
                state.plates.push(plate)
            }
        });
    },
    cacheNewPlate(state, plate){
        if(!containsPlate(state,plate)) {
            state.plates.push(plate)
            state.platesInExperiment[plate.experimentId].push(plate)
        }
    },
    loadTags(state, tags) {
        for (let i = 0; i < tags.length; i++) {
            // let plate = state.currentPlate || state.plates.find(p => p.id === tags[i].objectId);
            if (!containsTag(state.currentPlate, tags[i]))
                state.currentPlate.tags !== undefined ? state.currentPlate.tags.push(tags[i]) : state.currentPlate.tags = [tags[i]];
        }
    },
    addTag(state, tagInfo) {
        // var plate = state.plates.find(p => p.id === tagInfo.objectId);
        // let plate = state.currentPlate || state.plates.find(p => p.id === tagInfo.objectId);
        if (!containsTag(state.currentPlate, tagInfo))
            state.currentPlate.tags !== undefined ? state.currentPlate.tags.push(tagInfo) : state.currentPlate.tags = [tagInfo];
    },
    removeTag(state, tagInfo) {
        // let plate = state.plates.find(p => p.id === tagInfo.objectId)
        // let plate = state.currentPlate || state.plates.find(p => p.id === tagInfo.objectId);
        if (containsTag(state.currentPlate, tagInfo)) {
            let i = state.currentPlate.tags.findIndex(t => t.tag === tagInfo.tag);
            state.currentPlate.tags.splice(i, 1);
        }
    },
    addProperty(state, propertyInfo) {
        if (!containsPropertyInfo(state.currentPlate, propertyInfo)) {
            state.currentPlate.properties !== undefined ? state.currentPlate.properties.push(propertyInfo) : state.currentPlate.properties = [propertyInfo];
        }
    },
    loadProperties(state, properties) {
        for (let i = 0; i < properties.length; i++) {
            if (!containsPropertyInfo(state.currentPlate, properties[i])) {
                state.currentPlate.properties !== undefined ? state.currentPlate.properties.push(properties[i]) : state.currentPlate.properties = [properties[i]];
            }
        }
    },
    removeProperty(state, propertyInfo) {
        if (containsPropertyInfo(state.currentPlate, propertyInfo)) {
            let i = state.currentPlate.properties.findIndex(p => p.propertyName === propertyInfo.propertyName);
            state.currentPlate.properties.splice(i, 1);
        }
    },
    cachePlatesInExperiment(state, args) {
        state.platesInExperiment[args.experimentId] = args.plates;
    },
    loadMeasurements(state, measurements) {
        for (let i = 0; i < measurements.length; i++) {
            state.currentPlate?.measurements ? state.currentPlate.measurements.push(measurements[i]) : state.currentPlate.measurements = [measurements[i]];
        }
    },
    addMeasurement(state, plateMeasurement) {
        state.currentPlate?.measurements ? state.currentPlate.measurements.push(plateMeasurement) : state.currentPlate.measurements = [plateMeasurement];
    },
    deletePlate(state, pl) {
        state.plates = state.plates.filter(plate => plate.id !== pl.id)
        let i = state.platesInExperiment[pl.experimentId].findIndex(t => t.id === pl.id);
        state.platesInExperiment[pl.experimentId].splice(i, 1);
    },
}

function containsTag(plate, tagInfo) {
    return plate.tags !== undefined && plate.tags.findIndex(t => t.tag === tagInfo.tag) > -1;
}

function containsPropertyInfo(plate, propertyInfo) {
    return plate.properties !== undefined
        && plate.properties.findIndex(p => p.propertyName === propertyInfo.propertyName) > -1;
}

function containsPlate(state, plate) {
    for (var i = 0; i < state.plates.length; i++){
        if (state.plates[i].id === plate.id) {
            return true;
        }
    }
    return false;
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}