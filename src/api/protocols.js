import axios from "axios";
import FormatUtils from "@/lib/FormatUtils";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/protocol-service';

export default {
    async getProtocolById(protocolId) {
        const response = await axios.get(apiURL + '/protocols/' + protocolId);
        return response.data;
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
        const response = await axios.get(apiURL + '/protocols');
        return response.data;
    },
    async createNewProtocol(newProtocol) {
        const response = await axios.post(apiURL + '/protocols', newProtocol)
        if (response.status === 201) return response.data;
    },
    async deleteProtocol(protocolId) {
        try {
            const response = await axios.delete(apiURL + '/protocols/' + protocolId);
            if (response.status === 200) return response.data;
        } catch(err) {
            console.log(err);
        }
    },
    async editProtocol(protocol) {
        try {
            // protocol.createdOn = FormatUtils.formatDate(protocol.createdOn)
            // protocol.updatedOn = FormatUtils.formatDate(protocol.updatedOn)
            const response = await axios.put(apiURL + '/protocols/' + protocol.id, protocol);
            if (response.status === 200) {
                return response.data;
            }
        } catch (err) {
            console.log(err);
            return protocol;
        }
    }
}
