export const projectsQueries = {
  projects: `
      query getProjects($projectIds: [ID]) {
        projects:getProjects(projectIds: $projectIds) {
          id
          name
          description
          createdOn
          createdBy
          tags
        }
      }
  `,
  projectById: `
      query projectById($projectId: ID) {
        project:getProjectById(projectId: $projectId) {
          id
          name
          description
          tags
          properties {
            propertyName
            propertyValue
          }
          access {
            id
            teamName
            accessLevel
          }
          createdOn
          createdBy
          updatedOn
          updatedBy
        }
        experiments:getExperimentsByProjectId(projectId: $projectId) {
          id
          projectId
          name
          description
          status
          tags
          summary {
            nrPlates
            nrPlatesLinkedLayout
            nrPlatesApproved
            nrPlatesCalculated
            nrPlatesValidated
          }
          createdOn
          createdBy
          updatedOn
          updatedBy
        }
      }
  `,
  nMostRecentlyUpdatedProjects: `
      query getNMostRecentlyUpdatedProjects($n: Int) {
        projects:getNMostRecentlyUpdatedProjects(n: $n) {
            id
            name
            description
            createdOn
            createdBy
            tags
        }
      }
    `,
  experiments: `
      query getExperimentById($experimentIds: [ID]) {
        experiments:getExperimentById(experimentIds: $experimentIds) {
          id
          name
          projectId
          description
          status
          tags
          createdOn
          createdBy
          updatedOn
          updatedBy
        }
      }
    `,
  experimentById: `
      query experimentById($experimentId: ID) {
        experiment:getExperimentById(experimentId: $experimentId) {
          id
          name
          projectId
          description
          status
          tags
          properties {
            propertyName
            propertyValue
          }
          createdOn
          createdBy
          updatedOn
          updatedBy
        }

        plates:getPlatesByExperimentId(experimentId: $experimentId) {
          id
          experimentId
          barcode
          description
          linkStatus
          linkTemplateName
          calculationStatus
          calculationError
          calculatedOn
          validationStatus
          validatedOn
          approvalStatus
          approvedOn
          rows
          columns
          tags
          createdOn
          createdBy
          updatedOn
          updatedBy
        }
      }
    `,
  experimentsByProjectId: `
      query getExperimentsByProjectId {
        experiments:getExperimentsByProjectId(projectId: $projectId) {
          id
          projectId
          name
          description
          status
          tags
          createdOn
          createdBy
          updatedOn
          updatedBy
        }
      }
    `,
  plates: `
      query getPlateById($plateIds: [ID]) {
        plate:getPlateById(plateIds: $plateIds) {
          id
          barcode
          description
          experimentId
          rows
          columns
          sequence
          linkStatus
          linkSource
          linkTemplateId
          linkTemplateName
          linkedOn
          calculationStatus
          calculationError
          calculatedBy
          calculatedOn
          validationStatus
          validatedBy
          validatedOn
          invalidatedReason
          approvalStatus
          approvedBy
          approvedOn
          disapprovedReason
          uploadStatus
          uploadedBy
          uploadedOn
          createdOn
          createdBy
          updatedOn
          updatedBy
          tags
        }
      }
    `,
  plateById: `
        query getPlateById($plateId: ID) {
            plate:getPlateById(plateId: $plateId) {
                id
                barcode
                description
                experimentId
                rows
                columns
                sequence
                linkStatus
                linkSource
                linkTemplateId
                linkTemplateName
                linkedOn
                calculationStatus
                calculationError
                calculatedBy
                calculatedOn
                validationStatus
                validatedBy
                validatedOn
                invalidatedReason
                approvalStatus
                approvedBy
                approvedOn
                disapprovedReason
                uploadStatus
                uploadedBy
                uploadedOn
                createdOn
                createdBy
                updatedOn
                updatedBy
                tags
                properties {
                    propertyName
                    propertyValue
                }
            }

            wells:getPlateWells(plateId: $plateId) {
                id
                plateId
                wellNr
                row
                column
                wellType
                status
                description
                wellSubstance {
                    id
                    wellId
                    type
                    name
                    concentration
                }
                plate {
                  id
                  barcode
                  rows
                  columns
                }
            }
        }
    `,
  platesByExperimentIds: `
        query getPlatesByExperimentIds($experimentIds: [ID]) {
            plate:getPlatesByExperimentIds(experimentIds: $experimentIds) {
                id
                barcode
                description
                experimentId
                experiment {
                    id
                    name
                }
                rows
                columns
                sequence
                linkStatus
                linkSource
                linkTemplateId
                linkTemplateName
                linkedOn
                calculationStatus
                calculationError
                calculatedBy
                calculatedOn
                validationStatus
                validatedBy
                validatedOn
                invalidatedReason
                approvalStatus
                approvedBy
                approvedOn
                disapprovedReason
                uploadStatus
                uploadedBy
                uploadedOn
                createdOn
                createdBy
                updatedOn
                updatedBy
                tags
            }
        }
    `,
  wells: `
        query wells($wellIds: [ID]) {
            wells:getWells(wellIds: $wellIds) {
                id,
                plateId,
                row,
                column,
                wellNr,
                wellType,
                status,
                description,
                wellSubstance {
                    type,
                    name
                },
                tags,
                properties {
                    propertyName,
                    propertyValue
                }
            }
        }
    `,
  wellById: `
        query getWellById($wellId: ID) {
            well:getWellById(wellId: $wellId) {
                id,
                plateId,
                row,
                column,
                wellNr,
                wellType,
                status,
                description,
                wellSubstance {
                    type,
                    name,
                    concentration
                },
                tags,
                properties {
                    propertyName,
                    propertyValue
                }
            }
        }
    `,
  wellsByPlateId: `
        query getPlateWells($plateId: ID) {
            wells:getPlateWells(plateId: $plateId) {
                id
                plateId
                row
                column
                wellType
                status
                description
                wellSubstance {
                    id
                    wellId
                    type
                    name
                    concentration
                }
            }
        }
    `,
  wellsByPlateIds: `
        query getWellsByPlateIds($plateIds: [ID]) {
            wells:getWellsByPlateIds(plateIds: $plateIds) {
                id
                plateId
                plate {
                    id
                    barcode
                }
                row
                column
                wellType
                status
                description
                wellSubstance {
                    id
                    wellId
                    type
                    name
                    concentration
                }
            }
        }
    `,
  measurementsByPlateId: `
        query getMeasurementsByPlateId($plateId: ID) {
            plateMeasurements:getMeasurementsByPlateId(plateId: $plateId) {
                measurementId
                plateId
                active
                linkedBy
                linkedOn

                name
                barcode
                description
                rows
                columns
                createdOn
                createdBy
                wellColumns
                subWellColumns
                imageChannels
            }
        }
    `,
  activeMeasurementByPlateIds: `
        query getActiveMeasurementByPlateIds($plateIds: [ID]) {
            plateMeasurements:getActiveMeasurementByPlateIds(plateIds: $plateIds) {
                plateId
                barcode
                rows
                columns
                measurementId
                active
            }
        }
    `,
  activeMeasurementsByExperimentId: `
        query getActiveMeasurementsByExperimentId {
            plateMeasurements:getActiveMeasurementsByExperimentId(experimentId: $experimentId) {
                plateId
                measurementId
                barcode
                rows
                columns
                wellColumns
            }
        }
    `
}

