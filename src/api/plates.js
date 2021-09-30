const demoPlates = [
    { id: 1, barcode: '111111111', experimentId: 1, description: 'This is test plate 1', rows: 16, columns: 24, createdOn: new Date(), createdBy: 'TestUser',
        tags: ['RefPlate'],
        properties: [ { key: "Prop1", value: "Value 1" }, { key: "Prop2", value: "Value 2" } ],
        measurementIds: [ 1, 2, 3 ]
    },
    { id: 2, barcode: '222222222', experimentId: 1, description: 'This is test plate 2', rows: 16, columns: 24, createdOn: new Date(), createdBy: 'TestUser' },
    { id: 3, barcode: '333333333', experimentId: 1, description: 'This is test plate 3', rows: 16, columns: 24, createdOn: new Date(), createdBy: 'TestUser' },
    { id: 4, barcode: '444444444', experimentId: 1, description: 'This is test plate 4', rows: 16, columns: 24, createdOn: new Date(), createdBy: 'TestUser' },
    { id: 5, barcode: '555555555', experimentId: 1, description: 'This is test plate 5', rows: 16, columns: 24, createdOn: new Date(), createdBy: 'TestUser' },
]

import WellUtils from "@/lib/WellUtils.js"
demoPlates.forEach(plate => {
  plate.wells = []
  for (var r = 1; r <= plate.rows; r++) {
      for (var c = 1; c <= plate.columns; c++) {
          let wellType = (c < 3) ? "NC": (c > 22 ? "PC" : "SAMPLE")
          plate.wells.push({
              nr: WellUtils.getWellNr(r, c, plate.columns),
              row: r,
              column: c,
              wellType: wellType,
              substance: (wellType === "SAMPLE") ? { type: "Compound", name: "C-" + r, concentration: Math.random() * 0.0001 } : {},
              status: ((Math.random() < 0.9) ? "ACCEPTED" : "REJECTED")
          })
      }
  }
})

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