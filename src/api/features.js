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
    async getAllDefaultFeatureStats() {
        const response = await axios.get(apiURL + '/defaultfeaturestats');
        return response.data;
    },
    async createDefaultFeatureStat(featureStat) {
        const response = await axios.post(apiURL + '/defaultfeaturestats', featureStat);
        return response.data;
    },
    async updateDefaultFeatureStat(featureStat) {
        const response = await axios.put(apiURL + '/defaultfeaturestats/' + featureStat.id, featureStat);
        return response.data;
    },
    async deleteDefaultFeatureStat(featureStatId) {
        await axios.delete(apiURL + '/defaultfeaturestats/' + featureStatId);
    },
    async getFeatureStats(featureId) {
        const response = await axios.get(`${apiURL}/features/${featureId}/featurestats`);
        return response.data;
    },
    async createFeatureStat(featureId, featureStat) {
        const response = await axios.post(`${apiURL}/features/${featureId}/featurestats`, featureStat);
        return response.data;
    },
    async updateFeatureStat(featureStat) {
        const response = await axios.put(`${apiURL}/features/${featureStat.featureId}/featurestats/${featureStat.id}`, featureStat);
        return response.data;
    },
    async deleteFeatureStat(featureId, featureStatId) {
        await axios.delete(`${apiURL}/features/${featureId}/featurestats/${featureStatId}`);
    },
}
