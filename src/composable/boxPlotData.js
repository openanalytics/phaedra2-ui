import useChartData from "@/composable/chartData";

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL) + '/charting-service'

export default function useBoxPlotData() {
    const { fetchData } = useChartData();
    async function getChartData(plateId, protocolId, yParam, yParamType) {
        const url = apiURL + `/charts/box?plateId=${plateId}&protocolId=${protocolId}&yFieldName=${yParam}&yFieldType=${yParamType}`
        const boxPlotData = await fetchData(url);
        return boxPlotData
    }

    return {
        getChartData
    };
}
