import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/protocol-service';

export default {
    async getProtocolById(protocolId) {
        let result = null;
        await axios.get(apiURL + '/protocols/' + protocolId)
            .then(response => {
                result = response.data;
            })
        return result;
    },
    async getProtocolsByIds(ids) {
        try {
            const idsString = ids.join(",");
            const response = await axios.get(apiURL + `/protocols?ids=${idsString}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    async getAllProtocols() {
        let result = null;
        await axios.get(apiURL + '/protocols')
            .then(response => {
                result = response.data;
            })
        return result;
    },
    async createNewProtocol(newProtocol) {
        let result = null;
        await axios.post(apiURL + '/protocols', newProtocol)
            .then(response => {
                if (response.status === 201)
                    result = response.data;
            })
        return result;
    },
    async deleteProtocol(protocolId) {
        let result = null;
        await axios.delete(apiURL + '/protocols/' + protocolId)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async editProtocol(protocol) {
        let result = null;
        await axios.put(apiURL + '/protocols', protocol)
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
