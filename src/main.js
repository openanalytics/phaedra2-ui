// Routing
// --------------------------------------------------------------------

import { createWebHistory, createRouter } from "vue-router"

import { publicPath } from '../vue.config'

import Dashboard from '@/pages/Dashboard.vue'
import ProjectView from '@/pages/project/ProjectView.vue'
import NewProjectView from '@/pages/project/NewProjectView.vue'
import ExperimentView from '@/pages/experiment/ExperimentView.vue'
import NewExperimentView from '@/pages/experiment/NewExperimentView.vue'
import PlateView from '@/pages/plate/PlateView.vue'
import ProtocolView from '@/pages/protocol/ProtocolView.vue'
import NewProtocolView from "@/pages/protocol/NewProtocolView";
import FormulasView from "@/pages/calculation/formula/FormulasView";
import FormulaView from "@/pages/calculation/formula/FormulaView";
import CaptureJobsView from '@/pages/datacapture/CaptureJobsView.vue'

import PlateList from "@/pages/experiment/PlateList.vue"
import PlateStatsList from "@/pages/experiment/PlateStatsList.vue"
import PlateGrid from "@/pages/experiment/PlateGrid.vue"

import WellGrid from "@/pages/plate/WellGrid.vue"
import WellList from "@/pages/plate/WellList.vue"
import MeasList from "@/pages/plate/MeasList.vue"

import PlateTemplateView from "./pages/platelayout/PlateTemplateView";
import NewPlateTemplateView from "./pages/platelayout/NewPlateTemplateView"

const routes = [
    { name: "dashboard", path: "/", component: Dashboard },
    { name: "project", path: "/project/:id", component: ProjectView },
    { name: "newProject", path: "/project/new", component: NewProjectView },
    { name: "experiment", path: "/experiment/:id", component: ExperimentView },
    { name: "newExperiment", path: "/experiment/new", component: NewExperimentView },
    { name: "experiment", path: "/experiment/:id", component: ExperimentView,
        children: [
            { path: '', component: PlateList },
            { path: 'statistics', component: PlateStatsList },
            { path: 'heatmaps', component: PlateGrid }
        ]
    },
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
    { name: "template", path: "/template/:id", component: PlateTemplateView},
    { name: "newPlateTemplate", path: "/template/new", component: NewPlateTemplateView},

    { name: "calcFormulas", path: "/calc/formulas", component: FormulasView },
    { name: "calcFormula", path: "/calc/formula/:id", component: FormulaView },

    { name: "dataCaptureJobs", path: "/datacapture/jobs", component: CaptureJobsView },
]
const router = createRouter({
    history: createWebHistory(publicPath),
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

app.mixin({
    methods: {
        /**
         * Modifies the minHeight property of the q-page to take the breadcrumbs into account.
         * See: https://quasar.dev/layout/page#style-fn
         */
        pageStyleFnForBreadcrumbs(offset) {
            return { minHeight: offset ? `calc(100vh - ${offset}px - 50px)` : '100vh' }
        }
    }
})

app.mount("#app")
