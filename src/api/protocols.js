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
    }
}
