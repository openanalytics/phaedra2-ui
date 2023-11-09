import datacaptureAPI from "@/api/datacapture";
import ArrayUtils from "@/lib/ArrayUtils";

const state = () => ({
    jobs: [],
    config: '',
    captureConfigs: [],
    captureScripts: []
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
    },
    getCaptureConfigById: (state) => (id) => {
        return state.captureConfigs.find(s => s.id == id)
    },
    getAllCaptureScripts: (state) => () => {
        return state.captureScripts
    },
    getCaptureScriptById: (state) => (id) => {
        return state.captureScripts.find(s => s.id == id)
    }
}

const actions = {
    async submitJob(ctx, job) {
        const fileGroups = ArrayUtils.groupItems(job.files, 5)
        for (let i = 0; i < fileGroups.length; i++) {
            await datacaptureAPI.uploadData(job.sourcePath, fileGroups[i])
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

    async loadAllCaptureScripts(ctx) {
        const scripts = await datacaptureAPI.getAllCaptureScripts();
        ctx.commit('cacheCaptureScripts', scripts);
    },
    async loadCaptureScriptById(ctx, id) {
        const scripts = await datacaptureAPI.getCaptureScript(id);
        ctx.commit('cacheCaptureScripts', [scripts]);
    },
    async createCaptureScript(ctx, script) {
        const newScript = await datacaptureAPI.createCaptureScript(script);
        ctx.commit('cacheCaptureScripts', [newScript]);
        return newScript;
    },
    async updateCaptureScript(ctx, script) {
        const updatedScript = await datacaptureAPI.updateCaptureScript(script);
        ctx.commit('cacheCaptureScripts', [updatedScript]);
        return updatedScript;
    },
    async deleteCaptureScript(ctx, id) {
        await datacaptureAPI.deleteCaptureScript(id);
        ctx.commit('uncacheCaptureScript', id);
    },

    async loadAllCaptureConfigs(ctx) {
        const configs = await datacaptureAPI.getAllCaptureConfigs();
        ctx.commit('cacheCaptureConfigs', configs)
    },
    async loadCaptureConfigById(ctx, id) {
        const config = await datacaptureAPI.getCaptureConfig(id);
        ctx.commit('cacheCaptureConfigs', [config]);
    },
    async createCaptureConfig(ctx, config) {
        const newConfig = await datacaptureAPI.createCaptureConfig(config);
        ctx.commit('cacheCaptureConfigs', [newConfig]);
        return newConfig;
    },
    async updateCaptureConfig(ctx, config) {
        const updatedConfig = await datacaptureAPI.updateCaptureConfig(config);
        ctx.commit('cacheCaptureConfigs', [updatedConfig]);
        return updatedConfig;
    },
    async deleteCaptureConfig(ctx, id) {
        await datacaptureAPI.deleteCaptureConfig(id);
        ctx.commit('uncacheCaptureConfig', id);
    },
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

    cacheCaptureScripts(state, captureScripts) {
        let newCaptureScripts = [...state.captureScripts];
        captureScripts.forEach(captureScript => {
            let index = newCaptureScripts.findIndex(s => s.id == captureScript.id);
            if (index >= 0) newCaptureScripts.splice(index, 1);
            newCaptureScripts.push(captureScript);
        });
        state.captureScripts = newCaptureScripts;
    },
    uncacheCaptureScript(state, id) {
        state.captureScripts = state.captureScripts.filter(s => s.id != id);
    },

    cacheCaptureConfigs(state, configs) {
        let newCaptureConfigs = [...state.captureConfigs];
        configs.forEach(config => {
            let index = newCaptureConfigs.findIndex(c => c.id == config.id);
            if (index >= 0) newCaptureConfigs.splice(index, 1);
            newCaptureConfigs.push(config);
        });
        state.captureConfigs = newCaptureConfigs;
    },
    uncacheCaptureConfig(state, id) {
        state.captureConfigs = state.captureConfigs.filter(c => c.id != id);
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