export const experimentsQueries = {
  experiments: `
            query getExperiments($experimentIds: [ID]) {
                experiments:getExperiments(experimentIds: $experimentIds) {
                    id
                    name
                    description
                    status
                    projectId
                    multiploMethod
                    multiploParameter
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                    tags
                }
            }
        `,
  nMostRecentExperiments: `
            query nMostRecentExperiments($n: Int) {
                experiments:getNMostRecentExperiments(n: $n) {
                    id
                    name
                    description
                    status
                    projectId
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                    tags
                }
            }
        `,
  experimentById: `
            query experimentById($experimentId: ID) {
                experiment:getExperimentById(experimentId: $experimentId) {
                    id
                    name
                    description
                    status
                    projectId
                    multiploMethod
                    multiploParameter
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                    tags
                }
            }
        `,
  experimentsByProjectId: `
            query experimentsByProjectId($projectId: ID) {
                experiment:getExperimentsByProjectId(projectId: $projectId) {
                    id
                    name
                    description
                    status
                    projectId,
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                    tags
                }
            }
        `,
  experimentsByProjectIds: `
            query experimentsByProjectIds($projectIds: [ID]) {
                experiments:getExperimentsByProjectIds(projectIds: $projectIds) {
                    id
                    name
                    description
                    status
                    projectId
                    project {
                        id
                        name
                    }
                    multiploMethod
                    multiploParameter
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                    tags
                    summary {
                      nrPlates
                      nrPlatesLinkedLayout
                      nrPlatesApproved
                      nrPlatesCalculated
                      nrPlatesValidated
                    }
                }
            }
        `,
  experimentSummaries: `
            query getExperiments {
                experimentSummaries:getExperimentSummaries {
                    experimentId
                    nrPlates
                    nrPlatesCalculated
                    nrPlatesValidated
                    nrPlatesApproved
                }
            }
        `
}

