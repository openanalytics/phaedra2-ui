import {defineStore} from "pinia";
import pipelineAPI from "@/api/pipelines";

export const usePipelineStore = defineStore("pipeline", {
    state: () => ({
        pipeline: null,
        pipelines: [],
        execution: null,
        executions: [],
        executionLogs: {}
    }),
    getters: {
        getPipelineById: (state) => {
            return (pipelineId) => state.pipelines.filter(pp => pp.id == pipelineId)[0]
        },
        getPipelineExecutionLogById: state => {
            return (executionId) => state.executionLogs[executionId]
        }
    },
    actions: {
        async loadPipeline(pipelineId) {
            this.pipeline = await pipelineAPI.getPipelineById(pipelineId)
        },
        async loadAllPipelines() {
            this.pipelines = await pipelineAPI.getAllPipelines()
        },
        async createNewPipeline(newPipeline) {
            await pipelineAPI.createNewPipeline(newPipeline);
            await this.loadAllPipelines()
        },
        async updatePipeline(pipeline) {
            this.pipeline = await pipelineAPI.updatePipeline(pipeline);
        },
        async updatePipelineProperty(property, value) {
            this.pipeline[property] = value
            await this.updatePipeline(this.pipeline)
        },
        async deletePipeline(pipelineId) {
            await pipelineAPI.deletePipeline(pipelineId)
            this.reset()
        },
        async enablePipeline() {
            this.pipeline.status = 'ENABLED'
            await this.updatePipeline(this.pipeline)
        },
        async disablePipeline() {
            this.pipeline.status = 'DISABLED'
            await this.updatePipeline(this.pipeline)
        },
        async loadAllPipelineExecutions(range) {
            this.executions = await pipelineAPI.getAllPipelineExecutions(range)
        },
        async loadPipelineExecutionById(executionId) {
            this.execution = await pipelineAPI.getPipelineExecutionById(executionId)
            await this.loadPipelineExecutionLogById(executionId)
            await this.loadPipeline(this.execution?.pipelineId)
        },
        async loadPipelineExecutionLogById(executionId) {
            this.executionLogs[executionId] = await pipelineAPI.getPipelineExecutionLogById(executionId);
        },
        async cancelPipelineExecution(executionId) {
            await pipelineAPI.cancelPipelineExecution(executionId);
        },
        reset() {
            this.pipeline = null
            this.execution = null
        }
    }
})
