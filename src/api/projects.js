import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/plate-service';

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
        let result = null;
        await axios.get(apiURL + '/project/' + id)
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
        let result = null;
        await axios.get(apiURL + '/projects')
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
        let result = null;
        await axios.get(apiURL + '/projects')
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
        let result = null;
        await axios.delete(apiURL + '/project/' + id)
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
        let result = null;
        await axios.put(apiURL + '/project', args)
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
        let result = null;
        await axios.post(apiURL + '/project', newProject)
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
