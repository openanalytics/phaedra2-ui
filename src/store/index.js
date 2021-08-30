import { createStore, createLogger } from 'vuex'
import projects from './modules/projects'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    projects
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})