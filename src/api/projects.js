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
    async getProjectById(id) {
        console.log('Mocking a backend call...')
        await wait(100)
        return demoProjects.find(project => project.id === id)
    },
    async getAllProjects() {
        console.log('Mocking a backend call...')
        await wait(100)
        return demoProjects
    },
    getNRecentProjects(n) {
        console.log('Get most recent project ... ')

        // demoProjects.sort((p1, p2) => {
        //     return p1.createOn.getTime() - p2.createOn.getTime();
        // })
        return demoProjects.slice(0, n)
    }
}

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
