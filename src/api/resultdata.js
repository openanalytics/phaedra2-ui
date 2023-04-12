import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/resultdata-service';

export default {
    async getResultSetById(id) {
        const response = await axios.get(`${apiURL}/resultsets/${id}`);
        return response.data;
    },
    async getResultSetsByPlateId(plateId) {
        const response = await axios.get(`${apiURL}/resultsets?plateId=${plateId}`);
        return response.data.data;
    },
    async getResultDataByResultSetId(rsId) {
        const response = await axios.get(`${apiURL}/resultsets/${rsId}/resultdata`);
        return response.data.data;
    },
    async getResultStatsByResultSetId(rsId) {
        const response = await axios.get(`${apiURL}/resultsets/${rsId}/resultfeaturestats?pageSize=1000`);
        return response.data.data;
    },
    async getLatestResultSets(count) {
        const response = await axios.get(`${apiURL}/resultsets/latest?n=${count}`);
        return response.data;
    }
}