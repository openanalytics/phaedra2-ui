import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {computed} from "vue";
import {apolloProtocolsClient} from "@/graphql/apollo.clients";
import axios from "axios";

const token = process.env.VUE_APP_API_BEARER_TOKEN;
const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

export default {
    async protocols() {
        const result = await axios({
            url: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/protocol-service/graphql',
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                query: `
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
            }
        })
        return result.data.data.protocols
    },
    async protocolById(protocolId) {
        const result = await axios({
            url: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/protocol-service/graphql',
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                query: `
                    query {
                        protocol:getProtocolById(protocolId: ${protocolId}) {
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
            }
        })
        return result.data.data.protocol
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
        return provideApolloClient(apolloProtocolsClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
    }
}
