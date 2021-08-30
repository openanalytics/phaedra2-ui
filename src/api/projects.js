const demoProjects = [
    { id: 1, name: 'Project A', team: 'Team X' },
    { id: 2, name: 'Project B', team: 'Team X' },
    { id: 3, name: 'Project C', team: 'Team Y' }
]

export default {
    async getProjectById(id) {
      console.log('Mocking a backend call...')
      await wait(100)
      return demoProjects.find(project => project.id == id)
    }
}

function wait (ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
}