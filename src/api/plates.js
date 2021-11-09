import axios from "axios";

export default {
    async getPlateById(id) {
      console.log('Mocking a backend call...');
      let result = null;
      const requestUrl = 'http://localhost:6010/phaedra/plate-service/plate/' + id;
      await axios.get(requestUrl)
          .then(response => {
             if (response.status === 200)
                 result = response.data;
          });
      return result;
      // return demoPlates.find(plate => plate.id == id)
    },
    async getPlatesByExperimentId(id) {
        console.log('Makeing a backend call...')
        let result = null;
        const requestUrl = 'http://localhost:6010/phaedra/plate-service/plate';
        await axios.get(requestUrl, { params: {experimentId: id}})
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            });
        return result;
    },
    async getPlateMeasurementsByPlateId(plateId) {
        console.log('Making a backend call ...');
        let result = null;
        const requestUrl = 'http://localhost:6010/phaedra/plate-service/plate/' + plateId + '/measurements';
        await axios.get(requestUrl)
            .then(response => {
                if (response.status == 200)
                    result = response.data;
            });
        return result;
    }
}
