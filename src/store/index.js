import { createStore, createLogger } from 'vuex'

import measurements from './modules/measurements'
import resultdata from './modules/resultdata'
import calculations from './modules/calculations'
import datacapture from './modules/datacapture'
import metadata from './modules/metadata'
import ui from './modules/ui'
import curvedata from "./modules/curvedata";
import charting from "./modules/charting";

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    measurements,
    resultdata,
    calculations,
    datacapture,
    metadata,
    ui,
    curvedata,
    charting
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
