import { createStore, createLogger } from 'vuex'

import projects from './modules/projects'
import experiments from './modules/experiments'
import plates from './modules/plates'
import protocols from './modules/protocols'
import measurements from './modules/measurements'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    projects,
    experiments,
    plates,
    protocols,
    measurements
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})