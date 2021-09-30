const demoExperiments = [
    {
        id: 1, name: 'Experiment 1', projectId: 1, description: 'This is experiment 1', createdOn: new Date(),
        tags: ['HTS', 'Pilot'],
        properties: [{key: "Prop1", value: "Value 1"}, {key: "Prop2", value: "Value 2"}],
        closed: false
    },
    {id: 2, name: 'Experiment 2', projectId: 1, description: 'This is experiment 2', createdOn: new Date(), closed: true},
    {id: 3, name: 'Experiment 3', projectId: 1, description: 'This is experiment 3', createdOn: new Date(), closed: false},
    {
        id: 4,
        name: 'Experiment 4',
        projectId: 2,
        description: 'This is experiment 4',
        createdOn: new Date(),
        tags: ['Experimental'],
        closed: false
    },
    {id: 5, name: 'Experiment 5', projectId: 2, description: 'This is experiment 5', createdOn: new Date(), closed: true}
]

export default {
    async getExperimentById(id) {
        console.log('Mocking a backend call...')
        await wait(100)
        return demoExperiments.find(exp => exp.id === id)
    },
    getExperimentsByProjectId(id) {
        console.log('Mocking a backend call...')
        return demoExperiments.filter(exp => exp.projectId === id)
    },
    getRecentExperiments() {
        console.log('Mocking a backend call...')
        return demoExperiments.sort((e1, e2) => {
            return e1.createdOn.getTime() - e2.createdOn.getTime();
        })
    }
}

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