export const curvesQueries = {
  curvesByPlateId: `
            query getCurvesByPlateId($plateId: ID) {
                curves:getCurvesByPlateId(plateId: $plateId) {
                    id
                    plateId
                    protocolId
                    featureId
                    resultSetId
                    substanceName
                    substanceType
                    fitDate
                    version
                    wells
                    wellConcentrations
                    featureValues
                    xAxisLabels
                    plotDoseData
                    plotPredictionData
                    weights
                    curveProperties {
                        name
                        numericValue
                        stringValue
                    }
                }
            }
        `,
  curvesThatIncludesWellId: `
            query getCurvesThatIncludesWellId($wellId: ID) {
                curves:getCurvesThatIncludesWellId(wellId: $wellId) {
                    id
                    plateId
                    protocolId
                    featureId
                    resultSetId
                    substanceName
                    substanceType
                    fitDate
                    version
                    wells
                    wellConcentrations
                    featureValues
                    xAxisLabels
                    plotDoseData
                    plotPredictionData
                    weights
                    curveProperties {
                        name
                        numericValue
                        stringValue
                    }
                }
            }
        `
}

export const templatesQueries = {
  templates: `
            query getPlateTemplates {
                plateTemplates:getPlateTemplates {
                    id
                    name
                    rows
                    columns
                    description
                    tags
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                }
            }
        `,
  templateById: `
            query getPlateTemplateById($plateTemplateId: ID) {
                plateTemplate:getPlateTemplateById(plateTemplateId: $plateTemplateId) {
                    id
                    name
                    rows
                    columns
                    description
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                    tags
                    properties {
                        propertyName
                        propertyValue
                    }
                    wells {
                        id
                        plateTemplateId
                        description
                        skipped
                        row
                        column
                        wellType
                        substanceType
                        substanceName
                        concentration
                    }
                }
            }
        `
}

export const measurementsQueries = {
  measurementsAll: `
            query measurements {
                measurements {
                    id
                    name
                    barcode
                    description
                    rows
                    columns
                    createdOn
                    createdBy
                }
            }
        `,
  measurementById: `
            query measurementById($measurementId: ID) {
                measurement:measurementById(measurementId: $measurementId) {
                    name
                    barcode
                    columns
                    rows
                    wellColumns
                    subWellColumns
                }
                wellData:measurementDataById(measurementId: $measurementId) {
                    measurementId
                    column
                    data
                }
            }
        `,
  measurementsColumnsById: `
          query measurementById($measurementId: ID) {
              wellColumns:measurementById(measurementId: $measurementId) {
                  wellColumns
              }
          }
      `,
  measurementWellData: `
            query measurementWellData($measurementId: ID, $wellColumn: String) {
                wellData:measurementDataByIdAndWellColumn(measurementId: $measurementId, wellColumn: $wellColumn)
            }
        `
}

