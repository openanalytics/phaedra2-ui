import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/plate-service';

export default {
    async getPlateTemplateById(id) {
        let result = null;
        await axios.get(apiURL + '/platetemplates/' + id)
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
        await axios.get(apiURL + '/platetemplates')
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
        await axios.delete(apiURL + '/platetemplates/' + id)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async editPlateTemplate(plateTemplate) {
        let result = null;
        await axios.put(apiURL + '/platetemplates/' + plateTemplate.id, plateTemplate)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async createPlateTemplate(plateTemplate) {
        let result = null;
        await axios.post(apiURL + '/platetemplates', plateTemplate)
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
