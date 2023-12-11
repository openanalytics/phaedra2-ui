import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {computed} from "vue";
import {apolloPlatesClient} from "@/graphql/apollo.clients";

const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

export default {
    templates() {
        const QUERY = gql`
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
                }
            }
        `
        return provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY, null, defaultOptions))
    },
    templateById(plateTemplateId) {
        const QUERY = gql`
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
        const variables = {'plateTemplateId': plateTemplateId}
        return provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
    }
}
