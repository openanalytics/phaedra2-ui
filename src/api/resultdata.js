import axios from "axios";

// const demoResultSets = [
//     {id: 1, protocolId: 1, plateId: 1, measId: 1, executionDate: new Date(), outcome: 'Error'},
//     {id: 2, protocolId: 1, plateId: 1, measId: 1, executionDate: new Date(), outcome: 'OK'},
//     {id: 3, protocolId: 1, plateId: 1, measId: 2, executionDate: new Date(), outcome: 'OK'}
// ]
//
// const demoStatNames = {
//     plateLevel: ['zprime', 'min', 'mean', 'max'],
//     wellTypeLevel: ['sb', 'sn', '%cv']
// }

// function generateRandomStatValue() {
//     return Math.random()
// }

function generateRandomResultData(size) {
    let data = [];
    for (var i = 0; i < size; i++) {
        data.push(Math.random())
    }
    return data
}

export default {
    async getResultSetById(id) {
        console.log('Mocking a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6050/phaedra/resultdata-service/resultset/' + id;
        await axios.get(requestUrl)
            .then(response => {
                if (response.status === 201)
                    result = response.data;
            });
        return result;
    },
    async getResultSetsByPlateIds(plateIds) {
        console.log('Mocking a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6050/phaedra/resultdata-service/resultset/' + plateIds;
        await axios.get(requestUrl)
            .then(response => {
                if (response.status === 201)
                    result = response.data;
            });
        return result;
    },
    async getAllResultSets() {

        // console.log('Mocking a backend call...')
        // await wait(100)
        // return demoResultSets
    },
    async getResultDataById(resultSetId, featureId) {
        console.log('Mocking a backend call...')
        await wait(500)
        return {
            resultSetId: resultSetId,
            featureId: featureId,
            values: generateRandomResultData(384)
        }
    },
    async getStatsByResultSetIds(resultSetIds, featureIds) {
        console.log('Mocking a backend call...')
        // await wait(500)
        let allStats = []
        resultSetIds.forEach(rs => {
            featureIds.forEach(fId => {
                let stats = {
                    resultSetId: rs,
                    featureId: fId,
                    plateLevelStats: [],
                    wellTypeLevelStats: []
                }
                // demoStatNames.plateLevel.forEach(stat => {
                //     stats.plateLevelStats.push({
                //         name: stat,
                //         value: generateRandomStatValue()
                //     })
                // })
                // demoStatNames.wellTypeLevel.forEach(stat => {
                //     let wellTypes = ['LC', 'SAMPLE', 'HC']
                //     wellTypes.forEach(wt => {
                //         stats.wellTypeLevelStats.push({
                //             name: stat,
                //             wellType: wt,
                //             value: generateRandomStatValue()
                //         })
                //     })
                // })
                allStats.push(stats)
            })
        })
        return allStats
    },
    async getLatestPlateResult(plateId) {
        let result = null;
        const requestUrl = 'http://localhost:6050/phaedra/resultdata-service/plate-results/' + plateId + '/latest';
        await axios.get(requestUrl)
            .then(response => {
                if (response.status === 201)
                    result = response.data;
            });
        return result;
    }
}

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
