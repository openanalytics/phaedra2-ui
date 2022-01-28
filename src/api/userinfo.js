import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL.replace('api/v1', 'userinfo');

export default {
    async getUserInfo() {
        const response = await axios.get(apiURL);
        return response.data;
    }
}
