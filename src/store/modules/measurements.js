import measAPI from '@/api/measurements.js'

const state = () => ({
    measurements: [],
    measurementsInPlate: []
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
    getPlateMeasurements: (state) => () => {
        return state.measurementsInPlate;
    }
}

const actions = {
    async loadAll(ctx) {
        await measAPI.getAllMeasurements()
            .then(result => {
                ctx.commit('cacheMeasurements', result);
            });
    },
    async loadPlateMeasurements(ctx, plate) {
        plate.measurements?.forEach(pm => {
            measAPI.getMeasurementById(pm.measurementId)
                .then(response => {
                    let plateMeas = response;
                    plateMeas['active'] = pm.active;
                    ctx.commit('cacheMeasurementsInPlate', plateMeas)
                })
        })
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
    }
}

const mutations = {
    cacheMeasurement(state, meas) {
        var measurement = state.measurements.find(m => m.id === meas.id);
        if (measurement === undefined)
            state.measurements.push(meas);
    },
    cacheMeasurements(state, measurements) {
        measurements?.forEach(meas => {
            var measurement = state.measurements.find(m => m.id === meas.id);
            if (measurement === undefined)
                state.measurements.push(meas)
        });
    },
    cacheMeasurementsInPlate(state, plateMeasurement) {
        const plateMeas = state.measurementsInPlate.find(pm => pm.id === plateMeasurement.id);
        if (plateMeas === undefined)
            state.measurementsInPlate.push(plateMeasurement);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
