import axios from "axios";

// const demoMeasurements = [
//     {
//         id: 1,
//         name: 'MeasA 16-07 16:05',
//         wellColumns: 400,
//         subWellColumns: 300,
//         imageChannels: 4,
//         rows: 16,
//         columns: 24,
//         createdOn: new Date(),
//         createdBy: 'TestUser'
//     },
//     {
//         id: 2,
//         name: 'MeasB 17-07 12:05',
//         wellColumns: 500,
//         subWellColumns: 350,
//         imageChannels: 5,
//         rows: 16,
//         columns: 24,
//         createdOn: new Date(),
//         createdBy: 'TestUser'
//     },
//     {
//         id: 3,
//         name: 'MeasC 18-07 08:50',
//         wellColumns: 450,
//         subWellColumns: 350,
//         imageChannels: 4,
//         rows: 16,
//         columns: 24,
//         createdOn: new Date(),
//         createdBy: 'TestUser'
//     },
//     {
//         id: 4,
//         name: 'MeasD 25-07 10:35',
//         wellColumns: 300,
//         subWellColumns: 200,
//         imageChannels: 3,
//         rows: 16,
//         columns: 24,
//         createdOn: new Date(),
//         createdBy: 'TestUser'
//     },
//     {
//         id: 5,
//         name: 'MeasE 27-07 15:40',
//         wellColumns: 1000,
//         subWellColumns: 0,
//         imageChannels: 4,
//         rows: 16,
//         columns: 24,
//         createdOn: new Date(),
//         createdBy: 'TestUser'
//     },
// ]

export default {
    async getAllMeasurements() {
        console.log('Mocking a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6060/phaedra/meas-service/meas/';
        await axios.get(requestUrl)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            });
        return result;
    },
    async getMeasurementById(id) {
        console.log('Mocking a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6060/phaedra/meas-service/meas/' + id
        await axios.get(requestUrl)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            });
        return result;
    },
    async getMeasurementsByIds(ids) {
        console.log('Mocking a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6060/phaedra/meas-service/meas/' + ids
        await axios.get(requestUrl)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            });
        return result;
    }
}
