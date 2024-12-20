import {defineStore} from "pinia";
import pipelineAPI from "@/api/pipelines";
import ArrayUtils from "@/lib/ArrayUtils"
import {ref} from "vue";

export const usePipelineStore = defineStore("pipeline", () => {
        const pipeline = ref(null)
        const pipelines = ref([])
        const execution = ref(null)
        const executions = ref([])
        const executionLogs = ref({})

        const getPipelineById = (pipelineId) => {
            return pipelines.value.filter(pp => pp.id == pipelineId)[0]
        }

        const getPipelineExecutionLogById = (executionId) => {
            return executionLogs.value[executionId] || []
        }

        const loadPipeline = async (pipelineId) => {
            pipeline.value = await pipelineAPI.getPipelineById(pipelineId);
            pipelines.value = ArrayUtils.mergeBy(pipelines.value, [pipeline.value], "id");
        }

        const loadPipelines = async (ids) => {
            const distinctIds = [...new Set(ids)];
            const loadedPipelines = await Promise.all(distinctIds.map(async id => await pipelineAPI.getPipelineById(id)));
            pipelines.value = ArrayUtils.mergeBy(pipelines.value, loadedPipelines, "id");
        }

        const loadAllPipelines = async () => {
            pipelines.value = await pipelineAPI.getAllPipelines()
        }

        const createNewPipeline = async (newPipeline) => {
            await pipelineAPI.createNewPipeline(newPipeline);
            await loadAllPipelines()
        }

        const updatePipeline = async () => {
            await pipelineAPI.updatePipeline(pipeline.value);
        }

        const updatePipelineProperty = async (property, value) => {
            pipeline.value[property] = value
        }

        const deletePipeline = async (pipelineId) => {
            await pipelineAPI.deletePipeline(pipelineId)
            await reset()
        }

        const enablePipeline = async () => {
            pipeline.value.status = 'ENABLED'
        }

        const disablePipeline = async () => {
            pipeline.value.status = 'DISABLED'
        }

        const loadPipelineExecutions = async (range) => {
            executions.value = await pipelineAPI.getPipelineExecutions(range)
        }

        const loadPipelineExecutionById = async (executionId) => {
            execution.value = await pipelineAPI.getPipelineExecutionById(executionId)
            await loadPipelineExecutionLogById(executionId)
            await loadPipeline(execution.value?.pipelineId)
        }

        const loadPipelineExecutionLogById = async (executionId) => {
            executionLogs.value[executionId] = await pipelineAPI.getPipelineExecutionLogById(executionId);
        }

        const cancelPipelineExecution = async (executionId) => {
            await pipelineAPI.cancelPipelineExecution(executionId);
        }

        const reset = () => {
            pipeline.value = null
            execution.value = null
        }

        return {
            pipeline,
            pipelines,
            execution,
            executions,
            executionLogs,
            getPipelineById,
            getPipelineExecutionLogById,
            loadPipeline,
            loadPipelines,
            loadAllPipelines,
            createNewPipeline,
            updatePipeline,
            updatePipelineProperty,
            deletePipeline,
            enablePipeline,
            disablePipeline,
            loadPipelineExecutions,
            loadPipelineExecutionById,
            loadPipelineExecutionLogById,
            cancelPipelineExecution,
            reset,
        }
})
