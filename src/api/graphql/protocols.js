import { apolloProtocolsClient } from "@/graphql/apollo.clients";
import {protocolsQueries} from "@/graphql/graphql.queries";

const executeQuery = async (query, variables) => {
  let cancel = () => {
    /* abort the request if it is in-flight */
  };

  const result = await new Promise((resolve, reject) => {
    let result;
    cancel = apolloProtocolsClient.subscribe(
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
  async protocols() {
    const result = await executeQuery(protocolsQueries.protocols, {})
    return result.data
  },
  async protocolById(protocolId) {
    const result = await executeQuery(protocolsQueries.protocolById, {protocolId})
    return result.data
  },
  async featureById(featureId) {
    const result = await executeQuery(protocolsQueries.featureById, {featureId})
    return result.data
  },
  async featuresByProtocolId(protocolId) {
    const result = await executeQuery(protocolsQueries.featuresByProtocolId,
        {protocolId})
    return result.data
  }
}
