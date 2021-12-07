import axios from "axios";

export default {
    async getProtocolById(protocolId) {
        console.log('Making a backend call...');
        let result = null;
        await axios.get('http://localhost:6030/phaedra/protocol-service/protocols/' + protocolId)
            .then(response => {
                result = response.data;
            })
        return result;
    },
    async getProtocolsByIds(ids) {
        try {
            const idsString = ids.join(",");
            const response = await axios.get(`http://localhost:6030/phaedra/protocol-service/protocols?ids=${idsString}`);
            return response.data;
        } catch (error) {
            // TODO
            console.error(error);
        }
    },
    async getAllProtocols() {
      console.log('Makeing a backend call...')
        let result = null;
        await axios.get('http://localhost:6030/phaedra/protocol-service/protocols')
            .then(response => {
                result = response.data;
            })
        return result;
    },
    async createNewProtocol(newProtocol) {
        console.log('Making a backend call...')
        let result = null;
        await axios.post('http://localhost:6030/phaedra/protocol-service/protocols', newProtocol)
            .then(response => {
                if (response.status === 201)
                    result = response.data;
            })
        return result;
    },
    async deleteProtocol(protocol) {
        console.log('Making a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6030/phaedra/protocol-service/protocols/' + protocol.id;
        await axios.delete(requestUrl)
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
        console.log('Making a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6030/phaedra/protocol-service/protocols/'
        await axios.put(requestUrl,protocol)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async addNewFeature(newFeature) {
        console.log('Making a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6030/phaedra/protocol-service/features'
        axios.post(requestUrl, newFeature)
            .then(response => {
                if (response.status === 201) {
                    result = response.data
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        return result
    }
}
