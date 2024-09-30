import {apolloMeasurementsClient} from "@/graphql/apollo.clients";
import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'

const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

const executeQuery = (query, variables) => {
    return provideApolloClient(apolloMeasurementsClient)(
        () => useQuery(gql`${query}`, variables, defaultOptions));
}

export default {
    measurementsAll() {
        const query = `
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
        return executeQuery(query, {})
    },
    measurementById(measurementId) {
        const query = `
            query measurementById($measurementId: ID) {
                measurement:measurementById(measurementId: $measurementId) {
                    name
                    barcode
                    columns
                    rows
                    wellColumns
                    subWellColumns
                }
                wellData:measurementDataById(measurementId: $measurementId) {
                    measurementId
                    column
                    data
                }
            }
        `
        return executeQuery(query, {measurementId})
    },
    measurementsColumnsById(measurementId) {
      const query = `
          query measurementById($measurementId: ID) {
              wellColumns:measurementById(measurementId: $measurementId) {
                  wellColumns
              }
          }
      `
        return executeQuery(query, {measurementId})
    },
    measurementWellData(measurementId, wellColumn) {
        const query = `
            query measurementWellData($measurementId: ID, $wellColumn: String) {
                wellData:measurementDataByIdAndWellColumn(measurementId: $measurementId, wellColumn: $wellColumn)
            }
        `
        return executeQuery(query, {measurementId, wellColumn})
    }
}
