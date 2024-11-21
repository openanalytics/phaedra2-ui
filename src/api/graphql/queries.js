import {queriesGraphQLClient} from "@/graphql/graphql.clients";
import {useGraphQL} from "@/composable/useGraphQL";
import {queryServiceQueries} from "@/graphql/graphql.queries";

export default {
  exportPlateData(exportOptions) {
    const queriesClient = useGraphQL(queriesGraphQLClient)
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
    return queriesClient.executeQuery(queryServiceQueries.exportPlateData, {exportPlateDataOptions})
  },
  exportWellData(exportOptions) {
    const queriesClient = useGraphQL(queriesGraphQLClient)
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
    return queriesClient.executeQuery(queryServiceQueries.exportWellData, {exportWellDataOptions})
  }
}
