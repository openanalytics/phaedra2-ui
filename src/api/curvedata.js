import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/curvedata-service'

export default {
    async getCurvesByPlateId(plateId) {
        const response = await axios.get(apiURL + '/curve?plateId=' + plateId)
        return response.data;
    },
    async getAllCurves() {
        const response = await axios.get(apiURL + '/curve')
        return response.data;
    }
}
