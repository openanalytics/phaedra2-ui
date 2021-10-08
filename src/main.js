// Routing
// --------------------------------------------------------------------

import { createWebHistory, createRouter } from "vue-router"

import Dashboard from '@/pages/Dashboard.vue'
import ProjectView from '@/pages/project/ProjectView.vue'
import NewProjectView from '@/pages/project/NewProjectView.vue'
import ExperimentView from '@/pages/experiment/ExperimentView.vue'
import NewExperimentView from '@/pages/experiment/NewExperimentView.vue'
import PlateView from '@/pages/PlateView.vue'
import ProtocolView from '@/pages/protocol/ProtocolView.vue'

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
    { name: "newProtocol", path: "/protocol/new", component: NewProtocolView },
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
import NewProtocolView from "@/pages/protocol/NewProtocolView";

const app = createApp(App)
app.use(router)
app.use(store)
app.use(Quasar, {
    config: {
        brand: {
            primary: '#32a6d3',
            secondary: '#e6e6e6',
            accent: '#e52323',

            dark: '#222222',

            positive: '#21ba45',
            negative: '#C10015',
            info: '#31CCEC',
            warning: '#F2C037',
        }
    }
})
app.mount("#app")
