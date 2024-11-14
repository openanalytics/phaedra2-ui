import {resultDataGraphQLClient} from "@/graphql/apollo.clients";
import {resultdataQueries} from "@/graphql/graphql.queries";

const executeQuery = async (query, variables) => {
  let cancel = () => {
    /* abort the request if it is in-flight */
  };

  const result = await new Promise((resolve, reject) => {
    let result;
    cancel = resultDataGraphQLClient.subscribe(
        {
          query: query,
          variables: variables
        },
        {
          next: (data) => (result = data),
          error: reject,
          complete: () => resolve(result),
        },
    );
  });

  return result;
};

export default {
  async protocolsByPlateId(plateId) {
    const result = await executeQuery(resultdataQueries.protocolsByPlateId,
        {plateId})
    return result.data
  },
  async protocolsByExperimentId(experimentId) {
    const result = await executeQuery(resultdataQueries.protocolsByExperimentId,
        {experimentId})
    return result.data
  },
  async featureValuesByPlateIdAndFeatureIdAndProtocolId(plateId, featureId,
      protocolId) {
    const result = await executeQuery(
        resultdataQueries.featureValuesByPlateIdAndFeatureIdAndProtocolId,
        {plateId, featureId, protocolId})
    return result.data
  },
  async resultSetsByPlateId(plateId) {
    const result = await executeQuery(resultdataQueries.resultSetsByPlateId,
        {plateId})
    return result.data
  },
  async resultSetFeatureStats(resultSetId) {
    const result = await executeQuery(resultdataQueries.resultSetFeatureStats,
        {resultSetId})
    return result.data
  },
  async resultDataByResultSetId(resultSetId) {
    const result = await executeQuery(resultdataQueries.resultDataByResultSetId,
        {resultSetId})
    return result.data
  },
  async resultDataByResultSetIdAndFeatureId(resultSetId, featureId) {
    const result = await executeQuery(
        resultdataQueries.resultDataByResultSetIdAndFeatureId,
        {resultSetId, featureId})
    return result.data
  },
  async resultDataByPlateIdAndProtocolIdAndFeatureId(plateId, protocolId,
      featureId) {
    const result = await executeQuery(
        resultdataQueries.resultDataByPlateIdAndProtocolIdAndFeatureId,
        {plateId, protocolId, featureId})
    return result.data
  },
  async latestResultSetByPlateId(plateId) {
    const result = await executeQuery(
        resultdataQueries.latestResultSetByPlateId, {plateId})
    return result.data
  },
  async latestResultSetsByPlateIds(plateIds) {
    const result = await executeQuery(
        resultdataQueries.latestResultSetsByPlateIds, {plateIds})
    return result.data
  }
}
