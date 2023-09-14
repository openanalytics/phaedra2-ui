import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {computed} from "vue";
import {apolloCurvesClient} from "@/graphql/apollo.clients";

const defaultOptions = { fetchPolicy: 'no-cache'}

export default {
    curvesByPlateId(plateId) {
        const QUERY = gql`
            query getCurvesByPlateId($plateId: ID) {
                curves:getCurvesByPlateId(plateId: $plateId) {
                    id
                    plateId
                    protocolId
                    featureId
                    resultSetId
                    substanceName
                    substanceType
                    fitDate
                    version
                    wells
                    wellConcentrations
                    featureValues
                    xAxisLabels
                    plotDoseData
                    plotPredictionData
                    weights
                    pIC50
                    pIC50Censor
                    pIC50StdErr
                    eMax
                    eMin
                    eMaxConc
                    eMinConc
                    pIC80
                    slope
                    bottom
                    top
                    slopeLowerCI
                    slopeUpperCI
                    residualVariance
                    warning
                }
            }
        `
        const variables = {'plateId': plateId}
        const query = provideApolloClient(apolloCurvesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.curves ?? null)
    }
}
