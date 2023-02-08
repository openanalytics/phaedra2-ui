import pipelineAPI from '@/api/pipelines.js'

const state = () => ({
    pipelines: []
})

const getters = {
    getPipelineById: (state) => (id) => {
        return state.pipelines.find(pp => pp.id == id)
    },
    getAllPipelines: (state) => () => {
        return [...state.pipelines]
    }
}

const actions = {
    async loadPipelineById(ctx, id) {
        const pipeline = await pipelineAPI.getPipelineById(id);
        ctx.commit('cachePipelines', [pipeline]);
    },
    async loadAllPipelines(ctx) {
        const pipelines = await pipelineAPI.getAllPipelines();
        ctx.commit('cachePipelines', pipelines);
    },
    async createNewPipeline(ctx, newPipeline) {
        const createdPipeline = await pipelineAPI.createNewPipeline(newPipeline);
        ctx.commit('cachePipelines', [createdPipeline]);
        return createdPipeline;
    },
    async updatePipeline(ctx, pipeline) {
        const updatedPipeline = await pipelineAPI.updatePipeline(pipeline);
        ctx.commit('cachePipelines', [updatedPipeline]);
    },
    async deletePipeline(ctx, id) {
        await pipelineAPI.deletePipeline(id);
        ctx.commit('uncachePipeline', id);
    },
}

const mutations = {
    cachePipelines (state, pipelines) {
        let newPipelines = [...state.pipelines];
        pipelines.forEach(pipeline => {
            let index = newPipelines.findIndex(p => p.id === pipeline.id);
            if (index >= 0) newPipelines.splice(index, 1);
            newPipelines.push(pipeline);
        });
        state.pipelines = newPipelines;
    },
    uncachePipeline(state, id) {
        state.pipelines = state.pipelines.filter(p => p.id !== id)
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
