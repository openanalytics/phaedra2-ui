import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {apolloQueriesClient} from "@/graphql/apollo.clients";

const defaultOptions = {fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

const executeQuery = (query, variables) => {
  return provideApolloClient(apolloQueriesClient)(
      () => useQuery(gql`${query}`, variables, defaultOptions));
}

export default {
  exportPlateData(exportOptions) {
    const query = `
        query exportPlateListData($exportPlateDataOptions: ExportPlateDataOptions) {
            plateData:exportPlateListData(exportPlateDataOptions: $exportPlateDataOptions) {
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
    const exportPlateDataOptions = {
      experimentId: exportOptions.experimentId,
      selectedFeatures: exportOptions.selectedFeatures.map(feature => {
        return {
          featureId: feature.id,
          featureName: feature.name,
          protocolId: feature.protocolId,
          protocolName: feature.protocol
        }
      }),
      plateFilterOptions: {
        validatedBy: exportOptions.plateFilter.validationFilter.username,
        validateOnBegin: exportOptions.plateFilter.validationFilter.validationDate.start,
        validateOnEnd: exportOptions.plateFilter.validationFilter.validationDate.end,
        approvedBy: exportOptions.plateFilter.approvalFilter.username,
        approvedOnBegin: exportOptions.plateFilter.approvalFilter.approvalDate.start,
        approvedOnEnd: exportOptions.plateFilter.approvalFilter.approvalDate.end,
        includeInvalidatedPlates: exportOptions.plateFilter.includeInvalidatedPlates,
        includeDisapprovedPlates: exportOptions.plateFilter.includeDisapprovedPlates,
      },
      includeSummeryPlateSummery: exportOptions.plateStats.summary,
      includeFeatureStats: exportOptions.plateStats.featureStats,
      includeWellTypeFeatureStats: exportOptions.plateStats.featureStatsByWellType,
    }
    return executeQuery(query, {exportPlateDataOptions})
  },
  exportWellData(exportOptions) {
    const query = `
        query exportWellData($exportWellDataOptions: ExportWellDataOptions) {
            wellData:exportWellData(exportWellDataOptions: $exportWellDataOptions) {
                plateId
                barcode
                experimentName
                validationStatus
                approvalStatus
                wellId
                rowNr
                columnNr
                wellType
                substanceName
                substanceType
                concentration
                features {
                    featureId
                    featureName
                    protocolId
                    protocolName
                    value
                }
            }
        }
    `
    const exportWellDataOptions = {
      experimentId: exportOptions.experimentId,
      selectedFeatures: exportOptions.selectedFeatures.map(feature => {
        return {
          featureId: feature.id,
          featureName: feature.name,
          protocolId: feature.protocolId,
          protocolName: feature.protocol
        }
      }),
      plateFilterOptions: {
        validatedBy: exportOptions.plateFilter.validationFilter.username,
        validateOnBegin: exportOptions.plateFilter.validationFilter.validationDate.start,
        validateOnEnd: exportOptions.plateFilter.validationFilter.validationDate.end,
        approvedBy: exportOptions.plateFilter.approvalFilter.username,
        approvedOnBegin: exportOptions.plateFilter.approvalFilter.approvalDate.start,
        approvedOnEnd: exportOptions.plateFilter.approvalFilter.approvalDate.end,
        includeInvalidatedPlates: exportOptions.plateFilter.includeInvalidatedPlates,
        includeDisapprovedPlates: exportOptions.plateFilter.includeDisapprovedPlates,
      },
      includeRejectedWells: exportOptions.wellFilter.includeRejectedWells,
      wellTypeFilter: exportOptions.wellFilter.wellTypes,
      includeBasicCurveProperties: exportOptions.includeAllCurveProperties,
      includeAllCurveProperties: exportOptions.includeAllCurveProperties
    }
    return executeQuery(query, {exportWellDataOptions})
  }
}
