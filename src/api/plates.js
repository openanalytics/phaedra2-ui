import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/plate-service';

export default {
    async getPlateById(id) {
        try {
            const response = await axios.get(apiURL + '/plates/' + id);
            if (response.status === 200) return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    async getPlatesByExperimentId(id) {
        try {
            const response = await axios.get(apiURL + '/experiments/' + id + '/plates');
            if (response.status === 200) return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    async getPlateMeasurementsByPlateId(plateId) {
        try {
            const response = await axios.get(apiURL + '/plates/' + plateId + '/measurements');
            if (response.status === 200) return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    async addPlate(plate) {
        const response = await axios.post(apiURL + '/plates', plate);
        return response.data;
    },
    async deletePlateById(plateId) {
        try {
            const response = await axios.delete(apiURL + '/plates/' + plateId);
            if (response.status === 200) return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    async editPlate(newPlate) {
        try {
            const response = await axios.put(apiURL + '/plates', newPlate);
            if (response.status === 200) return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    async linkMeasurement(plateId, measurement) {
        try {
            const response = await axios.post(apiURL + '/plates/' + plateId + '/measurements', measurement);
            if (response.status === 201) return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    async setActivePlateMeasurement(plateMeasurement) {
        const endpoint = apiURL + '/plates/' + plateMeasurement.plateId + '/measurements/' + plateMeasurement.measurementId;
        const response = await axios.put(endpoint, plateMeasurement);
        return response.data;
    },
    async linkPlate(plateId, plateTemplateId) {
        const endpoint = apiURL + '/plates/' + plateId + '/link/' + plateTemplateId;
        const response = await axios.put(endpoint);
        return response.data;
    }
}
