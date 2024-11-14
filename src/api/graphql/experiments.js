import { platesGraphQLClient } from "@/graphql/apollo.clients";
import { experimentsQueries } from "@/graphql/graphql.queries";

const executeQuery = async (query, variables) => {
  let cancel = () => {
    /* abort the request if it is in-flight */
  };

  const result = await new Promise((resolve, reject) => {
    let result;
    cancel = platesGraphQLClient.subscribe(
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
  async experiments(experimentIds) {
    const result = await executeQuery(experimentsQueries.experiments, { experimentIds })
    return result.data
  },
  async nMostRecentExperiments(n) {
    const result = await executeQuery(experimentsQueries.nMostRecentExperiments, { n })
    return result.data
  },
  async experimentById(experimentId) {
    const result = await executeQuery(experimentsQueries.experimentById, { experimentId })
    return result.data
  },
  async experimentsByProjectId(projectId) {
    const result = await executeQuery(experimentsQueries.experimentsByProjectId, { projectId })
    return result.data
  },
  async experimentsByProjectIds(projectIds) {
    const result = await executeQuery(experimentsQueries.experimentsByProjectIds, { projectIds })
    return result.data
  },
  async experimentSummaries() {
    const result = await executeQuery(experimentsQueries.experimentSummaries, {})
    return result.data
  },
};
