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
        try {
            console.log('Making a backend call...')
            const requestUrl = 'http://localhost:6030/phaedra/protocol-service/protocols';
            const response = await axios.post(requestUrl, newProtocol);
            return response.data;
        } catch (err) {
            console.error(err);
        }
    },
    async deleteProtocol(protocolId) {
        try {
            console.log('Making a backend call...');
            const requestUrl = 'http://localhost:6030/phaedra/protocol-service/protocols/' + protocolId;
            const response = await axios.delete(requestUrl);
            return response.data;
        } catch (err) {
            console.error(err);
        }
    },
    async editProtocol(protocol) {
        try {
            console.log('Making a backend call...');
            const requestUrl = 'http://localhost:6030/phaedra/protocol-service/protocols/'
            const response = await axios.put(requestUrl,protocol)
            return response.data;
        } catch (err) {
            console.error(err);
        }
    },
    async addNewFeature(newFeature) {
        try {
            console.log('Making a backend call...');
            const requestUrl = 'http://localhost:6030/phaedra/protocol-service/features'
            const response = await axios.post(requestUrl, newFeature);
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }
}
