import {apolloResultDataClient} from "@/graphql/apollo.clients";
import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {computed} from "vue";
import axios from "axios";

const token = process.env.VUE_APP_API_BEARER_TOKEN;
const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

export default {
    protocolsByPlateId(plateId) {
        const PROTOCOLS_BY_PLATE_ID_QUERY = gql`
            query protocolsByPlateId($plateId: ID) {
                protocols:protocolsByPlateId (plateId: $plateId) {
                    id:protocolId
                    name:protocolName
                    features {
                        id:featureId
                        name:featureName
                    }
                }
            }
        `
        const variables = {'plateId': plateId}

        return provideApolloClient(apolloResultDataClient)(()=> useQuery(PROTOCOLS_BY_PLATE_ID_QUERY,
            variables,
            defaultOptions
        ))
    },
    protocolsByExperimentId(experimentId) {
        const QUERY = gql `
            query protocolsByExperimentId($experimentId: ID) {
                protocols:protocolsByExperimentId(experimentId: $experimentId) {
                    id:protocolId
                    name:protocolName
                    features {
                        id:featureId
                        name:featureName
                    }
                }
            }
        `
        const variables = {'experimentId': experimentId}

        return provideApolloClient(apolloResultDataClient)(()=> useQuery(QUERY,
            variables,
            defaultOptions
        ))
    },
    async featureValuesByPlateIdAndFeatureId(plateId, featureId) {
        const result = await axios({
            url: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/resultdata-service/graphql',
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                query: `
                    query {
                        featureValues:featureValuesByPlateIdAndFeatureId (plateId: ${plateId}, featureId: ${featureId}) {
                            value
                        }
                    }
                `
            }
        })
        return result.data.data.featureValues
    },
    resultSetsByPlateId(plateId) {
        const QUERY = gql`
            query resultSetsByPlateId($plateId: ID) {
                resultSets: resultSetsByPlateId(plateId: $plateId) {
                    id
                    executionStartTimeStamp
                    executionEndTimeStamp
                    measId
                    protocolId
                    outcome
                    errorsText
                }
            }
        `
        const variables = {'plateId': plateId}
        return provideApolloClient(apolloResultDataClient)(()=> useQuery(QUERY,
            variables,
            defaultOptions))
    },
    resultSetFeatureStats(resultSetId) {
        const QUERY = gql`
            query resultSetsByPlateId($resultSetId: ID) {
                rsFeatureStats:resultSetFeatureStats(resultSetId: $resultSetId) {
                    featureId
                    statisticName
                    value
                    statusCode
                    statusMessage
                }
            }
        `
        const variables = {'resultSetId': resultSetId}
        const query = provideApolloClient(apolloResultDataClient)(()=> useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.rsFeatureStats ?? [])
    },
    resultDataByResultSetId(resultSetId) {
        const QUERY = gql`
            query resultDataByResultSetId($resultSetId: ID) {
                resultData:resultDataByResultSetId(resultSetId: $resultSetId) {
                    id
                    resultSetId
                    featureId
                    values
                    statusCode
                    statusMessage
                    exitCode
                    createdTimestamp
                }
            }
        `
        const variables = {'resultSetId': resultSetId}
        return provideApolloClient(apolloResultDataClient)(()=> useQuery(QUERY,
            variables,
            defaultOptions))
    },
    resultDataByPlateIdAndProtocolIdAndFeatureId(plateId, protocolId, featureId) {
        const QUERY = gql`
            query resultDataByPlateIdAndProtocolIdAndFeatureId($plateId: ID, $protocolId: ID, $featureId: ID) {
                resultData: resultDataByPlateIdAndProtocolIdAndFeatureId(plateId: $plateId, protocolId: $protocolId, featureId: $featureId) {
                    id
                    resultSetId
                    featureId
                    values
                    statusCode
                    statusMessage
                    exitCode
                    createdTimestamp
                }
            }
        `
        const variables = {'plateId': plateId, 'protocolId': protocolId, 'featureId': featureId}
        const query = provideApolloClient(apolloResultDataClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.resultData ?? [])
    }
}
