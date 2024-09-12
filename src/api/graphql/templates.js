import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {apolloPlatesClient} from "@/graphql/apollo.clients";

const defaultOptions = {fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

const executeQuery = (query, variables) => {
  return provideApolloClient(apolloPlatesClient)(
      () => useQuery(gql`${query}`, variables, defaultOptions));
}

export default {
  templates() {
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
    return executeQuery(query, {})
  },
  templateById(plateTemplateId) {
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
    return executeQuery(query, {plateTemplateId})
  }
}
