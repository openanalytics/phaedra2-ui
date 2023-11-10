import {provideApolloClient, useMutation, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {computed} from "vue";
import {apolloPlatesClient} from "@/graphql/apollo.clients";

const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}
const axios = require("axios")

export default {
    projects() {
        const QUERY = gql`
            query getProjects {
                projects:getProjects {
                    id
                    name
                    description
                    createdOn
                    createdBy
                    tags       
                }
            }
        `
        return provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY, null, defaultOptions))
        // return computed(() => query.result.value?.projects.sort((p1, p2) => p2.createdOn.localeCompare(p1.createdOn)) ?? [])
    },
    nMostRecentlyUpdatedProjects(n) {
        const QUERY = gql`
            query getNMostRecentlyUpdatedProjects {
                projects:getNMostRecentlyUpdatedProjects(n: ${n}) {
                    id
                    name
                    description
                    createdOn
                    createdBy
                    tags
                }
            }
        `
        return provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY, null, defaultOptions))
    },
    projectById(projectId) {
        const QUERY = gql`
            query projectById($projectId: ID) {
                project:getProjectById(projectId: $projectId) {
                    id
                    name
                    description
                    tags
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
                        nrPlatesApproved
                        nrPlatesCalculated
                        nrPlatesValidated
                    }
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                }

                projectAccess:getProjectAccess(projectId: $projectId) {
                    id
                    projectId
                    teamName
                    accessLevel
                }
            }
        `
        const variables = {'projectId': projectId}
        return provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
    },
    projectNameById(projectId) {
        const QUERY = gql`
            query projectById($projectId: ID) {
                project:getProjectById(projectId: $projectId) {
                    id
                    name
                }
            }
        `
        const variables = {'projectId': projectId}
        const query = provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.project ?? null)
    },
    getProjectAccess(projectId) {
        const QUERY = gql`
            query getProjectAccess($projectId: ID) {
                projectAccess:getProjectAccess(projectId: $projectId) {
                    id
                    projectId
                    teamName
                    accessLevel
                }
            }
        `
        const variables = {'projectId': projectId}
        const query = provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY, variables, defaultOptions))

        return computed(() => query.result.value?.projectAccess ?? [])
    },
    async experimentsByProjectId(projectId) {
        const result = await axios({
            url: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/plate-service/graphql',
            method: 'post',
            data: {
                query: `
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
            }
        })
        console.log(result.data)
        return result.data.data.experiments
    },
    experimentById(experimentId) {
        const QUERY = gql`
            query experimentById($experimentId: ID) {
                experiment:getExperimentById(experimentId: $experimentId) {
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

                plates:getPlatesByExperimentId(experimentId: $experimentId) {
                    id
                    experimentId
                    barcode
                    description
                    linkStatus
                    calculationStatus
                    calculationError
                    validationStatus
                    approvalStatus
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
        const variables = {'experimentId': experimentId}
        return provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
    },
    plateById(plateId) {
        const QUERY = gql`
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
                }

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
        const variables = {'plateId': plateId}
        return provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
    },
    measurementsByPlateId(plateId) {
        const QUERY = gql`
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
        const variables = {'plateId': plateId}
        return provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
    },
    activeMeasurementByPlateId(plateId) {
        const QUERY = gql`
            query getActiveMeasurementByPlateId($plateId: ID) {
                plateMeasurement:getActiveMeasurementByPlateId(plateId: $plateId) {
                    plateId
                    barcode
                    rows
                    columns
                    measurementId
                    active
                }
            }
        `
        const variables = {'plateId': plateId}
        return provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
    },
    activeMeasurementsByExperimentId(experimentId) {
        const QUERY = gql`
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
        return provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY,
            null,
            defaultOptions))
    },
    linkPlateMeasurement(plateId, measurementId) {
        const MUTATION = gql`
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
        return provideApolloClient(apolloPlatesClient)(() => useMutation(MUTATION))
    }
}
