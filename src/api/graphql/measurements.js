import {apolloMeasurementClient} from "@/graphql/apollo.clients";
import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {computed} from "vue";

const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

export default {

}
