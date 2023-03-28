import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/measurement-service';

export default {
    async getAllMeasurements() {
        const response = await axios.get(`${apiURL}/measurements`);
        return response.data;
    },
    async getMeasurementById(id) {
        const response = await axios.get(`${apiURL}/measurements/${id}`);
        return response.data;
    },
    async getMeasurementsByIds(ids) {
        const response = await axios.get(`${apiURL}/measurements/${ids}`);
        return response.data;
    },
    async getWellData(measId) {
        const response = await axios.get(`${apiURL}/measurements/${measId}/welldata`);
        return response.data;
    },

    async getRenderConfigs() {
        const response = await axios.get(`${apiURL}/renderconfigurations`);
        return response.data;
    },
    async getRenderConfig(id) {
        const response = await axios.get(`${apiURL}/renderconfigurations/${id}`)
        return response.data;
    },
    async createRenderConfig(newConfig) {
        try {
            const response = await axios.post(`${apiURL}/renderconfigurations`, newConfig);
            if (response.status === 201) return response.data;
        } catch (err) {
            console.log(err);
        }
    },
    async updateRenderConfig(newConfig) {
        const response = await axios.put(`${apiURL}/renderconfigurations/${newConfig.id}`, newConfig);
        return response.data;
    },
    async deleteRenderConfig(id) {
        await axios.delete(`${apiURL}/renderconfigurations/${id}`);
    },

    async getMeasImage(measId, wellNr, scale) {
        let renderConfigId = 4;
        const response = await axios.get(`${apiURL}/measurements/${measId}/images/${wellNr}?renderConfigId=${renderConfigId}&scale=${scale}`, {
            responseType: 'arraybuffer'
        });
        // Return as a base64-encoded string that can be used directly in img tags
        return 'data:image/jpeg;base64,' + Buffer.from(response.data, 'binary').toString('base64');
    },
}
