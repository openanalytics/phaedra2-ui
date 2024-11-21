import {measurementsGraphQLClient} from "@/graphql/graphql.clients";
import {measurementsQueries} from "@/graphql/graphql.queries";
import {useGraphQL} from "@/composable/useGraphQL";

export default {
  async measurementsAll() {
    const measClient = useGraphQL(measurementsGraphQLClient)
    const result = await measClient.executeQuery(
        measurementsQueries.measurementsAll, {})
    return result.data
  },
  async measurementById(measurementId) {
    const measClient = useGraphQL(measurementsGraphQLClient)
    const result = await measClient.executeQuery(
        measurementsQueries.measurementById, {measurementId})
    return result.data
  },
  async measurementsColumnsById(measurementId) {
    const measClient = useGraphQL(measurementsGraphQLClient)
    const result = await measClient.executeQuery(
        measurementsQueries.measurementsColumnsById, {measurementId})
    return result.data
  },
  async measurementWellData(measurementId, wellColumn) {
    const measClient = useGraphQL(measurementsGraphQLClient)
    const result = await measClient.executeQuery(
        measurementsQueries.measurementWellData, {measurementId, wellColumn})
    return result.data
  }
}
