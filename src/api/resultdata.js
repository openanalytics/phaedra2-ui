import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/resultdata-service';

export default {
    async getLatestPlateResult(plateId) {
        let result = null;
        await axios.get(apiURL + '/plate-results/' + plateId + '/latest')
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
