import pipelineAPI from '@/api/pipelines.js'

const state = () => ({
    pipelines: [],
    executions: [],
    executionLogs: {}
})

const getters = {
    // getPipelineById: (state) => (id) => {
    //     return state.pipelines.find(pp => pp.id == id)
    // },
    // getAllPipelines: (state) => () => {
    //     return [...state.pipelines]
    // },
    // getAllPipelineExecutions: (state) => (range) => {
    //     if (range) return state.executions.filter(exec => Date.parse(exec.createdOn) >= range.from && Date.parse(exec.createdOn) <= range.to);
    //     else return [...state.executions]
    // },
    // getPipelineExecutionById: (state) => (id) => {
    //     return state.executions.find(exec => exec.id == id)
    // },
    // getPipelineExecutionLogById: (state) => (id) => {
    //     return state.executionLogs[id];
    // },
}

const actions = {
    // async loadPipelineById(ctx, id) {
    //     const pipeline = await pipelineAPI.getPipelineById(id);
    //     ctx.commit('cachePipelines', [pipeline]);
    // },
    // async loadAllPipelines(ctx) {
    //     const pipelines = await pipelineAPI.getAllPipelines();
    //     ctx.commit('cachePipelines', pipelines);
    // },
    // async createNewPipeline(ctx, newPipeline) {
    //     const createdPipeline = await pipelineAPI.createNewPipeline(newPipeline);
    //     ctx.commit('cachePipelines', [createdPipeline]);
    //     return createdPipeline;
    // },
    // async updatePipeline(ctx, pipeline) {
    //     const updatedPipeline = await pipelineAPI.updatePipeline(pipeline);
    //     ctx.commit('cachePipelines', [updatedPipeline]);
    // },
    // async deletePipeline(ctx, id) {
    //     await pipelineAPI.deletePipeline(id);
    //     ctx.commit('uncachePipeline', id);
    // },
    // async loadAllPipelineExecutions(ctx, range) {
    //     const executions = await pipelineAPI.getAllPipelineExecutions(range);
    //     ctx.commit('cachePipelineExecutions', executions);
    // },
    // async loadPipelineExecutionById(ctx, id) {
    //     const exec = await pipelineAPI.getPipelineExecutionById(id);
    //     ctx.commit('cachePipelineExecutions', [exec]);
    // },
    // async loadPipelineExecutionLogById(ctx, id) {
    //     const log = await pipelineAPI.getPipelineExecutionLogById(id);
    //     ctx.commit('cachePipelineExecutionLog', {id, log});
    // },
    // async cancelPipelineExecution(ctx, id) {
    //     await pipelineAPI.cancelPipelineExecution(id);
    //     ctx.dispatch('loadPipelineExecutionById', id);
    // },
}

const mutations = {
    // cachePipelines(state, pipelines) {
    //     let newPipelines = [...state.pipelines];
    //     pipelines.forEach(pipeline => {
    //         let index = newPipelines.findIndex(p => p.id === pipeline.id);
    //         if (index >= 0) newPipelines.splice(index, 1);
    //         newPipelines.push(pipeline);
    //     });
    //     state.pipelines = newPipelines;
    // },
    // uncachePipeline(state, id) {
    //     state.pipelines = state.pipelines.filter(p => p.id !== id)
    // },
    // cachePipelineExecutions(state, executions) {
    //     let newExecutions = [...state.executions];
    //     executions.forEach(exec => {
    //         let index = newExecutions.findIndex(p => p.id === exec.id);
    //         if (index >= 0) newExecutions.splice(index, 1);
    //         newExecutions.push(exec);
    //     });
    //     state.executions = newExecutions;
    // },
    // cachePipelineExecutionLog(state, data) {
    //     state.executionLogs[data.id] = data.log;
    // },
}

export default {
    // namespaced: true,
    // state,
    // getters,
    // actions,
    // mutations
}
