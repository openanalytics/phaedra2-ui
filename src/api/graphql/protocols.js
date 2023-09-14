import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {computed} from "vue";
import {apolloProtocolsClient} from "@/graphql/apollo.clients";

const defaultOptions = { fetchPolicy: 'no-cache'}

export default {
    protocols() {
        const QUERY = gql`
            query getProtocols {
                protocols:getProtocols {
                    id
                    name
                    description
                    createdOn
                    createdBy
                }
            }
        `
        const query = provideApolloClient(apolloProtocolsClient)(() => useQuery(QUERY, null, defaultOptions))
        return computed(() => query.result.value?.protocols ?? [])
    },
    protocolById(protocolId) {
        const QUERY = gql`
            query getProtocolById($protocolId: ID) {
                protocol:getProtocolById(protocolId: $protocolId) {
                    id
                    name
                    description
                    features {
                        id
                        name
                        alias
                    }
                }
            }
        `
        const variables = {'protocolId': protocolId}
        const query = provideApolloClient(apolloProtocolsClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.protocol ?? null)
    },
    protocolsByTag(tag) {

    },
    featureById(featureId) {
        const QUERY = gql`
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
        `
        const variables = {'featureId': featureId}
        const query = provideApolloClient(apolloProtocolsClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.feature ?? null)
    },
    featuresByProtocolId(protocolId) {
        const QUERY = gql`
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
        const variables = {'protocolId': protocolId}
        const query = provideApolloClient(apolloProtocolsClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.features ?? null)
    }
}