export const resultdataQueries = {
  protocolsByPlateId: `
            query protocolsByPlateId($plateId: ID) {
                protocols:protocolsByPlateId (plateId: $plateId) {
                    id:protocolId
                    name:protocolName
                    features {
                        id:featureId
                        name:featureName
                    }
                }
            }
        `,
  protocolsByExperimentId: `
            query protocolsByExperimentId($experimentId: ID) {
                protocols:protocolsByExperimentId(experimentId: $experimentId) {
                    id:protocolId
                    name:protocolName
                    features {
                        id:featureId
                        name:featureName
                    }
                }
            }
        `,
  featureValuesByPlateIdAndFeatureIdAndProtocolId: `
            query featureValuesByPlateIdAndFeatureIdAndProtocolId($plateId: ID, $featureId: ID, $protocolId: ID) {
                featureValues:featureValuesByPlateIdAndFeatureIdAndProtocolId (plateId: $plateId, featureId: $featureId, protocolId: $protocolId) {
                    value
                }
            }
        `,
  resultSetsByPlateId: `
            query resultSetsByPlateId($plateId: ID) {
                resultSets: resultSetsByPlateId(plateId: $plateId) {
                    id
                    executionStartTimeStamp
                    executionEndTimeStamp
                    measId
                    protocolId
                    outcome
                    errorsText,
                    errors {
                        timestamp,
                        description,
                        featureId,
                        featureName,
                        formulaId,
                        formulaName,
                        civType,
                        civSource,
                        civVariableName
                    }
                }
            }
        `,
  resultSetFeatureStats: `
            query resultSetsByPlateId($resultSetId: ID) {
                rsFeatureStats:resultSetFeatureStats(resultSetId: $resultSetId) {
                    featureId
                    statisticName
                    value
                    statusCode
                    welltype
                    statusMessage
                }
            }
        `,
  resultDataByResultSetId: `
            query resultDataByResultSetId($resultSetId: ID) {
                resultData:resultDataByResultSetId(resultSetId: $resultSetId) {
                    id
                    resultSetId
                    featureId
                    values
                    statusCode
                    statusMessage
                    exitCode
                    createdTimestamp
                }
            }
        `,
  resultDataByResultSetIdAndFeatureId: `
            query resultData($resultSetId: ID, $featureId: ID) {
                resultData:resultDataByResultSetIdAndFeatureId(resultSetId: $resultSetId, featureId: $featureId) {
                    values
                }
            }
        `,
  resultDataByPlateIdAndProtocolIdAndFeatureId: `
            query resultDataByPlateIdAndProtocolIdAndFeatureId($plateId: ID, $protocolId: ID, $featureId: ID) {
                resultData: resultDataByPlateIdAndProtocolIdAndFeatureId(plateId: $plateId, protocolId: $protocolId, featureId: $featureId) {
                    id
                    resultSetId
                    featureId
                    values
                    statusCode
                    statusMessage
                    exitCode
                    createdTimestamp
                }
            }
        `,
  latestResultSetByPlateId: `
            query latestResultSetByPlateId($plateId: ID) {
                resultSet:latestResultSetByPlateId(plateId: $plateId) {
                    id
                    plateId
                    protocolId
                    measId
                    outcome
                }
            }
        `,
  latestResultSetsByPlateIds: `
            query latestResultSetsByPlateIds($plateIds: [ID]) {
                resultSets:latestResultSetsByPlateIds(plateIds: $plateIds) {
                    id
                    plateId
                    protocolId
                    measId
                    outcome
                }
            }
        `,
}

export const protocolsQueries = {
  protocols: `
            query getProtocols {
                protocols:getProtocols {
                    id
                    name
                    description
                    createdOn
                    createdBy
                    tags
                }
            }
        `,
  protocolById: `
            query getProtocolById($protocolId: ID) {
                protocol:getProtocolById(protocolId: $protocolId) {
                    id
                    name
                    description
                    lowWelltype
                    highWelltype
                    versionNumber
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                    tags
                    properties {
                        propertyName
                        propertyValue
                    }
                    features {
                        id
                        name
                        description
                        formulaId
                        format
                        sequence
                        alias
                        drcModel {
                            featureId
                            name
                            description
                            inputParameters {
                                name
                                value
                            }
                        }
                        civs {
                            id
                            featureId
                            formulaId
                            variableName
                            sourceMeasColName
                            sourceFeatureId
                            inputSource
                        }
                    }
                }
            }
        `,
  featureById: `
            query getProtocolById($featureId: ID) {
                feature:getFeatureById(featureId: $featureId) {
                    id
                    name
                    alias
                    description
                    format
                    type
                    sequence
                    protocolId
                    formulaId
                    civs {
                        id
                        featureId
                        formulaId
                        variableName
                        sourceMeasColName
                        sourceFeatureId
                        inputSource
                    }
                    drcModel {
                        featureId
                        name
                        description
                        method
                        slope
                        script
                    }
                    trigger
                    status
                    deleted
                }
            }
        `,
  featuresByProtocolId: `
            query getFeaturesByProtocolId($protocolId: ID) {
                features:getFeaturesByProtocolId(protocolId: $protocolId) {
                    id
                    name
                    status
                    sequence
                    alias
                    description
                }
            }
        `
}

