import { createStore, createLogger } from 'vuex'

import projects from './modules/projects'
import experiments from './modules/experiments'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    projects,
    experiments
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})