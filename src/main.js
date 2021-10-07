// Routing
// --------------------------------------------------------------------

import { createWebHistory, createRouter } from "vue-router"

import Dashboard from '@/components/dashboard/Dashboard.vue'
import ProjectView from '@/components/views/ProjectView.vue'
import NewProjectView from '@/components/views/NewProjectView.vue'
import ExperimentView from '@/components/views/ExperimentView.vue'
import NewExperimentView from '@/components/views/NewExperimentView.vue'
import PlateView from '@/components/views/PlateView.vue'
import ProtocolView from '@/components/views/ProtocolView.vue'

import WellGrid from "@/components/widgets/WellGrid.vue"
import WellList from "@/components/widgets/WellList.vue"
import MeasList from "@/components/widgets/MeasList.vue"

const routes = [
    { name: "dashboard", path: "/", component: Dashboard },
    { name: "project", path: "/project/:id", component: ProjectView },
    { name: "newProject", path: "/project/new", component: NewProjectView },
    { name: "experiment", path: "/experiment/:id", component: ExperimentView },
    { name: "newExperiment", path: "/experiment/new", component: NewExperimentView },
    { name: "plate", path: "/plate/:id", component: PlateView,
        children: [
            { path: '', component: WellGrid, props: { gridType: WellGrid.GRID_TYPE_LAYOUT } },
            { path: 'measurements', component: MeasList },
            { path: 'heatmap', component: WellGrid, props: { gridType: WellGrid.GRID_TYPE_HEATMAP } },
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
