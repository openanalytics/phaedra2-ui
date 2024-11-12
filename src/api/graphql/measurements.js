import { apolloMeasurementsClient } from "@/graphql/apollo.clients";

const executeQuery = async (query, variables) => {
    let cancel = () => {
        /* abort the request if it is in-flight */
    };

    const result = await new Promise((resolve, reject) => {
        let result;
        cancel = apolloMeasurementsClient.subscribe(
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
    async measurementsAll() {
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
        const result = await executeQuery(query, {})
        return result.data
    },
    async measurementById(measurementId) {
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
        const result = await executeQuery(query, {measurementId})
        return result.data
    },
    async measurementsColumnsById(measurementId) {
      const query = `
          query measurementById($measurementId: ID) {
              wellColumns:measurementById(measurementId: $measurementId) {
                  wellColumns
              }
          }
      `
        const result = await executeQuery(query, {measurementId})
        return result.data
    },
    async measurementWellData(measurementId, wellColumn) {
        const query = `
            query measurementWellData($measurementId: ID, $wellColumn: String) {
                wellData:measurementDataByIdAndWellColumn(measurementId: $measurementId, wellColumn: $wellColumn)
            }
        `
        const result = await executeQuery(query, {measurementId, wellColumn})
        return result.data
    }
}
