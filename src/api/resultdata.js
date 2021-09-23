const demoResultSets = [
    { id: 1, protocolId: 1, plateId: 1, measId: 1, executionDate: new Date(), outcome: 'Error' },
    { id: 2, protocolId: 1, plateId: 1, measId: 1, executionDate: new Date(), outcome: 'OK' },
    { id: 3, protocolId: 1, plateId: 1, measId: 2, executionDate: new Date(), outcome: 'OK' }
]

export default {
    async getById(id) {
      console.log('Mocking a backend call...')
      await wait(100)
      return demoResultSets.find(rs => rs.id == id)
    },
    async getAll() {
      console.log('Mocking a backend call...')
      await wait(100)
      return demoResultSets
    }
}

function wait (ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
}