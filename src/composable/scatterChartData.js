import useChartData from "@/composable/chartData";

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL) + '/charting-service'

export default function useScatterChartData() {
    const { fetchData } = useChartData();
    async function getChartData(plateId, protocolId, xParam, xParamType, yParam, yParamType, groupBy) {
        const url = apiURL + `/charts/scatter?plateId=${plateId}&protocolId=${protocolId}&xFieldName=${xParam}&xFieldType=${xParamType}&yFieldName=${yParam}&yFieldType=${yParamType}&groupBy=${groupBy}`
        const scatterData = await fetchData(url);
        return scatterData ?? []
    }

    return {
        getChartData
    };
}
