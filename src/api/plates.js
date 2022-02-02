import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/plate-service';

export default {
    async getPlateById(id) {
        let result = null;
        await axios.get(apiURL + '/plate/' + id)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
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
        let result = null;
        await axios.get(apiURL + '/plate/' + plateId + '/measurements')
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            });
        return result;
    },
    async linkMeasurement(plateId, measurement) {
        const response = await axios.post(apiURL + '/plate/' + plateId + '/measurement', measurement);
        return response.data;
    },
    async addPlate(plate) {
        const response = await axios.post(apiURL + '/plate', plate)
        const newPlate = response.data
        return newPlate
    },
    async deletePlateById(plateId) {
        let result = null;
        await axios.delete(apiURL + '/plate/' + plateId)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async editPlate(newPlate) {
        let result = null;
        await axios.put(apiURL + '/plate', newPlate)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    }

}
