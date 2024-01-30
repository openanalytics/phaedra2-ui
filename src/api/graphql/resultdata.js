import {apolloResultDataClient} from "@/graphql/apollo.clients";
import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'

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
    featureValuesByPlateIdAndFeatureId(plateId, featureId) {
        const QUERY = gql`
            query featureValuesByPlateIdAndFeatureId {
                featureValues:featureValuesByPlateIdAndFeatureId (plateId: ${plateId}, featureId: ${featureId}) {
                    value
                }
            }
        `
        return provideApolloClient(apolloResultDataClient)(()=> useQuery(QUERY, null, defaultOptions))
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
                    welltype
                    statusMessage
                }
            }
        `
        const variables = {'resultSetId': resultSetId}
        return provideApolloClient(apolloResultDataClient)(()=> useQuery(QUERY,
            variables,
            defaultOptions))
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
    resultDataByResultSetIdAndFeatureId(resultSetId, featureId) {
        const QUERY = gql`
            query resultData {
                resultData:resultDataByResultSetIdAndFeatureId(resultSetId: ${resultSetId}, featureId: ${featureId}) {
                    values
                }
            }
        `
        return provideApolloClient(apolloResultDataClient)(() => useQuery(QUERY,
            null,
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
        return provideApolloClient(apolloResultDataClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
    },
    latestResultSetByPlateId(plateId) {
        const QUERY = gql`
            query latestResultSetByPlateId($plateId: ID) {
                resultSet:latestResultSetByPlateId(plateId: $plateId) {
                    id
                    plateId
                    protocolId
                    measId
                    outcome
                }
            }
        `
        const variables = {'plateId': plateId}
        return provideApolloClient(apolloResultDataClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
    },
    latestResultSetsByPlateIds(plateIds) {
        const QUERY = gql`
            query latestResultSetsByPlateIds($plateIds: [ID]) {
                resultSets:latestResultSetsByPlateIds(plateIds: $plateIds) {
                    id
                    plateId
                    protocolId
                    measId
                    outcome
                }
            }
        `
        const variables = {'plateIds': plateIds}
        return provideApolloClient(apolloResultDataClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
    }
}
