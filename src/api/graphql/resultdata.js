import {apolloResultDataClient} from "@/graphql/apollo.clients";
import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'

const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

const executeQuery = (query, variables) => {
    return provideApolloClient(apolloResultDataClient)(
        () => useQuery(gql`${query}`, variables, defaultOptions));
}

export default {
    protocolsByPlateId(plateId) {
        const query = `
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
        return executeQuery(query, {plateId})
    },
    protocolsByExperimentId(experimentId) {
        const query = `
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
        return executeQuery(query, {experimentId})
    },
    featureValuesByPlateIdAndFeatureIdAndProtocolId(plateId, featureId, protocolId) {
        const query = `
            query featureValuesByPlateIdAndFeatureIdAndProtocolId($plateId: ID, $featureId: ID, $protocolId: ID) {
                featureValues:featureValuesByPlateIdAndFeatureIdAndProtocolId (plateId: $plateId, featureId: $featureId, protocolId: $protocolId) {
                    value
                }
            }
        `
        return executeQuery(query, {plateId, featureId, protocolId})
    },
    resultSetsByPlateId(plateId) {
        const query = `
            query resultSetsByPlateId($plateId: ID) {
                resultSets: resultSetsByPlateId(plateId: $plateId) {
                    id
                    executionStartTimeStamp
                    executionEndTimeStamp
                    measId
                    protocolId
                    outcome
                    errorsText,
                    errors {
                        timestamp,
                        description,
                        featureId,
                        featureName,
                        formulaId,
                        formulaName,
                        civType,
                        civSource,
                        civVariableName
                    }
                }
            }
        `
        return executeQuery(query, {plateId})
    },
    resultSetFeatureStats(resultSetId) {
        const query = `
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
        return executeQuery(query, {resultSetId})
    },
    resultDataByResultSetId(resultSetId) {
        const query = `
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
        return executeQuery(query, {resultSetId})
    },
    resultDataByResultSetIdAndFeatureId(resultSetId, featureId) {
        const query = `
            query resultData($resultSetId: ID, $featureId: ID) {
                resultData:resultDataByResultSetIdAndFeatureId(resultSetId: $resultSetId, featureId: $featureId) {
                    values
                }
            }
        `
        return executeQuery(query, {resultSetId, featureId})
    },
    resultDataByPlateIdAndProtocolIdAndFeatureId(plateId, protocolId, featureId) {
        const query = gql`
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
        return executeQuery(query, {plateId, protocolId, featureId})
    },
    latestResultSetByPlateId(plateId) {
        const query = `
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
        return executeQuery(query, {plateId})
    },
    latestResultSetsByPlateIds(plateIds) {
        const query = `
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
        return executeQuery(query, {plateIds})
    }
}
