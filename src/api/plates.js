import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/plate-service';

export default {
    async getPlateById(id) {
        try {
            const response = await axios.get(apiURL + '/plate/' + id);
            if (response.status === 200) return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    async getPlatesByExperimentId(id) {
        try {
            const response = await axios.get(apiURL + '/experiment/' + id + '/plates');
            if (response.status === 200) return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    async getPlateMeasurementsByPlateId(plateId) {
        try {
            const response = await axios.get(apiURL + '/plate/' + plateId + '/measurements');
            if (response.status === 200) return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    async addPlate(plate) {
        const response = await axios.post(apiURL + '/plate', plate);
        return response.data;
    },
    async deletePlateById(plateId) {
        try {
            const response = await axios.delete(apiURL + '/plate/' + plateId);
            if (response.status === 200) return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    async editPlate(newPlate) {
        try {
            const response = await axios.put(apiURL + '/plate', newPlate);
            if (response.status === 200) return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    async linkMeasurement(plateId, measurement) {
        try {
            const response = await axios.post(apiURL + '/plate/' + plateId + '/measurement', measurement);
            if (response.status === 201) return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    async setActivePlateMeasurement(plateMeasurement) {
        const endpoint = apiURL + '/plate/' + plateMeasurement.plateId + '/measurement/' + plateMeasurement.measurementId;
        const response = await axios.put(endpoint, plateMeasurement);
        return response.data;
    },
    async linkPlate(plateId, plateTemplateId) {
        const endpoint = apiURL + '/plate/' + plateId + '/link/' + plateTemplateId;
        const response = await axios.put(endpoint);
        return response.data;
    }
}
