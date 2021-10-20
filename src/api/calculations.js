import axios from "axios";

export default {
    async getAllFormulas() {
        console.log('Making a backend call to calculations service');
        let result = null;
        await axios.get('http://localhost:6040/phaedra/calculation-service/formulas')
            .then(response => {
                result = response.data;
            })
        return result;
    }
}
