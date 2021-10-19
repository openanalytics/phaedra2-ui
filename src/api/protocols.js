import axios from "axios";

export default {
    async getProtocolsByIds(ids) {
        try {
            const idsString = ids.join(",");
            const response = await axios.get(`http://localhost:3001/phaedra/protocol-service/protocols?ids=${idsString}`);
            return response.data;
        } catch (error) {
            // TODO
            console.error(error);
        }
    },
    async getAllProtocols() {
        // TODO
        return [];
    }
}
