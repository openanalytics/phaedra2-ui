import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/curvedata-service'

export default {
    async getCurvesByPlateId(plateId) {
        const response = await axios.get(apiURL + '/curves?plateId=' + plateId)
        return response.data
    },
    async getLatestCurvesByPlateId(plateId) {
      const response = await axios.get(apiURL + '/curves/' + plateId + '/latest')
        return response.data
    },
    async getAllCurves() {
        const response = await axios.get(apiURL + '/curves')
        return response.data
    }
}
