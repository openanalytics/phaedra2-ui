import {protocolsGraphQLClient} from "@/graphql/graphql.clients";
import {protocolsQueries} from "@/graphql/graphql.queries";
import {useGraphQL} from "@/composable/useGraphQL";

export default {
  async protocols() {
    const protocolClient = useGraphQL(protocolsGraphQLClient);
    const result = await protocolClient.executeQuery(protocolsQueries.protocols,
        {})
    return result.data
  },
  async protocolById(protocolId) {
    const protocolClient = useGraphQL(protocolsGraphQLClient);
    const result = await protocolClient.executeQuery(
        protocolsQueries.protocolById, {protocolId})
    return result.data
  },
  async featureById(featureId) {
    const protocolClient = useGraphQL(protocolsGraphQLClient);
    const result = await protocolClient.executeQuery(
        protocolsQueries.featureById, {featureId})
    return result.data
  },
  async featuresByProtocolId(protocolId) {
    const protocolClient = useGraphQL(protocolsGraphQLClient);
    const result = await protocolClient.executeQuery(
        protocolsQueries.featuresByProtocolId,
        {protocolId})
    return result.data
  }
}
