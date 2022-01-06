import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/protocol-service';

export default {
    async getByIds(ids) {
        try {
            const idsString = ids.join(",");
            const response = await axios.get(apiURL + `/features?ids=${idsString}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    async getByProtocolId(protocolId) {
        let result = null;
        await axios.get(apiURL + '/protocols/' + protocolId + '/features')
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async createFeature(newFeature) {
        let result = null;
        await axios.post(apiURL + '/features', newFeature)
            .then(response => {
                if (response.status === 201) {
                    console.log('here',response.data)
                    result = response.data
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        return result
    },
    async deleteFeature(featureId) {
        let result = null;
        await axios.delete(apiURL + '/features/' + featureId)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async editFeature(feature) {
        let result = null;
        await axios.put(apiURL + '/features/', feature)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async getFeatureStatsByFeatureId(id) {
        let result = null;
        await axios.get(apiURL + '/features/' + id + '/featurestat')
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async deleteFeatureStat(featureId, featureStatId) {
        let result = null;
        await axios.delete(apiURL + '/features/' + featureId + '/featurestat/'+featureStatId)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async getCalculationInputValue(featureId) {
        let result = null;
        await axios.get(apiURL + '/features/' + featureId + '/calculationinputvalue')
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async CalculationInputValue(featureId) {
        let result = null;
        await axios.get(apiURL + '/features/' + featureId + '/calculationinputvalue')
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
}
