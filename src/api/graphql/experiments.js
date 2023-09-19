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
    experimentById(experimentId) {
        const QUERY = gql`
            query projectById($experimentId: ID) {
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
        const query = provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY, null, defaultOptions))
        return computed(() => query.result.value?.experimentSummaries ?? [])
    }
}

