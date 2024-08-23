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
        try {
            const response = await axios.put(apiURL + '/pipeline-definitions/' + pipeline.id, pipeline);
            if (response.status === 200) return response.data;
        } catch (error) {
            if (error.response) {
                /**
                 * Request made and server responded
                 * TODO: make the handling more detailed.
                 * TODO: Multiple different reasons for response status 400 exists at the server side
                 */
                if(error.response.status === 400) {
                    const response = await axios.get(apiURL + '/pipeline-definitions/' + pipeline.id);
                    return response.data
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        }


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
    async getPipelineExecutions(range) {
        const response = await axios.get(apiURL + '/pipeline-executions', {params: range});
        return response.data;
    },
    async cancelPipelineExecution(id) {
        const response = await axios.put(apiURL + '/pipeline-executions/' + id + '/cancel');
        if (response.status === 200) return response.data;
    },
    async postMessage(message) {
        const response = await axios.post(apiURL + '/pipeline-admin/message', message.body, {
            params: { topic: message.topic, key: message.key },
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.status === 200) return response.data;
    },
}
