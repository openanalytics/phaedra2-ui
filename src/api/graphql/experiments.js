import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {computed} from "vue";
import {apolloPlatesClient} from "@/graphql/apollo.clients";

const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

export default {
    experiments() {
        const QUERY = gql`
            query getExperiments {
                experiments:getExperiments {
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
        `
        const query = provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY, null, defaultOptions))
        return computed(() => query.result.value?.experiments ?? [])
    },
    nMostRecentExperiments(n) {
        const QUERY = gql`
            query nMostRecentExperiments {
                experiments:getNMostRecentExperiments(n: ${n}) {
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
        `
        return provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY, null, defaultOptions))
    },
    experimentById(experimentId) {
        const QUERY = gql`
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
        `
        const variables = {'experimentId': experimentId}
        const query = provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.experiment ?? {})
    },
    experimentSummaries() {
        const QUERY = gql`
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
        return provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY, null, defaultOptions))
    }
}

