import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {apolloProtocolsClient} from "@/graphql/apollo.clients";

const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

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
        return provideApolloClient(apolloProtocolsClient)(() => useQuery(QUERY,
            null, defaultOptions))
    },
    protocolById(protocolId) {
        const QUERY = gql`
            query getProtocolById {
                protocol:getProtocolById(protocolId: ${protocolId}) {
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
        `
        return provideApolloClient(apolloProtocolsClient)(() => useQuery(QUERY,
            null, defaultOptions))
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
        return provideApolloClient(apolloProtocolsClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
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
        return provideApolloClient(apolloProtocolsClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
    }
}
