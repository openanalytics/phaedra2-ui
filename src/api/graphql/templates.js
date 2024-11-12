import {platesGraphQLClient} from "@/graphql/apollo.clients";

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
    const query = `
            query getPlateTemplates {
                plateTemplates:getPlateTemplates {
                    id
                    name
                    rows
                    columns
                    description
                    tags
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                }
            }
        `
    const result = await executeQuery(query, {})
    return result.data
  },
  async templateById(plateTemplateId) {
    const query = `
            query getPlateTemplateById($plateTemplateId: ID) {
                plateTemplate:getPlateTemplateById(plateTemplateId: $plateTemplateId) {
                    id
                    name
                    rows
                    columns
                    description
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                    tags
                    properties {
                        propertyName
                        propertyValue
                    }
                    wells {
                        id
                        plateTemplateId
                        description
                        skipped
                        row
                        column
                        wellType
                        substanceType
                        substanceName
                        concentration
                    }
                }
            }
        `
    const result = await executeQuery(query, {plateTemplateId})
    return result.data
  }
}
