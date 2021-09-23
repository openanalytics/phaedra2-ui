import { createStore, createLogger } from 'vuex'

import projects from './modules/projects'
import experiments from './modules/experiments'
import plates from './modules/plates'
import protocols from './modules/protocols'
import features from './modules/features'
import measurements from './modules/measurements'
import resultdata from './modules/resultdata'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    projects,
    experiments,
    plates,
    protocols,
    features,
    measurements,
    resultdata
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})