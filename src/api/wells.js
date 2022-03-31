import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/plate-service';

export default {
    async getWellsByPlateId(plateId) {
        try {
            const response = await axios.get(apiURL + '/plate/' + plateId + '/wells');
            if (response.status === 200) return response.data;
        } catch (error) {
            console.log(error);
        }
    }
}