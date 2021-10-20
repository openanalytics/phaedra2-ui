import axios from "axios";

export default {
    async getByIds(ids) {
        try {
            const idsString = ids.join(",");
            const response = await axios.get(`http://localhost:3001/phaedra/protocol-service/features?ids=${idsString}`);
            return response.data;
        } catch (error) {
            // TODO
            console.error(error);
        }
    },
    async getByProtocolId(protocolId) {
        try {
            const response = await axios.get(`http://localhost:3001/phaedra/protocol-service/protocols/${protocolId}/features`);
            return response.data;
        } catch (error) {
            // TODO
            console.error(error);
        }
    }
}
