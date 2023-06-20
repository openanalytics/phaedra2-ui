import measAPI from '@/api/measurements.js'
import plateAPI from '@/api/plates.js'

const state = () => ({
    measurements: [],
    plateMeasurements: {},
    renderConfigs: [],
    wellData: {},
    measImages: {}
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
         return state.plateMeasurements[plateId]?.find(pm => pm.active === true);
    },
    getActivePlateMeasurements: (state) => (plateIds) => {
        return Object.values(state.plateMeasurements).flat().filter(pm => pm.active === true && plateIds.includes(pm.plateId));
   },
    getRenderConfig: (state) => (id) => {
        return state.renderConfigs.find(cfg => cfg.id === id);
    },
    getRenderConfigs: (state) => () => {
        return state.renderConfigs;
    },
    getWellData: (state) => (measId) => {
        return state.wellData[measId];
    },
    getMeasImage: (state) => ({ measId, wellNr }) => {
        return state.measImages[measId + '#' + wellNr];
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
    async loadByPlateId(ctx, plateId){
        await plateAPI.getPlateMeasurementsByPlateId(plateId)
            .then(results => {
                ctx.commit('cachePlateMeasurements', { plateId: plateId, measurements: results });
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
    },
    async loadAllRenderConfigs(ctx) {
        const cfgs = await measAPI.getRenderConfigs();
        ctx.commit('cacheRenderConfigs', cfgs);
    },
    async loadWellData(ctx, measId) {
        const wellData = await measAPI.getWellData(measId);
        ctx.commit("cacheWellData", { measId: measId, wellData: wellData });
    },
    async createRenderConfig(ctx, newConfig) {
        const savedConfig = await measAPI.createRenderConfig(newConfig);
        ctx.commit('cacheRenderConfig', savedConfig);
        return savedConfig;
    },
    async updateRenderConfig(ctx, config) {
        const  updatedConfig = await measAPI.updateRenderConfig(config);
        ctx.commit('cacheRenderConfig', updatedConfig);
    },
    async deleteRenderConfig(ctx, id) {
        await measAPI.deleteRenderConfig(id);
        ctx.commit('uncacheRenderConfig', id);
    },
    async loadMeasImage(ctx, { measId, wellNr, scale }) {
        const image = await measAPI.getMeasImage(measId, wellNr, scale);
        ctx.commit('cacheMeasImage', { measId: measId, wellNr: wellNr, image: image });
    }
}

const mutations = {
    cacheMeasurement(state, meas) {
        const measurement = state.measurements.find(m => m.id === meas.id);
        if (measurement === undefined)
            state.measurements.push(meas);
    },
    cacheMeasurements(state, measurements) {
        state.measurements = [...measurements];
    },
    cachePlateMeasurements(state, args) {
        state.plateMeasurements[args.plateId] = args.measurements || [];
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
        const existingConfigIndex = state.renderConfigs.findIndex(el => el.id === cfg.id);
        if (existingConfigIndex >= 0) {
            state.renderConfigs.splice(existingConfigIndex, 1);
        }
        state.renderConfigs.push(cfg);
    },
    uncacheRenderConfig(state, id) {
        const existingConfigIndex = state.renderConfigs.findIndex(el => el.id === id);
        if (existingConfigIndex >= 0) {
            state.renderConfigs.splice(existingConfigIndex, 1);
        }
    },
    cacheRenderConfigs(state, cfgs) {
        state.renderConfigs = [...cfgs];
    },
    cacheWellData(state, { measId, wellData }) {
        state.wellData[measId] = wellData;
    },
    cacheMeasImage(state, { measId, wellNr, image }) {
        state.measImages[measId + '#' + wellNr] = image;
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
