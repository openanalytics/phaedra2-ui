import { createStore, createLogger } from 'vuex'

import projects from './modules/projects'
import experiments from './modules/experiments'
import plates from './modules/plates'
import protocols from './modules/protocols'
import features from './modules/features'
import measurements from './modules/measurements'
import resultdata from './modules/resultdata'
import calculations from './modules/calculations'
import datacapture from './modules/datacapture'
import templates from './modules/templates'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    projects,
    experiments,
    plates,
    protocols,
    features,
    measurements,
    resultdata,
    calculations,
    datacapture,
    templates
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
