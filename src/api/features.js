import axios from "axios";

export default {
    async getByIds(ids) {
        try {
            const idsString = ids.join(",");
            const response = await axios.get(`http://localhost:6030/phaedra/protocol-service/features?ids=${idsString}`);
            return response.data;
        } catch (error) {
            // TODO
            console.error(error);
        }
    },
    async getByProtocolId(protocolId) {
        console.log('Making a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6030/phaedra/protocol-service/protocols/' + protocolId + '/features'
        await axios.get(requestUrl)
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
