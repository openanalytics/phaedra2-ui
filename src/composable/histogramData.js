import useChartData from "@/composable/chartData";

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL) + '/charting-service'

export default function useHistogramData() {
    const { fetchData } = useChartData();
    async function getChartData(plateId, protocolId, xParam, xParamType) {
        const url = apiURL + `/charts/histogram?plateId=${plateId}&protocolId=${protocolId}&xFieldName=${xParam}&xFieldType=${xParamType}`
        const histogramData = await fetchData(url);
        return histogramData
    }

    return {
        getChartData
    };
}
