import measAPI from '@/api/measurements.js'

const state = () => ({
    measurements: [],
    measurementsInPlate: {}
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
        return state.measurementsInPlate[plateId];
    },
    getActiveMeasurement: (state) => () => {
        return state.measurementsInPlate.find(meas => meas.active === true)
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
        if (plate.measurements) {
            plate.measurements.forEach(pm => {
                measAPI.getMeasurementById(pm.measurementId)
                    .then(response => {
                        let plateMeas = response;
                        plateMeas['active'] = pm.active;
                        ctx.commit('cacheMeasurementsInPlate', { plateMeas: plateMeas, plateId: plate.id })
                    })
            })
        } else {
            ctx.commit('cacheMeasurementsInPlate', { plateId: plate.id })
        }

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
    cacheMeasurementsInPlate(state, params) {
        // const plateMeas = state.measurementsInPlate.find(pm => pm.id === plateMeasurement.id);
        if (state.measurementsInPlate[params.plateId]) {
            const plateMeas = state.measurementsInPlate[params.plateId].find(pm => pm.id === params.plateMeas.id);
            if (plateMeas === undefined)
                state.measurementsInPlate[params.plateId].push(params.plateMeas);
        } else {
            if (params.plateMeas) state.measurementsInPlate[params.plateId] = [params.plateMeas];
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
