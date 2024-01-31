import axios from "axios";

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL) + '/resultdata-service';

export default {
    async getResultSetById(id) {
        const response = await axios.get(`${apiURL}/resultsets/${id}`);
        return response.data;
    },
    async getResultSetsByPlateId(plateId) {
        const response = await axios.get(`${apiURL}/resultsets?plateId=${plateId}`);
        return response.data.data;
    },
    async getResultDataByResultSetId(rsId) {
        const response = await axios.get(`${apiURL}/resultsets/${rsId}/resultdata`);
        return response.data.data;
    },
    async getResultStatsByResultSetId(rsId) {
        const response = await axios.get(`${apiURL}/resultsets/${rsId}/resultfeaturestats?pageSize=1000`);
        return response.data.data;
    },
    async getLatestResultSets(count) {
        const response = await axios.get(`${apiURL}/resultsets/latest?n=${count}`);
        return response.data;
    },
    async getAllResults() {
        let result = [];
        await axios.get(apiURL + '/resultset', {params: {filter: {}, outcome: 'SUCCESS'}})
            .then(response => {
                if (response.status === 200)
                    result = result.concat(response.data.data);
            });
        await axios.get(apiURL + '/resultset', {params: {filter: {}, outcome: 'SCHEDULED'}})
            .then(response => {
                if (response.status === 200)
                    result = result.concat(response.data.data);
            });
        await axios.get(apiURL + '/resultset', {params: {filter: {}, outcome: 'FAILURE'}})
            .then(response => {
                if (response.status === 200)
                    result = result.concat(response.data.data);
            });
        return result;
    },
    async getRecentCalculationResults(n = 10) {
        const result = await axios.get(apiURL + '/resultset/latest', {params: {n: n}});
        if (result.status === 200)
            return result.data;
        else
            return [];
    },
    async getLatestPlateResult(plateId, measurementId) {
        let result = null;
        await axios.get(apiURL + '/plate-results/' + plateId + '/latest', {params: {measId: measurementId}})
            .then(response => {
                if (response.status === 201)
                    result = reformatPlateResults(response.data);
            });
        return result;
    },
    async getPlateResults(plateId) {
        let result = null;
        await axios.get(apiURL + '/plate-results/' + plateId)
            .then(response => {
                if (response.status === 201)
                    result = reformatPlateResults(response.data);
            });
        return result;
    },
}

/**
 * Decompose the response structure from plate-results calls into a single array of result objects.
 */
function reformatPlateResults(resultMap) {
    let plateResults = [];

    Object.keys(resultMap.protocols).forEach(protocolId => {
        let protocolBlock = resultMap.protocols[protocolId];
        Object.keys(protocolBlock.measurements).forEach(measId => {
            let measArray = protocolBlock.measurements[measId];
            measArray.forEach(meas => {
                let resultDataArray = meas.resultData;
                resultDataArray.forEach(resultData => {
                    resultData.protocolId = parseInt(protocolId);
                    resultData.measId = parseInt(measId);

                    resultData.plateStats = [];
                    resultData.wellTypeStats = [];

                    resultData.resultFeatureStats.forEach(stat => {
                        if (stat.welltype) {
                            resultData.wellTypeStats.push({
                                name: stat.statisticName,
                                welltype: stat.welltype,
                                value: stat.value
                            })
                        } else {
                            resultData.plateStats.push({
                                name: stat.statisticName,
                                value: stat.value
                            })
                        }
                    });
                    resultData.resultFeatureStats = null;

                    plateResults.push(resultData);
                });
            });
        });
    });

    return plateResults;
}
