const demoProjects = [
    { id: 1, name: 'Project A', team: 'Team X', tags: ['Experimental'], properties: [ { key: "Prop1", value: "Value 1" }, { key: "Prop2", value: "Value 2" } ] },
    { id: 2, name: 'Project B', team: 'Team X' },
    { id: 3, name: 'Project C', team: 'Team Y' }
]

export default {
    async getProjectById(id) {
      console.log('Mocking a backend call...')
      await wait(100)
      return demoProjects.find(project => project.id == id)
    },
    async getAllProjects() {
      console.log('Mocking a backend call...')
      await wait(100)
      return demoProjects
    }
}

function wait (ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
}