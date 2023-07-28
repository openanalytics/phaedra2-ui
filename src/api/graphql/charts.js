import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {computed} from "vue";
import { apolloChartsClient } from "@/graphql/apollo.clients";

const defaultOptions = { fetchPolicy: 'no-cache'}

export default {
    basicPlot(type, plateId, xFeatureId, yFeatureId, groupBy){
        if (type === 'scatter')
            return this.scatterPlot(plateId, xFeatureId, yFeatureId, groupBy)
        else if (type === 'bar')
            return this.barPlot(plateId, xFeatureId, yFeatureId, groupBy)
        else if (type === 'box')
            if (groupBy && groupBy !== 'none')
                return this.boxPlotWithGrouping(plateId, yFeatureId, groupBy)
            else
                return this.basicBoxPlot(plateId, yFeatureId)
    },
    scatterPlot(plateId, xFeatureId, yFeatureId, groupBy){
        const QUERY = gql`
            query scatterPlot($plateId: ID, $xFeatureId: ID, $yFeatureId: ID, $groupBy: String) {
                scatterPlot(plateId: $plateId, xFeatureId: $xFeatureId, yFeatureId: $yFeatureId, groupBy: $groupBy) {
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
        const variables = {'plateId': plateId, 'xFeatureId': xFeatureId, 'yFeatureId': yFeatureId, 'groupBy': groupBy}
        const query = provideApolloClient(apolloChartsClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.scatterPlot ?? [])
    },
    barPlot(plateId, xFeatureId, yFeatureId, groupBy){
        const QUERY = gql`
            query barPlot($plateId: ID, $xFeatureId: ID, $yFeatureId: ID, $groupBy: String) {
                barPlot(plateId: $plateId, xFeatureId: $xFeatureId, yFeatureId: $yFeatureId, groupBy: $groupBy) {
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
        const variables = {'plateId': plateId, 'xFeatureId': xFeatureId, 'yFeatureId': yFeatureId, 'groupBy': groupBy}
        const query = provideApolloClient(apolloChartsClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.barPlot ?? [])
    },
    basicBoxPlot(plateId, featureId) {
        const QUERY = gql`
            query boxPlot($plateId: ID, $featureId: ID) {
                boxPlot(plateId: $plateId, featureId: $featureId) {
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
        const variables = {'plateId': plateId, 'featureId': featureId}
        const query = provideApolloClient(apolloChartsClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.boxPlot ?? [])
    },
    boxPlotWithGrouping(plateId, featureId, groupBy) {
        const QUERY = gql`
            query boxPlotWithGrouping($plateId: ID, $featureId: ID, $groupBy: String) {
                boxPlot:boxPlotWithGrouping(plateId: $plateId, featureId: $featureId, groupBy: $groupBy) {
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
        const variables = {'plateId': plateId, 'featureId': featureId, 'groupBy': groupBy}
        const query = provideApolloClient(apolloChartsClient)(() => useQuery(QUERY,
            variables,
            defaultOptions))
        return computed(() => query.result.value?.boxPlot ?? [])
    }
}
