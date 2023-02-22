import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/pipeline-service';

export default {
    async getPipelineById(id) {
        const response = await axios.get(apiURL + '/pipeline/' + id);
        return response.data;
    },
    async getAllPipelines() {
        const response = await axios.get(apiURL + '/pipelines');
        return response.data;
    },
    async createNewPipeline(newPipeline) {
        const response = await axios.post(apiURL + '/pipeline', newPipeline);
        if (response.status === 201) return response.data;
    },
    async updatePipeline(pipeline) {
        const response = await axios.put(apiURL + '/pipeline', pipeline);
        if (response.status === 200) return response.data;
    },
    async deletePipeline(id) {
        const response = await axios.delete(apiURL + '/pipeline/' + id);
        if (response.status === 200) return response.data;
    },
    async getPipelineExecutionById(id) {
        const response = await axios.get(apiURL + '/execution/' + id);
        return response.data;
    },
    async getPipelineExecutionLogById(id) {
        const response = await axios.get(apiURL + '/execution/' + id + '/log');
        return response.data;
    },
    async getAllPipelineExecutions(range) {
        const response = await axios.get(apiURL + '/executions', {params: range});
        return response.data;
    },
    async cancelPipelineExecution(id) {
        const response = await axios.put(apiURL + '/execution/' + id + '/cancel');
        if (response.status === 200) return response.data;
    },
}
