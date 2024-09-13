import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {apolloChartsClient} from "@/graphql/apollo.clients";

const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

const executeQuery = (query, variables) => {
    return provideApolloClient(apolloChartsClient)(
        () => useQuery(gql`${query}`, variables, defaultOptions));
}

export default {
    basicPlot(type, plateId, protocolId, xFeatureId, yFeatureId, groupBy){
        if (type === 'scatter')
            return this.scatterPlot(plateId, protocolId, xFeatureId, yFeatureId, groupBy)
        else if (type === 'bar')
            return this.barPlot(plateId, protocolId, yFeatureId, groupBy)
        else if (type === 'box')
            if (groupBy && groupBy !== 'none')
                return this.boxPlotWithGrouping(plateId, protocolId, yFeatureId, groupBy)
            else
                return this.basicBoxPlot(plateId, protocolId, yFeatureId)
        else if (type === 'histogram')
            return this.histogramPlot(plateId, protocolId, yFeatureId, groupBy)
    },
    scatterPlot(plateId, protocolId, xFeatureId, yFeatureId, groupBy){
        const query = `
            query scatterPlot($plateId: ID, $protocolId:ID, $xFeatureId: ID, $yFeatureId: ID, $groupBy: String) {
                scatterPlot(plateId: $plateId, protocolId: $protocolId xFeatureId: $xFeatureId, yFeatureId: $yFeatureId, groupBy: $groupBy) {
                    data{
                        x:xValue
                        y:yValue
                        mode
                        name
                        type
                    }
                    layout {
                        chartTitle
                        xAxisLabel
                        yAxisLabel
                    }
                }
            }
        `
        return executeQuery(query, {plateId, protocolId, xFeatureId, yFeatureId, groupBy});
    },
    barPlot(plateId, protocolId, featureId, groupBy){
        const query = `
            query barPlot($plateId: ID, $protocolId: ID, $featureId: ID, $groupBy: String) {
                barPlot(plateId: $plateId, protocolId: $protocolId, featureId: $featureId, groupBy: $groupBy) {
                    data{
                        x:xValue
                        y:yValue
                        mode
                        name
                        type
                    }
                    layout {
                        chartTitle
                        xAxisLabel
                        yAxisLabel
                    }
                }
            }
        `
        return executeQuery(query, {plateId, protocolId, featureId, groupBy});
    },
    histogramPlot(plateId, protocolId, featureId, groupBy){
        const query = `
            query histogramPlot($plateId: ID, $protocolId: ID, $featureId: ID, $groupBy: String) {
                histogramPlot(plateId: $plateId, protocolId: $protocolId, featureId: $featureId, groupBy: $groupBy) {
                    data{
                        x:xValue
                        mode
                        name
                        type
                    }
                    layout {
                        chartTitle
                        xAxisLabel
                    }
                }
            }
        `
        executeQuery(query, {plateId, protocolId, featureId, groupBy});
    },
    basicBoxPlot(plateId, protocolId, featureId) {
        const query = `
            query boxPlot($plateId: ID, $protocolId: ID, $featureId: ID) {
                boxPlot(plateId: $plateId, protocolId: $protocolId, featureId: $featureId) {
                    data{
                        y:yValue
                        mode
                        name
                        type
                    }
                    layout {
                        chartTitle
                        yAxisLabel
                    }
                }
            }
        `
        executeQuery(query, {plateId, protocolId, featureId})
    },
    boxPlotWithGrouping(plateId, protocolId, featureId, groupBy) {
        const query = `
            query boxPlotWithGrouping($plateId: ID, $protocolId: ID, $featureId: ID, $groupBy: String) {
                boxPlot:boxPlotWithGrouping(plateId: $plateId, protocolId: $protocolId, featureId: $featureId, groupBy: $groupBy) {
                    data{
                        y:yValue
                        mode
                        name
                        type
                    }
                    layout {
                        chartTitle
                        yAxisLabel
                    }
                }
            }
        `
        executeQuery(query, {plateId, protocolId, featureId, groupBy})
    }
}
