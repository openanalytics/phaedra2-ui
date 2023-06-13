import datacaptureAPI from "@/api/datacapture";

const state = () => ({
    jobs: [],
    config: '',
    captureConfigs: []
})

const getters = {
    getJobs: (state) => () => {
        return state.jobs
    },
    getConfig: (state) => () => {
        return state.config
    },
    getAllCaptureConfigs: (state) => () => {
        return state.captureConfigs
    }
}

const actions = {
    async submitJob(ctx, job) {
        for (let i = 0; i < job.files.length; i++) {
            await datacaptureAPI.uploadData(job.sourcePath, job.files[i])
        }
        await datacaptureAPI.postJob(job);
    },
    async loadJobs(ctx, args) {
        const jobs = await datacaptureAPI.getJobs(args)
        ctx.commit('cacheJobs', jobs)
    },
    async cancelJob(ctx, id) {
        await datacaptureAPI.cancelJob(id)
        ctx.commit('cancelJob', id)
    },
    async loadCaptureJobConfig(ctx, id) {
        const config = await datacaptureAPI.getCaptureJobConfig(id)
        ctx.commit('cacheCaptureJobConfig', config)
    },
    async uploadData(ctx, data) {
        await datacaptureAPI.uploadData(data);
    },
    async loadCaptureConfigs(ctx) {
        const capturedConfigs = await datacaptureAPI.getAllCaptureConfigurations();
        ctx.commit('allCaptureConfigs', capturedConfigs)
    },
    async loadCaptureConfigByName(ctx, configName) {
        const config = await datacaptureAPI.getCaptureConfiguration(configName)
        ctx.commit('cacheCaptureJobConfig', config)
    }
}

const mutations = {
    cacheJobs(state, jobs) {
        /*jobs.forEach(job => {
            let match = state.jobs.find(j => j.id === job.id)
            if (match) state.jobs.splice(state.jobs.indexOf(match), 1)
            state.jobs.push(job)
        });*/
        state.jobs = jobs
    },
    cancelJob(state, id) {
        let i = state.jobs.findIndex(t => t.id === id);
        if (i > -1) state.jobs[i].statusCode = "Cancelled"
    },
    cacheCaptureJobConfig(state, config) {
        state.config = config
    },
    allCaptureConfigs(state, config) {
        state.captureConfigs = [...config]
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
