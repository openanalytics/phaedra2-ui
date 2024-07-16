import axios from "axios"

const FormData = require('form-data')

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL) + '/datacapture-service';

export default {

    async getJobs(args) {
        const response = await axios.get(apiURL + '/jobs', {params: args});
        return response.data;
    },
    async postJob(newJob) {
        const response = await axios.post(`${apiURL}/jobs`, newJob.captureConfig, {
            params: { sourcePath:  newJob.sourcePath.replace('[','%5B').replace(']','%5D') },
            headers: { 'Content-Type': 'application/json' }
        })
        return response.data;
    },
    async cancelJob(jobId) {
        const response = await axios.post(`${apiURL}/jobs/${jobId}/cancel`);
        return response.data;
    },
    
    async uploadData(sourcePath, files) {
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i])
        }

        const response = await axios.post(apiURL + '/upload-data', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': '*/*'
            },
            params: {
                'destinationDir': sourcePath
            }
        })
        return response.data;
    },

    async getAllCaptureScripts() {
        const response = await axios.get(`${apiURL}/capture-scripts`);
        return response.data;
    },
    async getCaptureScript(id) {
        const response = await axios.get(`${apiURL}/capture-scripts/${id}`);
        return response.data;
    },
    async createCaptureScript(script) {
        const response = await axios.post(`${apiURL}/capture-scripts`, script);
        return response.data;
    },
    async updateCaptureScript(script) {
        const response = await axios.put(`${apiURL}/capture-scripts/${script.id}`, script);
        return response.data;
    },
    async deleteCaptureScript(id) {
        const response = await axios.delete(`${apiURL}/capture-scripts/${id}`);
        return response.data;
    },

    async getAllCaptureConfigs() {
        const response = await axios.get(`${apiURL}/capture-configs`);
        return response.data;
    },
    async getCaptureConfig(id) {
        const response = await axios.get(`${apiURL}/capture-configs/${id}`);
        return response.data;
    },
    async createCaptureConfig(config) {
        const response = await axios.post(`${apiURL}/capture-configs`, config);
        return response.data;
    },
    async updateCaptureConfig(config) {
        const response = await axios.put(`${apiURL}/capture-configs/${config.id}`, config);
        return response.data;
    },
    async deleteCaptureConfig(id) {
        const response = await axios.delete(`${apiURL}/capture-configs/${id}`);
        return response.data;
    },
}
