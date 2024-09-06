import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {apolloCurvesClient} from "@/graphql/apollo.clients";

const defaultOptions = {fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

const executeQuery = (query, variables) => {
  return provideApolloClient(apolloCurvesClient)(
      () => useQuery(gql`${query}`, variables, defaultOptions));
}

export default {
  curvesByPlateId(plateId) {
    const query = `
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
                    curveProperties {
                        name
                        numericValue
                        stringValue
                    }
                }
            }
        `
    return executeQuery(query, {plateId})
  },
  curvesThatIncludesWellId(wellId) {
    const query = `
            query getCurvesThatIncludesWellId($wellId: ID) {
                curves:getCurvesThatIncludesWellId(wellId: $wellId) {
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
                    curveProperties {
                        name
                        numericValue
                        stringValue
                    }
                }
            }
        `
    return executeQuery(query, {wellId})
  }
}
