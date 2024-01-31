import axios from "axios";

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL) + '/plate-service';

export default {
    async getExperimentById(id) {
        const response = await axios.get(`${apiURL}/experiments/${id}`);
        if (response.status === 200) return response.data;
    },
    async getRecentExperiments() {
        const response = await axios.get(`${apiURL}/experiments`);
        if (response.status === 200) return response.data;
    },
    async createExperiment(newExperiment) {
        const response = await axios.post(`${apiURL}/experiments`, newExperiment);
        if (response.status === 201) return response.data;
    },
    async editExperiment(experiment) {
        const response = await axios.put(`${apiURL}/experiments/${experiment.id}`, experiment);
        if (response.status === 200) return response.data;
    },
    async deleteExperiment(id) {
        const response = await axios.delete(`${apiURL}/experiments/${id}`);
        if (response.status === 200) return response.data;
    },

    async getExperimentsByProjectId(id) {
        const response = await axios.get(`${apiURL}/projects/${id}/experiments`);
        if (response.status === 200) return response.data;
    },
    async getExperimentSummariesByProjectId(id) {
        const response = await axios.get(`${apiURL}/projects/${id}/experimentsummaries`);
        return response.data;
    },
}