import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/protocol-service';

export default {
    async getByIds(ids) {
        try {
            const idsString = ids.join(",");
            const response = await axios.get(apiURL + `/features?ids=${idsString}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    async getByProtocolId(protocolId) {
        let result = null;
        await axios.get(apiURL + '/protocols/' + protocolId + '/features')
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    }
}
