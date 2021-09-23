const demoResultSets = [
    { id: 1, protocolId: 1, plateId: 1, measId: 1, executionDate: new Date(), outcome: 'Error' },
    { id: 2, protocolId: 1, plateId: 1, measId: 1, executionDate: new Date(), outcome: 'OK' },
    { id: 3, protocolId: 1, plateId: 1, measId: 2, executionDate: new Date(), outcome: 'OK' }
]

function generateRandomResultData(size) {
    let data = [];
    for (var i=0; i<size; i++) {
        data.push(Math.random())
    }
    return data;
}

export default {
    async getResultSetById(id) {
        console.log('Mocking a backend call...')
        await wait(100)
        return demoResultSets.find(rs => rs.id == id)
    },
    async getAllResultSets() {
        console.log('Mocking a backend call...')
        await wait(100)
        return demoResultSets
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
}

function wait (ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}