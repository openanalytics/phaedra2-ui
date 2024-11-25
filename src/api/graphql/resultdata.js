import {resultDataGraphQLClient} from "@/graphql/graphql.clients";
import {resultdataQueries} from "@/graphql/graphql.queries";
import {useGraphQL} from "@/composable/useGraphQL";

export default {
  async protocolsByPlateId(plateId) {
    const resultDataClient = useGraphQL(resultDataGraphQLClient)
    const result = await resultDataClient.executeQuery(resultdataQueries.protocolsByPlateId,
        {plateId})
    return result.data
  },
  async protocolsByExperimentId(experimentId) {
    const resultDataClient = useGraphQL(resultDataGraphQLClient)
    const result = await resultDataClient.executeQuery(resultdataQueries.protocolsByExperimentId,
        {experimentId})
    return result.data
  },
  async featureValuesByPlateIdAndFeatureIdAndProtocolId(plateId, featureId,
      protocolId) {
    const resultDataClient = useGraphQL(resultDataGraphQLClient)
    const result = await resultDataClient.executeQuery(
        resultdataQueries.featureValuesByPlateIdAndFeatureIdAndProtocolId,
        {plateId, featureId, protocolId})
    return result.data
  },
  async resultSetsByPlateId(plateId) {
    const resultDataClient = useGraphQL(resultDataGraphQLClient)
    const result = await resultDataClient.executeQuery(resultdataQueries.resultSetsByPlateId,
        {plateId})
    return result.data
  },
  async resultSetFeatureStats(resultSetId) {
    const resultDataClient = useGraphQL(resultDataGraphQLClient)
    const result = await resultDataClient.executeQuery(resultdataQueries.resultSetFeatureStats,
        {resultSetId})
    return result.data
  },
  async resultDataByResultSetId(resultSetId) {
    const resultDataClient = useGraphQL(resultDataGraphQLClient)
    const result = await resultDataClient.executeQuery(resultdataQueries.resultDataByResultSetId,
        {resultSetId})
    return result.data
  },
  async resultDataByResultSetIdAndFeatureId(resultSetId, featureId) {
    const resultDataClient = useGraphQL(resultDataGraphQLClient)
    const result = await resultDataClient.executeQuery(
        resultdataQueries.resultDataByResultSetIdAndFeatureId,
        {resultSetId, featureId})
    return result.data
  },
  async resultDataByPlateIdAndProtocolIdAndFeatureId(plateId, protocolId,
      featureId) {
    const resultDataClient = useGraphQL(resultDataGraphQLClient)
    const result = await resultDataClient.executeQuery(
        resultdataQueries.resultDataByPlateIdAndProtocolIdAndFeatureId,
        {plateId, protocolId, featureId})
    return result.data
  },
  async latestResultSetByPlateId(plateId) {
    const resultDataClient = useGraphQL(resultDataGraphQLClient)
    const result = await resultDataClient.executeQuery(
        resultdataQueries.latestResultSetByPlateId, {plateId})
    return result.data
  },
  async latestResultSetsByPlateIds(plateIds) {
    const resultDataClient = useGraphQL(resultDataGraphQLClient)
    const result = await resultDataClient.executeQuery(
        resultdataQueries.latestResultSetsByPlateIds, {plateIds})
    return result.data
  }
}
