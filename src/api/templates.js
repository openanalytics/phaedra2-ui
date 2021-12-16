import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/plate-service';

export default {
    async getPlateTemplateById(id) {
        let result = null;
        await axios.get(apiURL + '/plate-template/' + id)
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