import gql from 'graphql-tag'
import { platesGraphQLClient } from "@/graphql/apollo.clients";

const executeQuery = async (query, variables) => {
  let cancel = () => {
    /* abort the request if it is in-flight */
  };

  const result = await new Promise((resolve, reject) => {
    let result;
    cancel = platesGraphQLClient.subscribe(
        {
          query: query,
          variables: variables
        },
        {
          next: (data) => (result = data),
          error: reject,
          complete: () => resolve(result),
        },
    );
  });

  return result;
};

export default {
  async projects(projectIds) {
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
    const result = await executeQuery(query, {projectIds});
    return result.data;
  },
  async projectById(projectId) {
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
    const result =  await executeQuery(query, {projectId});
    return result.data;
  },
  async nMostRecentlyUpdatedProjects(n) {
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
    const result = await executeQuery(query, {n});
    return result.data
  },
  async experiments(experimentIds) {
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
    const result =  await executeQuery(query, {experimentIds})
    return result.data
  },
  async experimentById(experimentId) {
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
    const result = await executeQuery(query, {experimentId})
    return result.data
  },
  async experimentsByProjectId(projectId) {
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
    const result = await executeQuery(query, {projectId});
    return result.data
  },
  async plates(plateIds) {
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
    const result = await executeQuery(query, {plateIds})
    return result.data
  },
  async plateById(plateId) {
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
    const result = await executeQuery(query, {plateId});
    return result.data
  },
  async platesByExperimentIds(experimentIds){
    const query = `
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
    `
    const result = await executeQuery(query, {experimentIds});
    return result.data
  },
  async wells(wellIds) {
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
    const result = await executeQuery(query, {wellIds})
    return result.data
  },
  async wellById(wellId) {
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
    const result = await executeQuery(query, {wellId});
    return result.data
  },
  async wellsByPlateId(plateId) {
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
    const result = await executeQuery(query, {plateId});
    return result.data
  },
  async wellsByPlateIds(plateIds) {
    const query = `
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
    `
    const result = await executeQuery(query, {plateIds})
    return result.data
  },
  async measurementsByPlateId(plateId) {
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
    const result = await executeQuery(query, {plateId})
    return result.data
  },
  async activeMeasurementByPlateIds(plateIds) {
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
    const result = await executeQuery(query, {plateIds})
    return result.data
  },
  async activeMeasurementsByExperimentId(experimentId) {
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
    const result = await executeQuery(query, {experimentId})
    return result.data
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
    return provideApolloClient(platesGraphQLClient)(() => useMutation(mutation))
  }
}
