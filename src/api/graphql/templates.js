import {platesGraphQLClient} from "@/graphql/graphql.clients";
import {templatesQueries} from "@/graphql/graphql.queries";
import {useGraphQL} from "@/composable/useGraphQL";

export default {
  async templates() {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(templatesQueries.templates,
        {})
    return result.data
  },
  async templateById(plateTemplateId) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(
        templatesQueries.templateById, {plateTemplateId})
    return result.data
  }
}
