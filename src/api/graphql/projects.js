import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {computed} from "vue";
import {apolloPlatesClient} from "@/graphql/apollo.clients";

const defaultOptions = { fetchPolicy: 'no-cache'}

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
        const query = provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY, null, defaultOptions))
        return computed(() => query.result.value?.projects ?? [])
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
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                }
            }
        `
        const variables = {'projectId': projectId}
        const query = provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return {
            'project': computed(() => query.result.value?.project ?? null),
            'experiments': computed(() => query.result.value?.experiments ?? null)
        }
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
    experimentById(experimentId) {
        const QUERY = gql`
            query experimentById($experimentId: ID) {
                experiment:getExperimentById(experimentId: $experimentId) {
                    id
                    name
                    projectId
                    description
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
        const query = provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return {
            'experiment': computed(() => query.result.value?.experiment ?? null),
            'plates': computed(() => query.result.value?.plates ?? null)
        }
    },
    experimentNameById(experimentId) {
        const QUERY = gql`
            query experimentById($experimentId: ID) {
                experiment:getExperimentById(experimentId: $experimentId) {
                    id
                    name
                }
            }
        `
        const variables = {'experimentId': experimentId}
        const query = provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.experiment ?? null)
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
        const query = provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return {
            'plate': computed(() => query.result.value?.plate ?? null),
            'wells': computed(() => query.result.value?.wells ?? null)
        }
    }
}
