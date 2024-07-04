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
        let imageUrl = `${apiURL}/measurements/${measId}/images/${wellNr}`;
        
        let additionalChannelConfigs = null;
        if (channels) {
            if (typeof channels === "string") {
                // Assume it's a pre-formatted string of channel names
                imageUrl += `/${channels}`;
            } else if (Array.isArray(channels) && channels.length > 0) {
                if (typeof channels[0] === "string") {
                    const channelNames = channels.join(',');
                    imageUrl += `/${channelNames}`;
                } else {
                    // It's an array of channel objects
                    const channelNames = channels.map(ch => ch.name).join(',');
                    imageUrl += `/${channelNames}`;
                    additionalChannelConfigs = channels;
                }
            }
        }

        imageUrl += `?scale=${scale}`;
        if (renderConfigId) imageUrl += `&renderConfigId=${renderConfigId}`;
        
        if (additionalChannelConfigs) {
            for (const cfg of additionalChannelConfigs) {
                imageUrl += `&channel=(name=${cfg.name},contrast=${cfg.contrastMin}-${cfg.contrastMax})`;
            }
        }

        const response = await axios.get(imageUrl, {
            responseType: 'blob'
        });
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
