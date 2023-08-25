import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {computed} from "vue";
import {apolloPlatesClient} from "@/graphql/apollo.clients";

const defaultOptions = { fetchPolicy: 'no-cache'}

export default {
    templates() {
        const QUERY = gql`
            query getPlateTemplates {
                getPlateTemplates {
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
        const query = provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY, null, defaultOptions))
        return computed(() => query.result.value?.getPlateTemplates ?? [])
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
        const query = provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.plateTemplate ?? null)
    }
}
