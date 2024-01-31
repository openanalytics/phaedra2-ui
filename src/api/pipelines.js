import axios from "axios";

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL) + '/pipeline-service';

export default {
    async getPipelineById(id) {
        const response = await axios.get(apiURL + '/pipeline-definitions/' + id);
        return response.data;
    },
    async getAllPipelines() {
        const response = await axios.get(apiURL + '/pipeline-definitions');
        return response.data;
    },
    async createNewPipeline(newPipeline) {
        const response = await axios.post(apiURL + '/pipeline-definitions', newPipeline);
        if (response.status === 201) return response.data;
    },
    async updatePipeline(pipeline) {
        const response = await axios.put(apiURL + '/pipeline-definitions/' + pipeline.id, pipeline);
        if (response.status === 200) return response.data;
    },
    async deletePipeline(id) {
        const response = await axios.delete(apiURL + '/pipeline-definitions/' + id);
        if (response.status === 200) return response.data;
    },
    async getPipelineExecutionById(id) {
        const response = await axios.get(apiURL + '/pipeline-executions/' + id);
        return response.data;
    },
    async getPipelineExecutionLogById(id) {
        const response = await axios.get(apiURL + '/pipeline-executions/' + id + '/log');
        return response.data;
    },
    async getAllPipelineExecutions(range) {
        const response = await axios.get(apiURL + '/pipeline-executions', {params: range});
        return response.data;
    },
    async cancelPipelineExecution(id) {
        const response = await axios.put(apiURL + '/pipeline-executions/' + id + '/cancel');
        if (response.status === 200) return response.data;
    },
}
