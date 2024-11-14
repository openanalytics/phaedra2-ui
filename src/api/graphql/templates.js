import {platesGraphQLClient} from "@/graphql/apollo.clients";
import {templatesQueries} from "@/graphql/graphql.queries";

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
  async templates() {
    const result = await executeQuery(templatesQueries.templates, {})
    return result.data
  },
  async templateById(plateTemplateId) {
    const result = await executeQuery(templatesQueries.templateById, {plateTemplateId})
    return result.data
  }
}
