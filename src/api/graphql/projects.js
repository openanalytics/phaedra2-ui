import {
  provideApolloClient,
  useMutation,
  useQuery
} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {apolloPlatesClient} from "@/graphql/apollo.clients";

const defaultOptions = {fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

const executeQuery = (query, variables) => {
  return provideApolloClient(apolloPlatesClient)(
      () => useQuery(gql`${query}`, variables, defaultOptions));
}

export default {
  projects(projectIds) {
    const query = `
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
    `
    return executeQuery(query, {projectIds});
  },
  projectById(projectId) {
    const query = `
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
    `
    return executeQuery(query, {projectId});
  },
  nMostRecentlyUpdatedProjects(n) {
    const query = `
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
    `
    return executeQuery(query, {n});
  },
  experiments(experimentIds) {
    const query = `
        query experimentById($experimentIds: [ID]) {
            experiment:getExperimentById(experimentIds: $experimentIds) {
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
    `
    return executeQuery(query, {experimentIds});
  },
  experimentById(experimentId) {
    const query = `
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
    `
    return executeQuery(query, {experimentId});
  },
  experimentsByProjectId(projectId) {
    const query = `
        query getExperimentsByProjectId {
            experiments:getExperimentsByProjectId(projectId: ${projectId}) {
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
    `
    return executeQuery(query, {projectId});
  },
  plates(plateIds) {
    const query = `
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
    `
    return executeQuery(query, {plateIds});
  },
  plateById(plateId) {
    const query = `
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
            }
        }
    `
    return executeQuery(query, {plateId});
  },
  platesByExperimentIds(experimentIds){
    const query = `
        query getPlatesByExperimentIds($experimentIds: [ID]) {
            plate:getPlatesByExperimentIds(experimentIds: $experimentIds) {
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
    `
    return executeQuery(query, {experimentIds});
  },
  wells(wellIds) {
    const query = `
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
    `
    return executeQuery(query, {wellIds});
  },
  wellById(wellId) {
    const query = `
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
    `
    return executeQuery(query, {wellId});
  },
  wellsByPlateId(plateId) {
    const query = `
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
    `
    return executeQuery(query, {plateId});
  },
  measurementsByPlateId(plateId) {
    const query = `
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
    `
    return executeQuery(query, {plateId});
  },
  activeMeasurementByPlateIds(plateIds) {
    const query = `
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
    `
    return executeQuery(query, {plateIds});
  },
  activeMeasurementsByExperimentId(experimentId) {
    const query = `
        query getActiveMeasurementsByExperimentId {
            plateMeasurements:getActiveMeasurementsByExperimentId(experimentId: ${experimentId}) {
                plateId
                measurementId
                barcode
                rows
                columns
                wellColumns
            }
        }
    `
    return executeQuery(query, {experimentId});
  },
  linkPlateMeasurement(plateId, measurementId) {
    const mutation = gql`
        mutation linkPlateMeasurement {
            linkMeasurement(plateId: ${plateId}, measurementId: ${measurementId}) {
                id
                plateId
                measurementId
                linkedOn
                linkedBy
                active
            }
        }
    `
    return provideApolloClient(apolloPlatesClient)(() => useMutation(mutation))
  }
}