export const queryServiceQueries = {
  exportPlateData: `
        query exportPlateListData($exportPlateDataOptions: ExportPlateDataOptions) {
            plateData:exportPlateListData(exportPlateDataOptions: $exportPlateDataOptions) {
                plateId
                barcode
                experimentId
                experimentName
                comment
                plateTemplateId
                validationStatus
                approvalStatus
                features {
                    featureId
                    featureName
                    protocolId
                    protocolName
                    resultSetId
                    wellType
                    stats {
                        name
                        value
                    }
                }
            }
        }
    `,
  exportWellData: `
        query exportWellData($exportWellDataOptions: ExportWellDataOptions) {
            wellData:exportWellData(exportWellDataOptions: $exportWellDataOptions) {
                plateId
                barcode
                experimentName
                validationStatus
                approvalStatus
                wellId
                rowNr
                columnNr
                wellType
                substanceName
                substanceType
                concentration
                features {
                    featureId
                    featureName
                    protocolId
                    protocolName
                    value
                }
            }
        }
    `
}

export const chartsQueries = {
  scatterPlot: `
            query scatterPlot($plateId: ID, $protocolId:ID, $xFeatureId: ID, $yFeatureId: ID, $groupBy: String) {
                scatterPlot(plateId: $plateId, protocolId: $protocolId xFeatureId: $xFeatureId, yFeatureId: $yFeatureId, groupBy: $groupBy) {
                    data{
                        x:xValue
                        y:yValue
                        mode
                        name
                        type
                    }
                    layout {
                        chartTitle
                        xAxisLabel
                        yAxisLabel
                    }
                }
            }
        `,
  barPlot: `
            query barPlot($plateId: ID, $protocolId: ID, $featureId: ID, $groupBy: String) {
                barPlot(plateId: $plateId, protocolId: $protocolId, featureId: $featureId, groupBy: $groupBy) {
                    data{
                        x:xValue
                        y:yValue
                        mode
                        name
                        type
                    }
                    layout {
                        chartTitle
                        xAxisLabel
                        yAxisLabel
                    }
                }
            }
        `,
  histogramPlot: `
            query histogramPlot($plateId: ID, $protocolId: ID, $featureId: ID, $groupBy: String) {
                histogramPlot(plateId: $plateId, protocolId: $protocolId, featureId: $featureId, groupBy: $groupBy) {
                    data{
                        x:xValue
                        mode
                        name
                        type
                    }
                    layout {
                        chartTitle
                        xAxisLabel
                    }
                }
            }
        `,
  basicBoxPlot: `
            query boxPlot($plateId: ID, $protocolId: ID, $featureId: ID) {
                boxPlot(plateId: $plateId, protocolId: $protocolId, featureId: $featureId) {
                    data{
                        y:yValue
                        mode
                        name
                        type
                    }
                    layout {
                        chartTitle
                        yAxisLabel
                    }
                }
            }
        `,
  boxPlotWithGrouping: `
            query boxPlotWithGrouping($plateId: ID, $protocolId: ID, $featureId: ID, $groupBy: String) {
                boxPlot:boxPlotWithGrouping(plateId: $plateId, protocolId: $protocolId, featureId: $featureId, groupBy: $groupBy) {
                    data{
                        y:yValue
                        mode
                        name
                        type
                    }
                    layout {
                        chartTitle
                        yAxisLabel
                    }
                }
            }
        `
}
