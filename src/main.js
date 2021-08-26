import { createApp } from "vue"
import App from "./App.vue"

//import "bootstrap/dist/css/bootstrap.min.css"

import "quasar/dist/quasar.css"
import Quasar from "quasar/dist/quasar.umd.js"

import 'material-icons/iconfont/material-icons.css';

createApp(App)
    .use(Quasar)
    .mount("#app")