import datacaptureAPI from "@/api/datacapture";

const state = () => ({
    jobs: []
})

const getters = {
    getAllJobs: (state) => () => {
        return state.jobs
    }
}

const actions = {
    async loadAllJobs(ctx) {
        const jobs = await datacaptureAPI.getAllJobs()
        ctx.commit('cacheJobs', jobs)
    }
}

const mutations = {
    cacheJobs(state, jobs) {
        jobs.forEach(job => {
            let match = state.jobs.find(j => j.id === job.id)
            if (match) state.jobs.splice(state.jobs.indexOf(match), 1)
            state.jobs.push(job)
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
