import { createStore, createLogger } from 'vuex'

import projects from './modules/projects'
import experiments from './modules/experiments'
import plates from './modules/plates'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    projects,
    experiments,
    plates
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})