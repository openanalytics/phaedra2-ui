import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {computed} from "vue";
import {apolloPlatesClient} from "@/graphql/apollo.clients";

const defaultOptions = { fetchPolicy: 'no-cache'}

export default {
    projects() {
        const QUERY = gql`
            query getProjects {
                projects:getProjects {
                    id
                    name
                    description
                    createdOn
                    createdBy
                    tags       
                }
            }
        `
        const query = provideApolloClient(apolloPlatesClient)(() => useQuery(QUERY, null, defaultOptions))
        return computed(() => query.result.value?.projects ?? [])
    }
}
