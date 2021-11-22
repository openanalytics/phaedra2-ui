import axios from "axios";

export default {
    async getPlateById(id) {
        console.log('Making a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6010/phaedra/plate-service/plate/' + id;
        await axios.get(requestUrl)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async getPlatesByExperimentId(id) {
        console.log('Making a backend call...')
        let result = [];
        const requestUrl = 'http://localhost:6010/phaedra/plate-service/plate';
        await axios.get(requestUrl, { params: {experimentId: id}})
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async getPlateMeasurementsByPlateId(plateId) {
        console.log('Making a backend call ...');
        let result = null;
        const requestUrl = 'http://localhost:6010/phaedra/plate-service/plate/' + plateId + '/measurements';
        await axios.get(requestUrl)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            });
        return result;
    },
    async deletePlateById(plateId) {
        console.log('Making a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6010/phaedra/plate-service/plate/' + plateId;
        await axios.delete(requestUrl)
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
