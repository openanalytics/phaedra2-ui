const demoProtocols = [
    { id: 1, name: 'Protocol X', version: 'v1.2' },
    { id: 2, name: 'Protocol Y', version: 'v1.0' },
    { id: 3, name: 'Protocol Z', version: 'v2.0' }
]

export default {
    async getProtocolById(id) {
      console.log('Mocking a backend call...')
      await wait(100)
      return demoProtocols.find(protocol => protocol.id == id)
    },
    async getAllProtocols() {
      console.log('Mocking a backend call...')
      await wait(100)
      return demoProtocols
    }
}

function wait (ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
}