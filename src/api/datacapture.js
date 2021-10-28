import axios from "axios";

export default {
    async getAllJobs() {
        console.log('Making a backend call...');
        let result = null;
        await axios.get('http://localhost:6060/phaedra/datacapture/jobs')
            .then(response => {
                result = response.data;
            })
        return result;
    }
}
