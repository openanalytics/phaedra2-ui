// Routing
// --------------------------------------------------------------------

import { createWebHistory, createRouter } from "vue-router"

import Dashboard from '@/components/dashboard/Dashboard.vue'
import ProjectView from '@/components/views/ProjectView.vue'
import ExperimentView from '@/components/views/ExperimentView.vue'
import PlateView from '@/components/views/PlateView.vue'
import ProtocolView from '@/components/views/ProtocolView.vue'

import WellGrid from "@/components/widgets/WellGrid.vue"
import WellList from "@/components/widgets/WellList.vue"
import MeasList from "@/components/widgets/MeasList.vue"

const routes = [
    { name: "dashboard", path: "/", component: Dashboard },
    { name: "project", path: "/project/:id", component: ProjectView },
    { name: "experiment", path: "/experiment/:id", component: ExperimentView },
    { name: "plate", path: "/plate/:id", component: PlateView,
        children: [
            { path: '', component: WellGrid },
            { path: 'measurements', component: MeasList },
            { path: 'heatmap', component: WellGrid },
            { path: 'wells', component: WellList }
        ]
    },
    { name: "protocol", path: "/protocol/:id", component: ProtocolView },
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
