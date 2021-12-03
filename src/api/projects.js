import axios from "axios";

const demoProjects = [
    {
        id: 1,
        name: 'Project A',
        team: 'Team X',
        tags: ['Experimental'],
        properties: [{key: "Prop1", value: "Value 1"}, {key: "Prop2", value: "Value 2"}],
        createdBy: 'Frederick',
        createOn: new Date(2021, 7, 15)
    },
    {
        id: 2, name: 'Project B', team: 'Team X', createdBy: 'Frederick',
        createOn: new Date(2021, 7, 5)
    },
    {
        id: 3, name: 'Project C', team: 'Team Y', createdBy: 'Frederick',
        createOn: new Date(2021, 8, 2)
    },
    {
        id: 4, name: 'Project D', team: 'Team Z', tags: ['Test', 'door', 'Saša'], createdBy: 'Saša',
        createOn: new Date(2021, 7, 21)
    },
    {
        id: 5, name: 'Project E', team: 'Team Z', tags: ['Test', 'door', 'Saša'], createdBy: 'Saša',
        createOn: new Date(2021, 8, 22)
    }
]

export default {
    getNRecentProjects(n) {
        console.log('Get most recent project ... ')

        // demoProjects.sort((p1, p2) => {
        //     return p1.createOn.getTime() - p2.createOn.getTime();
        // })
        return demoProjects.slice(0, n)
    },
    async getProjectById(id) {
        console.log('Making a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6010/phaedra/plate-service/project/' + id
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
    async getAllProjects() {
        console.log('Making a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6010/phaedra/plate-service/projects'
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
    async loadRecentProjects() {
        console.log('Making a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6010/phaedra/plate-service/projects'
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
    async deleteProject(id) {
        console.log('Making a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6010/phaedra/plate-service/project/' + id
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
    async editProject(args) {
        console.log('Making a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6010/phaedra/plate-service/project/'
        await axios.put(requestUrl,args)
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
    async createNewProject(newProject) {
        console.log('Making a backend call...');
        let result = null;
        const requestUrl = 'http://localhost:6010/phaedra/plate-service/project/'
        await axios.post(requestUrl,newProject)
            .then(response => {
                if (response.status === 200 || response.status === 201)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return result;
    },
}
