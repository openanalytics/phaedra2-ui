// Routing
// --------------------------------------------------------------------

import { createWebHistory, createRouter } from "vue-router"

import Dashboard from '@/components/views/Dashboard.vue'
import PlateView from '@/components/views/PlateView.vue'
import ProjectView from '@/components/views/ProjectView.vue'

const routes = [
    { name: "dashboard", path: "/", component: Dashboard },
    { name: "plate", path: "/plate", component: PlateView },
    { name: "project", path: "/project/:id", component: ProjectView },
]
const router = createRouter({
    history: createWebHistory(),
    routes
});

// Vuex State management
// --------------------------------------------------------------------

import store from '@/store/index.js'

// Quasar UI with Material Icons
// --------------------------------------------------------------------

import "quasar/dist/quasar.css"
import Quasar from "quasar/dist/quasar.umd.js"
import 'material-icons/iconfont/material-icons.css';

// Create Vue App
// --------------------------------------------------------------------
import { createApp } from "vue"
import App from "./App.vue"
createApp(App)
    .use(router)
    .use(store)
    .use(Quasar)
    .mount("#app")