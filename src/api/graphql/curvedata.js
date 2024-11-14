import {curvesGraphQLClient} from "@/graphql/apollo.clients";
import {curvesQueries} from "@/graphql/graphql.queries";

const executeQuery = async (query, variables) => {
  let cancel = () => {
    /* abort the request if it is in-flight */
  };

  const result = await new Promise((resolve, reject) => {
    let result;
    cancel = curvesGraphQLClient.subscribe(
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
  async curvesByPlateId(plateId) {
    const result = await executeQuery(curvesQueries.curvesByPlateId, {plateId})
    return result.data
  },
  async curvesThatIncludesWellId(wellId) {
    const result = await executeQuery(curvesQueries.curvesThatIncludesWellId, {wellId})
    return result.data
  }
}
