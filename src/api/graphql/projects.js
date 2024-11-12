// import {
//   provideApolloClient,
//   useMutation,
//   useQuery
// } from '@vue/apollo-composable'
import { createClient } from 'graphql-http';
import gql from 'graphql-tag'
import {apolloPlatesClient} from "@/graphql/apollo.clients";

const defaultOptions = {
  fetchOptions: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

const executeQuery = async (query, variables) => {
  let cancel = () => {
    /* abort the request if it is in-flight */
  };

  const result = await new Promise((resolve, reject) => {
    let result;
    cancel = apolloPlatesClient.subscribe(
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
    return await executeQuery(query, {projectId});
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
    return await executeQuery(query, {n});
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
    return await executeQuery(query, {experimentIds});
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
    return await executeQuery(query, {experimentId});
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
    return await executeQuery(query, {projectId});
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
    return await executeQuery(query, {plateIds});
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
    return executeQuery(query, {plateId});
  },
  async platesByExperimentIds(experimentIds){
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
    return await executeQuery(query, {experimentIds});
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
    return await executeQuery(query, {wellIds});
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
    return await executeQuery(query, {wellId});
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
    return await executeQuery(query, {plateId});
  },
  async wellsByPlateIds(plateIds) {
    const query = `
        query getWellsByPlateIds($plateIds: [ID]) {
            wells:getWellsByPlateIds(plateIds: $plateIds) {
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
    return await executeQuery(query, {plateIds});
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
    return await executeQuery(query, {plateId});
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
    return await executeQuery(query, {plateIds});
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
    return await executeQuery(query, {experimentId});
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
