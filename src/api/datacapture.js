import axios from "axios"
import ArrayUtils from "@/lib/ArrayUtils"

const fs = require('fs')
const path = require('path')
const FormData = require('form-data')

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
            params: { sourcePath:  newJob.sourcePath },
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
    async uploadData(sourcePath, files) {
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i])
        }

        const response = await axios.post(apiURL + '/upload-data', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': '*/*'
            },
            params: {
                'destinationDir': sourcePath
            }
        })
        return response.data;
    },
    async getAllCaptureConfigurations() {
        const response = await axios.get(apiURL + '/capture-configs')
        return response.data
    },
    async getCaptureConfiguration(configName) {
        const response = await axios.get(apiURL + '/capture-config', {params: {name: configName}})
        return response.data
    }
}
