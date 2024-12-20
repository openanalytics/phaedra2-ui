import {curvesGraphQLClient} from "@/graphql/graphql.clients";
import {curvesQueries} from "@/graphql/graphql.queries";
import {useGraphQL} from "@/composable/useGraphQL";

export default {
  async curvesByPlateId(plateId) {
    const curvesClient = useGraphQL(curvesGraphQLClient)
    const result = await curvesClient.executeQuery(
        curvesQueries.curvesByPlateId, {plateId})
    return result.data
  },
  async curvesThatIncludesWellId(wellId) {
    const curvesClient = useGraphQL(curvesGraphQLClient)
    const result = await curvesClient.executeQuery(
        curvesQueries.curvesThatIncludesWellId, {wellId})
    return result.data
  }
}
