const demoFeatures = [
    { id: 1, name: 'Feature 1', protocolId: 1 },
    { id: 2, name: 'Feature 2', protocolId: 1 },
    { id: 3, name: 'Feature 3', protocolId: 1 },
    { id: 4, name: 'Feature 4', protocolId: 1 },
    { id: 5, name: 'Feature 5', protocolId: 1 }
]

export default {
    async getById(id) {
      console.log('Mocking a backend call...')
      await wait(100)
      return demoFeatures.find(f => f.id == id)
    },
    async getByProtocolId(protocolId) {
      console.log('Mocking a backend call...')
      await wait(100)
      return demoFeatures.filter(f => f.protocolId == protocolId)
    },
    async getByProtocolIds(protocolIds) {
      console.log('Mocking a backend call...')
      await wait(100)
      return demoFeatures.filter(f => protocolIds && protocolIds.includes(f.protocolId))
    }
}

function wait (ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
}