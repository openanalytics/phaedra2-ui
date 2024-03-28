import useChartData from "@/composable/chartData";

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL) + '/charting-service'

export default function useHistogramData() {
    const { fetchData } = useChartData();
    async function getChartData(plateId, protocolId, xParam, xParamType, groupBy) {
        const url = apiURL + `/charts/histogram?plateId=${plateId}&protocolId=${protocolId}&xFieldName=${xParam}&xFieldType=${xParamType}&groupBy=${groupBy}`
        const histogramData = await fetchData(url);
        return histogramData ?? []
    }

    return {
        getChartData
    };
}
