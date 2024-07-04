import useChartData from "@/composable/chartData";
// import plateTrendMockData from "@/resources/plate_trend_mock_data.json"

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL) + '/charting-service'

export default function usePlateTrendChartData() {
    const { fetchData } = useChartData();
    async function getChartData(experimentId) {
        const url = apiURL + `/charts/plate_trend?experimentId=${experimentId}`
        const trendChartData = await fetchData(url);
        // const chartData = plateTrendMockData
        return trendChartData ?? []
    }

    return {
        getChartData
    };
}
