import axios from "axios";

async function fetchData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        // err.response.data usually contains the actual error message from the API
        // throw new Error(err.response?.data?.message || err.message);
        console.log("Error: " + (err.response?.data?.message || err.message))
    }
}

export default function useChartData() {
    return {
        fetchData,
    };
}
