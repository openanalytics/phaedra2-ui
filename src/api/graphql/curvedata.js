import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {computed} from "vue";
import {apolloCurvesClient} from "@/graphql/apollo.clients";

const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

export default {
    curvesByPlateId(plateId) {
        const QUERY = gql`
            query getCurvesByPlateId {
                curves:getCurvesByPlateId(plateId: ${plateId}) {
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
        return provideApolloClient(apolloCurvesClient)(() => useQuery(QUERY,
            null,
            defaultOptions))
    }
}
