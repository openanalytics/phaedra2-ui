import axios from "axios";

export default {
    async getAllFormulas() {
        console.log('Making a backend call to calculations service');
        let result = null;
        const requestUrl = 'http://localhost:6040/phaedra/calculation-service/formulas'
        await axios.get(requestUrl)
            .then(response => {
                result = response.data;
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
