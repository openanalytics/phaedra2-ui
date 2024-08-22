const XLSX = require('xlsx')

const exportPlateDataToXLSX = (data, experimentName) => {
  const filename = `plate_data_export_${experimentName}`
  const headers = createPlateDataHeaders(data)
  const flatData = preparePlateData(data, headers[0])
  writeWorkbook(filename,headers,flatData)
}

const exportWellDataToXLSX = (data, experimentName) => {
  const filename = `well_data_export_${experimentName}`
  const headers = createWellDataHeaders(data)
  const flatData = prepareWellData(data, headers)
  writeWorkbook(filename,headers,flatData)
}

const createPlateDataHeaders = (data)=>{
  const headers = ["Plate ID", "Barcode", "Experiment Name", "Validation Status", "Approval Status"]

  const featureNames = new Set()
  data.forEach(item => {
    item.features.forEach(feature => {
      const fColName = formatFeatureColumnName(feature)
      if (!featureNames.has(fColName)) {
        featureNames.add(fColName)
        feature.stats.forEach((fstat, index) => {
          index === 0 ? headers.push(fColName) : headers.push("")
          headers.push(fstat.name)
        })
      }
    })
  })
  return headers
}

const preparePlateData = (data, header) => {
  return data.map(item => {
    const dataRow = Array(header.length).fill('')
    dataRow[0] = item.plateId
    dataRow[1] = item.barcode
    dataRow[2] = item.experimentName
    dataRow[3] = item.validationStatus
    dataRow[4] = item.approvalStatus

    item.features.forEach(feature => {
      const fColName = formatFeatureColumnName(feature)
      const fColindex = header.findIndex(h => h === fColName)
      feature.stats.forEach((fstat, fStatIndex) => {
        dataRow[fColindex + fStatIndex] = fstat.value
      })
    })
    return dataRow
  })
}

const createWellDataHeaders = (data)=>{
  const header = ["Plate ID", "Barcode", "Experiment Name", "Validation Status", "Approval Status"]
  return [header]
}

const prepareWellData = (data, header) => {
}

const writeWorkbook = (filename, headers, data) => {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...data], { skipHeader: true })
  XLSX.utils.book_append_sheet(workbook, worksheet, filename)
  XLSX.writeFile(workbook, filename.concat(".xlsx"))
}


const formatFeatureColumnName = (feature) => {
  return feature.featureName + "(" + feature.protocolName + ")" + (feature.wellType ? "_" + feature.wellType : "")
}

module.exports = {
  exportPlateDataToXLSX,
  exportWellDataToXLSX
}




