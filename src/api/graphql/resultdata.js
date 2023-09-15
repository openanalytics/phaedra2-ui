import {apolloResultDataClient} from "@/graphql/apollo.clients";
import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {computed} from "vue";

const defaultOptions = { fetchPolicy: 'no-cache'}

export default {
    protocolsByPlateId(plateId) {
        const PROTOCOLS_BY_PLATE_ID_QUERY = gql`
            query protocolsByPlateId($plateId: ID) {
                protocols: protocolsByPlateId (plateId: $plateId) {
                    protocolId
                    protocolName
                    features {
                        featureId
                        featureName
                    }
                }
            }
        `
        const variables = {'plateId': plateId}

        const query = provideApolloClient(apolloResultDataClient)(()=> useQuery(PROTOCOLS_BY_PLATE_ID_QUERY,
            variables,
            defaultOptions
        ))
        return computed(() => query.result.value?.protocols ?? [])
    },
    calculationsByPlateId(plateId) {

    },
    featureValuesByPlateIdAndFeatureId(plateId, featureId){
        const FEATURE_VALUES_BY_PLATE_ID_AND_FEATURE_ID_QUERY = gql`
            query featureValuesByPlateIdAndFeatureId($plateId: ID, $featureId: ID) {
                featureValuesByPlateIdAndFeatureId (plateId: $plateId, featureId: $featureId) {
                    value
                }
            }
        `
        const variables = {'plateId': plateId, 'featureId': featureId}
        const query = provideApolloClient(apolloResultDataClient)(()=> useQuery(FEATURE_VALUES_BY_PLATE_ID_AND_FEATURE_ID_QUERY,
            variables,
            defaultOptions
        ))
        return computed(() => query.result.value?.featureValuesByPlateIdAndFeatureId?.map(fv => fv.value ?? []))
    },
    featureValuesByPlateAndFeatureIds(plateId, xFeatureId, yFeatureId){
        const QUERY = gql`
            query featureValuesByPlateIdAndFeatureId($plateId: ID, $xFeatureId: ID, $yFeatureId: ID) {
                xFeatureValues: featureValuesByPlateIdAndFeatureId (plateId: $plateId, featureId: $xFeatureId) {
                    value
                    wellId
                    wellType
                    row
                    column
                }
                yFeatureValues: featureValuesByPlateIdAndFeatureId (plateId: $plateId, featureId: $yFeatureId) {
                    value
                    wellId
                    wellType
                    row
                    column
                }
            }
        `
        const variables = {'plateId': plateId, 'xFeatureId': xFeatureId, 'yFeatureId': yFeatureId}
        const query = provideApolloClient(apolloResultDataClient)(()=> useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => {
            return {
                'xFeatureValues': query.result.value?.xFeatureValues?.map(fv => fv.value ?? []),
                'yFeatureValues': query.result.value?.yFeatureValues?.map(fv => fv.value ?? [])
            }
        })
    },
    resultSetsByPlateId(plateId) {
        const QUERY = gql`
            query resultSetsByPlateId($plateId: ID) {
                resultSets: resultSetsByPlateId(plateId: $plateId) {
                    id
                    executionStartTimeStamp
                    executionEndTimeStamp
                    measId
                    protocolId
                    outcome
                    errorsText
                }
            }
        `
        const variables = {'plateId': plateId}
        const query = provideApolloClient(apolloResultDataClient)(()=> useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.resultSets ?? [])
    },
    resultSetFeatureStats(resultSetId) {
        const QUERY = gql`
            query resultSetsByPlateId($resultSetId: ID) {
                rsFeatureStats: resultSetFeatureStats(resultSetId: $resultSetId) {
                    featureId
                    statisticName
                    value
                    statusCode
                    statusMessage
                }
            }
        `
        const variables = {'resultSetId': resultSetId}
        const query = provideApolloClient(apolloResultDataClient)(()=> useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.rsFeatureStats ?? [])
    }
}