import {apolloResultDataClient} from "@/graphql/apollo.clients";
import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'

const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

const executeQuery = async (query, variables) => {
    return provideApolloClient(apolloResultDataClient)(
        () => useQuery(gql`${query}`, variables, defaultOptions));
}

export default {
    async protocolsByPlateId(plateId) {
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
        return await executeQuery(query, {plateId})
    },
    async protocolsByExperimentId(experimentId) {
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
        return await executeQuery(query, {experimentId})
    },
    async featureValuesByPlateIdAndFeatureIdAndProtocolId(plateId, featureId, protocolId) {
        const query = `
            query featureValuesByPlateIdAndFeatureIdAndProtocolId($plateId: ID, $featureId: ID, $protocolId: ID) {
                featureValues:featureValuesByPlateIdAndFeatureIdAndProtocolId (plateId: $plateId, featureId: $featureId, protocolId: $protocolId) {
                    value
                }
            }
        `
        return await executeQuery(query, {plateId, featureId, protocolId})
    },
    async resultSetsByPlateId(plateId) {
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
        return await executeQuery(query, {plateId})
    },
    async resultSetFeatureStats(resultSetId) {
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
        return await executeQuery(query, {resultSetId})
    },
    async resultDataByResultSetId(resultSetId) {
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
        return await executeQuery(query, {resultSetId})
    },
    async resultDataByResultSetIdAndFeatureId(resultSetId, featureId) {
        const query = `
            query resultData($resultSetId: ID, $featureId: ID) {
                resultData:resultDataByResultSetIdAndFeatureId(resultSetId: $resultSetId, featureId: $featureId) {
                    values
                }
            }
        `
        return await executeQuery(query, {resultSetId, featureId})
    },
    async resultDataByPlateIdAndProtocolIdAndFeatureId(plateId, protocolId, featureId) {
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
        return await executeQuery(query, {plateId, protocolId, featureId})
    },
    async latestResultSetByPlateId(plateId) {
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
        return await executeQuery(query, {plateId})
    },
    async latestResultSetsByPlateIds(plateIds) {
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
        return await executeQuery(query, {plateIds})
    }
}
