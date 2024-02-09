import { apolloMeasurementsClient } from "@/graphql/apollo.clients";
import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'

const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

export default {
    measurementsAll() {
        const QUERY = gql`
            query measurements {
                measurements {
                    id
                    name
                    barcode
                    description
                    rows
                    columns
                    createdOn
                    createdBy
                }
            }
        `
        return provideApolloClient(apolloMeasurementsClient)(() => useQuery(QUERY, null, defaultOptions))
    },
    measurementById(measurementId) {
        const QUERY = gql`
            query measurementById {
                measurement:measurementById(measurementId: ${measurementId}) {
                    name
                    columns
                    rows
                    wellColumns
                }
            }
        `
        return provideApolloClient(apolloMeasurementsClient)(() => useQuery(QUERY, null, defaultOptions))
    },
    measurementWellData(measurementId, wellColumn) {
        const QUERY = gql`
            query measurementWellData {
                wellData: measurementDataByIdAndWellColumn(measurementId: ${measurementId}, wellColumn: "${wellColumn}")
            }
        `
        return provideApolloClient(apolloMeasurementsClient)(() => useQuery(QUERY, null, defaultOptions))
    }
}
