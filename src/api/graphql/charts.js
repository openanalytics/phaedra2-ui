import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {computed} from "vue";
import { apolloChartsClient } from "@/graphql/apollo.clients";

const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

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
        const QUERY = gql`
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
        const variables = {'plateId': plateId, 'protocolId': protocolId, 'xFeatureId': xFeatureId, 'yFeatureId': yFeatureId, 'groupBy': groupBy}
        const query = provideApolloClient(apolloChartsClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.scatterPlot ?? [])
    },
    barPlot(plateId, protocolId, featureId, groupBy){
        const QUERY = gql`
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
        const variables = {'plateId': plateId, 'protocolId': protocolId, 'featureId': featureId, 'groupBy': groupBy}
        const query = provideApolloClient(apolloChartsClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.barPlot ?? [])
    },
    histogramPlot(plateId, protocolId, featureId, groupBy){
        const QUERY = gql`
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
        const variables = {'plateId': plateId, 'protocolId': protocolId, 'featureId': featureId, 'groupBy': groupBy}
        const query = provideApolloClient(apolloChartsClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.histogramPlot ?? [])
    },
    basicBoxPlot(plateId, protocolId, featureId) {
        const QUERY = gql`
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
        const variables = {'plateId': plateId, 'protocolId': protocolId, 'featureId': featureId}
        const query = provideApolloClient(apolloChartsClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.boxPlot ?? [])
    },
    boxPlotWithGrouping(plateId, protocolId, featureId, groupBy) {
        const QUERY = gql`
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
        const variables = {'plateId': plateId, 'protocolId': protocolId, 'featureId': featureId, 'groupBy': groupBy}
        const query = provideApolloClient(apolloChartsClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.boxPlot ?? [])
    }
}
