// Routing
// --------------------------------------------------------------------
import { createWebHistory, createRouter } from "vue-router"

import Dashboard from '@/components/views/Dashboard.vue'
import PlateView from '@/components/views/PlateView.vue'

const routes = [
    { path: '/', component: Dashboard },
    { path: '/plate', component: PlateView },
]
const router = createRouter({
    history: createWebHistory(),
    routes
});

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
    .use(Quasar)
    .mount("#app")