import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {apolloQueriesClient} from "@/graphql/apollo.clients";

const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

export default {
    exportPlateData(exportOptions) {
        const QUERY = gql`
            query exportPlateListData($exportDataOptions: ExportDataOptions) {
                plateData:exportPlateListData(exportDataOptions: $exportDataOptions) {
                    plateId
                    barcode
                    experimentId
                    experimentName
                    comment
                    plateTemplateId
                    validationStatus
                    approvalStatus
                    features {
                        featureId
                        featureName
                        protocolId
                        protocolName
                        resultSetId
                        wellType
                        stats {
                            name
                            value
                        }
                    }    
                }
            }
        `
        const exportDataOptions = {
            experimentId: exportOptions.experimentId,
            selectedFeatures: exportOptions.selectedFeatures.map(feature => {
                return {
                    featureId: feature.id,
                    featureName: feature.name,
                    protocolId: feature.protocolId,
                    protocolName: feature.protocol
                }
            }),
            includeInvalidatedPlates: exportOptions.plateFilter.includeInvalidatedPlates,
            includeDisapprovedPlates: exportOptions.plateFilter.includeDisapprovedPlates,
            includeSummeryPlateSummery: exportOptions.plateStats.summary,
            includeFeatureStats: exportOptions.plateStats.featureStats,
            includeWellTypeFeatureStats: exportOptions.plateStats.featureStatsByWellType,
        }
        const variables = {'exportDataOptions': exportDataOptions}
        return provideApolloClient(apolloQueriesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
    },
    exportWellData(exportOptions) {
        const QUERY = gql`
            query exportWellData($exportDataOptions: ExportDataOptions) {
                wellData:exportWellData(exportDataOptions: $exportDataOptions) {
                    plateId
                    barcode
                    experimentId
                    experimentName
                    validationStatus
                    approvalStatus
                    wellId
                    rowNr
                    columnNr
                    wellType
                    substanceName
                    concentration
                    features {
                        featureId
                        value
                    }
                }
            }
        `
        const exportDataOptions = {
            experimentId: exportOptions.experimentId,
            selectedFeatures: exportOptions.selectedFeatures.map(feature => {
                return {
                    featureId: feature.id,
                    featureName: feature.name,
                    protocolId: feature.protocolId,
                    protocolName: feature.protocol
                }
            }),
            includeInvalidatedPlates: exportOptions.plateFilter.includeInvalidatedPlates,
            includeDisapprovedPlates: exportOptions.plateFilter.includeDisapprovedPlates,
        }
        const variables = {'exportDataOptions': exportDataOptions}
        return provideApolloClient(apolloQueriesClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
    }
}
