import experimentAPI from "@/api/experiments"
import plateAPI from '@/api/plates.js'

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
    },
    getActiveMeasurement: (state) => () => {
        if(state.currentPlate.measurements) return state.currentPlate.measurements.find(meas => meas.active === true)
    },
    getAllPlates: (state) => () => {
        return state.plates
    },
    getPlatesInExperiment: (state) => () => {
        return state.platesInExperiment
    },
}

const actions = {
    async loadByExperimentId(ctx, id) {
        if (!ctx.getters['isExperimentLoaded'](id)) {
            const experiment = experimentAPI.getExperimentById(id);
            ctx.commit('experiments/loadExperiment', experiment);
            ctx.commit('experiments/cacheExperiments', [experiment]);
        }
        const plates = await plateAPI.getPlatesByExperimentId(id);
        ctx.commit('cachePlates', plates);
        ctx.commit('cachePlatesInExperiment', {experimentId: id, plates});

        //TODO Implement API to load metadata for multiple objects in 1 call
        for (const plate of plates) {
            ctx.dispatch('metadata/loadMetadata', { objectId: plate.id, objectClass: 'PLATE' }, {root:true});
        }
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

        ctx.dispatch('metadata/loadMetadata', { objectId: plateId, objectClass: 'PLATE' }, {root:true});

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
    async addMeasurement(ctx, plateMeasurement) {
        const meas = await plateAPI.linkMeasurement(plateMeasurement.plateId, plateMeasurement);
        ctx.commit('addMeasurement', meas);
    },
    async setActiveMeasurement(ctx, plateMeasurement) {
        plateMeasurement["linkedBy"] = "sberberovic";
        plateMeasurement["linkedOn"] = new Date();
        await plateAPI.setActivePlateMeasurement(plateMeasurement)
            .then(() => {
                ctx.commit('setActiveMeasurement', plateMeasurement);
            });
    }

    ,
    async deletePlate(ctx, plate) {
        await plateAPI.deletePlateById(plate.id)
            .then(() => {
                ctx.commit('deletePlate', plate)
            })
    },
    async editPlate(ctx, plate) {
        await plateAPI.editPlate(plate)
            .then(() => {
                ctx.commit('editPlate', plate)
            })
    },
    async applyPlateLayout(ctx, plate) {
        const edited = await plateAPI.linkPlate(plate.id, plate.linkTemplateId);
        ctx.commit('editPlate', edited);
    },
    async loadPlateForCalculation(ctx, id) {
        await plateAPI.getPlateById(id)
            .then(plate => {
                ctx.commit('cacheNewPlate',plate)
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
            state.plates.push(plate);
            (state.platesInExperiment[plate.experimentId])?state.platesInExperiment[plate.experimentId].push(plate):state.platesInExperiment[plate.experimentId]=[plate]
        }
    },
    cachePlatesInExperiment(state, args) {
        state.platesInExperiment[args.experimentId] = args.plates;
    },
    loadMeasurements(state, measurements) {
        for (let i = 0; i < measurements.length; i++) {
            if (!containsPlateMeasurement(state.currentPlate, measurements[i])) {
                state.currentPlate?.measurements ? state.currentPlate.measurements.push(measurements[i]) : state.currentPlate.measurements = [measurements[i]];
            }
        }
    },
    addMeasurement(state, plateMeasurement) {
        if (!containsPlateMeasurement(state.currentPlate, plateMeasurement)) {
            state.currentPlate?.measurements ? state.currentPlate.measurements.push(plateMeasurement) : state.currentPlate.measurements = [plateMeasurement];
        }
    },
    setActiveMeasurement(state, { measurementId, active }) {
        for (let m in state.currentPlate.measurements) {
            if (state.currentPlate.measurements[m].measurementId === measurementId)
                state.currentPlate.measurements[m].active = active;
        }

        for (let m in state.currentPlate.measurements) {
            if (state.currentPlate.measurements[m].measurementId !== measurementId)
                state.currentPlate.measurements[m].active = false;
        }
    },
    deletePlate(state, pl) {
        state.plates = state.plates.filter(plate => plate.id !== pl.id)
        let i = state.platesInExperiment[pl.experimentId].findIndex(t => t.id === pl.id);
        state.platesInExperiment[pl.experimentId].splice(i, 1);
    },
    editPlate(state, pl) {
        //Replace properties in state.plates
        let i = state.plates.findIndex(t => t.id === pl.id);
        if(i>-1){
            for (const property in pl){
                state.plates[i][property] = pl[property]
            }
        }
        //Replace properties in state.currentPlate
        if(Object.keys(state.currentPlate).length>0){
            for (const property in pl){
                state.currentPlate[property] = pl[property]
            }
        }
        //Replace properties in state.platesInExperiment
        let j = state.platesInExperiment[pl.experimentId].findIndex(t => t.id === pl.id);
        if (j>-1) {
            for (const property in pl){
                state.platesInExperiment[pl.experimentId][j][property] = pl[property]
            }
        }
    }
}

function containsPlate(state, plate) {
    for (var i = 0; i < state.plates.length; i++){
        if (state.plates[i]?.id === plate.id) {
            return true;
        }
    }
    return false;
}

function containsPlateMeasurement(plate, measurement) {
    let result = plate.measurements?.filter(m => m.measurementId === measurement.measurementId);
    return result !== undefined && result.length > 0;
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
