import measAPI from '@/api/measurements.js'

const state = () => ({
    measurements: []
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
    async loadAvailableMeasurements(ctx, plate) {
        const allMeasurements = await measAPI.getAllMeasurements();
        const availableMeasurements = allMeasurements.filter(m => m.rows === plate.rows && m.columns === plate.columns);
        ctx.commit("cacheMeasurements", availableMeasurements);
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
        // measurements?.forEach(meas => {
        //     var measurement = state.measurements.find(m => m.id === meas.id);
        //     if (measurement === undefined)
        //         state.measurements.push(meas)
        // });
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
