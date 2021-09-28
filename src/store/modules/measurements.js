import measAPI from '@/api/measurements.js'

const state = () => ({
    measurements: []
})

const getters = {
    getById: (state) => (id) => {
        return state.measurements.find(meas => meas.id == id)
    },
    getByIds: (state) => (ids) => {
        return state.measurements.filter(meas => ids && ids.includes(meas.id))
    },
    isLoaded: (state) => (id) => {
        return state.measurements.find(meas => meas.id == id) != null
    }
}

const actions = {
    async loadById(ctx, id) {
        const meas = await measAPI.getMeasurementById(id)
        ctx.commit('cacheMeasurement', meas)
    },
    async loadByIds(ctx, ids) {
        const measurements = await measAPI.getMeasurementsByIds(ids)
        ctx.commit('cacheMeasurements', measurements)
    }
}

const mutations = {
    cacheMeasurement (state, meas) {
        let index = state.measurements.indexOf(meas)
        if (index >= 0) state.measurements.splice(index, 1)
        state.measurements.push(meas)
    },
    cacheMeasurements(state, measurements) {
        measurements.forEach(meas => {
            let index = state.measurements.indexOf(meas)
            if (index >= 0) state.measurements.splice(index, 1)
            state.measurements.push(meas)
        });
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}