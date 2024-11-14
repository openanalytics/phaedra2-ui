import {chartsGraphQLClient} from "@/graphql/graphql.clients";
import {chartsQueries} from "@/graphql/graphql.queries";
import {useGraphQL} from "@/composable/useGraphQL";

export default {
  async basicPlot(type, plateId, protocolId, xFeatureId, yFeatureId, groupBy) {
    if (type === 'scatter') {
      return await this.scatterPlot(plateId, protocolId, xFeatureId, yFeatureId,
          groupBy)
    } else if (type === 'bar') {
      return await this.barPlot(plateId, protocolId, yFeatureId, groupBy)
    } else if (type === 'box') {
      if (groupBy && groupBy !== 'none') {
        return await this.boxPlotWithGrouping(plateId, protocolId, yFeatureId,
            groupBy)
      } else {
        return await this.basicBoxPlot(plateId, protocolId, yFeatureId)
      }
    } else if (type === 'histogram') {
      return await this.histogramPlot(plateId, protocolId, yFeatureId, groupBy)
    }
  },
  async scatterPlot(plateId, protocolId, xFeatureId, yFeatureId, groupBy) {
    const chartsClient = useGraphQL(chartsGraphQLClient)
    const result = await chartsClient.executeQuery(chartsQueries.scatterPlot,
        {plateId, protocolId, xFeatureId, yFeatureId, groupBy});
    return result.data
  },
  async barPlot(plateId, protocolId, featureId, groupBy) {
    const chartsClient = useGraphQL(chartsGraphQLClient)
    const result = await chartsClient.executeQuery(chartsQueries.barPlot,
        {plateId, protocolId, featureId, groupBy});
    return result.data
  },
  async histogramPlot(plateId, protocolId, featureId, groupBy) {
    const chartsClient = useGraphQL(chartsGraphQLClient)
    const result = await chartsClient.executeQuery(chartsQueries.histogramPlot,
        {plateId, protocolId, featureId, groupBy});
    return result.data
  },
  async basicBoxPlot(plateId, protocolId, featureId) {
    const chartsClient = useGraphQL(chartsGraphQLClient)
    const result = await chartsClient.executeQuery(chartsQueries.basicBoxPlot,
        {plateId, protocolId, featureId})
    return result.data
  },
  async boxPlotWithGrouping(plateId, protocolId, featureId, groupBy) {
    const chartsClient = useGraphQL(chartsGraphQLClient)
    const result = await chartsClient.executeQuery(
        chartsQueries.boxPlotWithGrouping,
        {plateId, protocolId, featureId, groupBy})
    return result.data
  }
}
