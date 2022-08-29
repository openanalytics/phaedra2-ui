import measAPI from '@/api/measurements.js'
import plateAPI from '@/api/plates.js'

const state = () => ({
    measurements: [],
    plateMeasurements: {},
    renderConfigs: []
})

const getters = {
    getAll: (state) => () => {
        return state.measurements;
    },
    getById: (state) => (id) => {
        return state.measurements?.find(meas => meas.id === id)
    },
    getByIds: (state) => (ids) => {
        return state.measurements?.filter(meas => !!ids[meas.id])
    },
    isLoaded: (state) => (id) => {
        return state.measurements?.find(meas => meas.id === id) != null
    },
    getPlateMeasurements: (state) => (plateId) => {
      return state.plateMeasurements[plateId];
    },
    getActivePlateMeasurement: (state) => (plateId) => {
         return state.plateMeasurements[plateId]?.filter(pm => pm.active === true)[0];
    },
    getRenderConfig: (state) => (id) => {
        return state.renderConfigs.find(cfg => cfg.id === id);
    }
}

const actions = {
    async loadAll(ctx) {
        await measAPI.getAllMeasurements()
            .then(result => {
                ctx.commit('cacheMeasurements', result);
            });
    },
    async loadById(ctx, id) {
        const meas = await measAPI.getMeasurementById(id)
        ctx.commit('cacheMeasurement', meas)
    },
    async loadByIds(ctx, ids) {
        if (ids?.length > 0) {
            for (let i = 0; i < ids.length; i++) {
                const measurement = await measAPI.getMeasurementById(ids[i]);
                ctx.commit('cacheMeasurement', measurement);
            }
        }
    },
    async loadByPlateId(ctx, args){
        await plateAPI.getPlateMeasurementsByPlateId(args.plateId)
            .then(results => {
                ctx.commit('cachePlateMeasurements', { plateId: args.plateId, measurements: results });
            });
    },
    async addMeasurement(ctx, plateMeasurement) {
        const meas = await plateAPI.linkMeasurement(plateMeasurement.plateId, plateMeasurement);
        ctx.commit('addMeasurement', meas);
        ctx.commit('activateMeasurement', meas);
    },
    async setActiveMeasurement(ctx, plateMeasurement) {
        plateMeasurement["linkedBy"] = "sberberovic";
        plateMeasurement["linkedOn"] = new Date();
        await plateAPI.setActivePlateMeasurement(plateMeasurement)
            .then(() => {
                ctx.commit('activateMeasurement', plateMeasurement);
            });
    },
    async loadAvailableMeasurements(ctx, plate) {
        const allMeasurements = await measAPI.getAllMeasurements();
        const availableMeasurements = allMeasurements.filter(m => m.rows === plate.rows && m.columns === plate.columns);
        ctx.commit("cacheMeasurements", availableMeasurements);
    },
    async loadRenderConfig(ctx, id) {
        const cfg = await measAPI.getRenderConfig(id);
        ctx.commit('cacheRenderConfig', cfg);
    }
}

const mutations = {
    cacheMeasurement(state, meas) {
        var measurement = state.measurements.find(m => m.id === meas.id);
        if (measurement === undefined)
            state.measurements.push(meas);
    },
    cacheMeasurements(state, measurements) {
        state.measurements = [...measurements];
    },
    cachePlateMeasurements(state, args) {
        state.plateMeasurements[args.plateId] = args.measurements;
    },
    addMeasurement(state, plateMeasurement) {
        if (state.plateMeasurements[plateMeasurement.plateId]) {
            if (!containsPlateMeasurement(state.plateMeasurements[plateMeasurement.plateId], plateMeasurement)) {
                state.plateMeasurements[plateMeasurement.plateId].push(plateMeasurement);
            }
        } else {
            state.plateMeasurements[plateMeasurement.plateId] = [plateMeasurement];
        }
    },
    activateMeasurement(state, {plateId, measurementId, active }) {
        for (let m in state.plateMeasurements[plateId]) {
            if (state.plateMeasurements[plateId][m].measurementId === measurementId)
                state.plateMeasurements[plateId][m].active = active;
        }

        for (let m in state.plateMeasurements[plateId]) {
            if (state.plateMeasurements[plateId][m].measurementId !== measurementId)
                state.plateMeasurements[plateId][m].active = false;
        }
    },
    cacheRenderConfig(state, cfg) {
        var existingConfig = state.renderConfigs.find(el => el.id === cfg.id);
        if (existingConfig === undefined) state.renderConfigs.push(cfg);
    }
}

function containsPlateMeasurement(plateMeasurements, plateMeasurement) {
    let result = plateMeasurements.filter(m => m.measurementId === plateMeasurement.measurementId);
    return result !== undefined && result.length > 0;
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
