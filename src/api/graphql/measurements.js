import { apolloMeasurementsClient } from "@/graphql/apollo.clients";
import {measurementsQueries} from "@/graphql/graphql.queries";

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
        const result = await executeQuery(measurementsQueries.measurementsAll, {})
        return result.data
    },
    async measurementById(measurementId) {
        const result = await executeQuery(measurementsQueries.measurementById, {measurementId})
        return result.data
    },
    async measurementsColumnsById(measurementId) {
        const result = await executeQuery(measurementsQueries.measurementsColumnsById, {measurementId})
        return result.data
    },
    async measurementWellData(measurementId, wellColumn) {
        const result = await executeQuery(measurementsQueries.measurementWellData, {measurementId, wellColumn})
        return result.data
    }
}
