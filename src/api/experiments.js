const demoExperiments = [
    { id: 1, name: 'Experiment 1', projectId: 1, description: 'This is experiment 1', createdOn: new Date(), tags: ['Experimental', 'Disapproved'] },
    { id: 2, name: 'Experiment 2', projectId: 1, description: 'This is experiment 2', createdOn: new Date() },
    { id: 3, name: 'Experiment 3', projectId: 1, description: 'This is experiment 3', createdOn: new Date() },
    { id: 4, name: 'Experiment 4', projectId: 2, description: 'This is experiment 4', createdOn: new Date(), tags: ['Experimental'] },
    { id: 5, name: 'Experiment 5', projectId: 2, description: 'This is experiment 5', createdOn: new Date() }
]

export default {
    async getExperimentById(id) {
      console.log('Mocking a backend call...')
      await wait(100)
      return demoExperiments.find(exp => exp.id == id)
    },
    async getExperimentsByProjectId(id) {
      console.log('Mocking a backend call...')
      await wait(300)
      return demoExperiments.filter(exp => exp.projectId == id)
    }
}

function wait (ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
}