const demoPlates = [
    { id: 1, barcode: '111111111', experimentId: 1, description: 'This is test plate 1', rows: 16, columns: 24, createdOn: new Date(), createdBy: 'TestUser',
        tags: ['RefPlate'],
        properties: [ { key: "Prop1", value: "Value 1" }, { key: "Prop2", value: "Value 2" } ]
    },
    { id: 2, barcode: '222222222', experimentId: 1, description: 'This is test plate 2', rows: 16, columns: 24, createdOn: new Date(), createdBy: 'TestUser' },
    { id: 3, barcode: '333333333', experimentId: 1, description: 'This is test plate 3', rows: 16, columns: 24, createdOn: new Date(), createdBy: 'TestUser' },
    { id: 4, barcode: '444444444', experimentId: 1, description: 'This is test plate 4', rows: 16, columns: 24, createdOn: new Date(), createdBy: 'TestUser' },
    { id: 5, barcode: '555555555', experimentId: 1, description: 'This is test plate 5', rows: 16, columns: 24, createdOn: new Date(), createdBy: 'TestUser' },
]

export default {
    async getPlateById(id) {
      console.log('Mocking a backend call...')
      await wait(100)
      return demoPlates.find(plate => plate.id == id)
    },
    async getPlatesByExperimentId(id) {
      console.log('Mocking a backend call...')
      await wait(1000)
      return demoPlates.filter(plate => plate.experimentId == id)
    }
}

function wait (ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
}