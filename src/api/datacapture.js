import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/datacapture-service';

export default {
    async getAllJobs() {
        let result = null;
        await axios.get(apiURL + '/jobs')
            .then(response => {
                result = response.data;
            })
        return result;
    },
    async postJob(newJob) {
        const response = await axios.post(apiURL + '/jobs', newJob.captureConfig, {
            params: { sourcePath: newJob.sourcePath },
            headers: { 'Content-Type': 'application/json' }
        })
        return response.data;
    }
}
