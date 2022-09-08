import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/measurement-service';

export default {
    async getAllMeasurements() {
        const response = await axios.get(apiURL + '/meas');
        return response.data;
    },
    async getMeasurementById(id) {
        const response = await axios.get(apiURL + '/meas/' + id);
        return response.data;
    },
    async getMeasurementsByIds(ids) {
        const response = await axios.get(apiURL + '/meas/' + ids);
        return response.data;
    },
    async getWellData(measId) {
        const response = await axios.get(apiURL + '/meas/' + measId + '/welldata');
        return response.data;
    },
    async getRenderConfigs() {
        const response = await axios.get(apiURL + '/render-configs');
        return response.data;
    },
    async getRenderConfig(id) {
        const response = await axios.get(apiURL + '/render-config/' + id)
        return response.data;
    },
}
