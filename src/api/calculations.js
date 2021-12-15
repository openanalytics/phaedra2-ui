import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/calculation-service';

export default {
    async getAllFormulas() {
        let result = null;
        await axios.get(apiURL + '/formulas')
            .then(response => {
                result = response.data;
            }).catch(function (error) {
                console.error(error);
            })
        return result;
    },
    async startCalculation(cal) {
        console.log('Making a backend call to calculations service');
        let result = null;
        const requestUrl = 'http://localhost:6040/phaedra/calculation-service/calculation'
        await axios.post(requestUrl,cal)
            .then(response => {
                result = response.data;
            })
        return result;
    }
}
