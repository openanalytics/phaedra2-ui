import { createStore, createLogger } from 'vuex'

import projects from './modules/projects'
import experiments from './modules/experiments'
import plates from './modules/plates'
import wells from './modules/wells'
import protocols from './modules/protocols'
import pipelines from './modules/pipelines'
import features from './modules/features'
import measurements from './modules/measurements'
import resultdata from './modules/resultdata'
import calculations from './modules/calculations'
import datacapture from './modules/datacapture'
import templates from './modules/templates'
import metadata from './modules/metadata'
import userinfo from './modules/userinfo'
import ui from './modules/ui'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    projects,
    experiments,
    plates,
    wells,
    protocols,
    pipelines,
    features,
    measurements,
    resultdata,
    calculations,
    datacapture,
    templates,
    metadata,
    userinfo,
    ui
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
