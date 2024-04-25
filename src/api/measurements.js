import axios from "axios";

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL) + '/measurement-service';

export default {
    async getAllMeasurements(range) {
        const response = await axios.get(`${apiURL}/measurements`, {params: range});
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

    async getMeasImage(measId, wellNr, renderConfigId, channels, scale = 1.0) {
        // responseType: 'arraybuffer'
        let imageUrl = `${apiURL}/measurements/${measId}/images/${wellNr}?renderConfigId=${renderConfigId}&scale=${scale}`
        if (channels)
            imageUrl = `${apiURL}/measurements/${measId}/images/${wellNr}/${channels}?renderConfigId=${renderConfigId}&scale=${scale}`
        const response = await axios.get(imageUrl, {
            responseType: 'blob'
        });
        // Return as a base64-encoded string that can be used directly in img tags
        // return 'data:image/jpeg;base64,' + Buffer.from(response.data, 'binary').toString('base64');
        return URL.createObjectURL(response.data)
    },
    async getSubWellData(measId, wellNr, subWellColumns) {
        const subWellData = {}
        for (const swColumn of subWellColumns) {
            const response = await axios.get(`${apiURL}/measurements/${measId}/subwelldata/${swColumn}/${wellNr}`)
            subWellData[swColumn] = response.data
        }
        return subWellData;
    },
    async getUniqueWellDataColumns() {
        try {
            const response = await axios.get(`${apiURL}/measurements/welldata/columns`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    },
    async getUniqueSubWellDataColumns() {
        try {
            const response = await axios.get(`${apiURL}/measurements/subwelldata/columns`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
}
