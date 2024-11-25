import { platesGraphQLClient } from "@/graphql/graphql.clients";
import { experimentsQueries } from "@/graphql/graphql.queries";
import {useGraphQL} from "@/composable/useGraphQL";

export default {
  async experiments(experimentIds) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(experimentsQueries.experiments, { experimentIds })
    return result.data
  },
  async nMostRecentExperiments(n) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(experimentsQueries.nMostRecentExperiments, { n })
    return result.data
  },
  async experimentById(experimentId) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(experimentsQueries.experimentById, { experimentId })
    return result.data
  },
  async experimentsByProjectId(projectId) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(experimentsQueries.experimentsByProjectId, { projectId })
    return result.data
  },
  async experimentsByProjectIds(projectIds) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(experimentsQueries.experimentsByProjectIds, { projectIds })
    return result.data
  },
  async experimentSummaries() {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(experimentsQueries.experimentSummaries, {})
    return result.data
  },
};
