import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/datacapture-service';

export default {
    async getJobs(args) {
        let result = null;
        await axios.get(apiURL + '/jobs', {params: args})
            .then(response => {
                result = response.data;
            })
        return result;
    },
    async postJob(newJob) {
        const response = await axios.post(apiURL + '/job', newJob.captureConfig, {
            params: { sourcePath: newJob.sourcePath },
            headers: { 'Content-Type': 'application/json' }
        })
        return response.data;
    },
    async cancelJob(jobId) {
        const response = await axios.post(apiURL + '/cancel',{id: jobId})
        return response.data;
    },
    async getCaptureJobConfig(args) {
        let result = null;
        await axios.get(apiURL + '/job/config', {params: {id: args}})
            .then(response => {
                result = response.data;
            })
        return result;
    },
}
