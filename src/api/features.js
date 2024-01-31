import axios from "axios";

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL) + '/protocol-service';

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
        await axios.get(apiURL + '/features/' + id + '/featurestats')
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
        await axios.delete(apiURL + '/features/' + featureId + '/featurestats/'+featureStatId)
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
        await axios.get(apiURL + '/features/' + featureId + '/calculationinputvalues')
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async createCalculationInputValue(featureId, civ) {
        let result = null;
        await axios.post(apiURL + '/features/' + featureId + '/calculationinputvalues', civ)
            .then(response => {
                if (response.status === 201)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async updateCalculationInputValue(featureId, civ) {
        let result = null;
        await axios.put(apiURL + '/features/' + featureId + '/calculationinputvalues', civ)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async deleteCalculationInputValue(id) {
        let result = null;
        await axios.delete(apiURL + '/features/calculationinputvalues/'+id)
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
