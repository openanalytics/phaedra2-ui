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
    },
    async getAllPlateTemplates() {
        let result = null
        await axios.get(apiURL + '/plate-templates')
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async deletePlateTemplate(id) {
        let result = null;
        await axios.delete(apiURL + '/plate-template/' + id)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async editPlateTemplate(args) {
        let result = null;
        await axios.put(apiURL + '/plate-template', args)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async createPlateTemplate(newPlateTemplate) {
        let result = null;
        await axios.post(apiURL + '/plate-template', newPlateTemplate)
            .then(response => {
                if (response.status === 201)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    }
}