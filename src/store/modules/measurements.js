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
        return state.measurements?.find(meas => meas.id == id)
    },
    getByIds: (state) => (ids) => {
        return state.measurements?.filter(meas => ids && ids.includes(meas.id))
    },
    isLoaded: (state) => (id) => {
        return state.measurements?.find(meas => meas.id == id) != null
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
    cacheMeasurementsInPlate(state, args) {
        state.measurementsInPlate[args.plateId] = args.measurements;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
