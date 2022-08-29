import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/measurement-service';

export default {
    async getAllMeasurements() {
        let result = null;
        await axios.get(apiURL + '/meas')
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            });
        return result;
    },
    async getMeasurementById(id) {
        let result = null;
        await axios.get(apiURL + '/meas/' + id)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            });
        return result;
    },
    async getMeasurementsByIds(ids) {
        let result = null;
        await axios.get(apiURL + '/meas/' + ids)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            });
        return result;
    },
    async getWellData(measId) {
        let result = null;
        await axios.get(apiURL + '/meas/' + measId + '/welldata')
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            });
        return result;
    },
    async getRenderConfig(id) {
        let result = null;
        await axios.get(apiURL + '/render-config/' + id)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            });
        return result;
    },
}
