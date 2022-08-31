// DEV API Token
// --------------------------------------------------------------------

import axios from "axios";
const token = process.env.VUE_APP_API_BEARER_TOKEN;
if (token) {
    console.log("DEV: Bearer token found, using it for all API calls");
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

// Routing
// --------------------------------------------------------------------

import { createWebHistory, createRouter } from "vue-router"

import { publicPath } from '../vue.config'

import Dashboard from '@/pages/Dashboard.vue'

import BrowseProjects from "./pages/project/BrowseProjects";
import ProjectView from '@/pages/project/ProjectView.vue'
import NewProjectView from '@/pages/project/NewProjectView.vue'

import BrowseProtocols from '@/pages/protocol/BrowseProtocols.vue'
import ProtocolView from '@/pages/protocol/ProtocolView.vue'
import NewProtocolView from "@/pages/protocol/NewProtocolView";
import ImportProtocolView from "./pages/protocol/ImportProtocolView";
import FeatureView from "@/pages/feature/FeatureView";
import FormulaTab  from "@/pages/feature/FormulaTab.vue";

import FormulasView from "@/pages/calculation/formula/FormulasView";
import FormulaView from "@/pages/calculation/formula/FormulaView";

import CaptureJobsView from '@/pages/datacapture/CaptureJobsView.vue'
import MeasurementsView from "./pages/datacapture/MeasurementsView";
import MeasurementDetailsView from "./pages/datacapture/MeasurementDetailsView";

import ExperimentView from '@/pages/experiment/ExperimentView.vue'
import PlateList from "@/pages/experiment/PlateList.vue"
import PlateStatsList from "@/pages/experiment/PlateStatsList.vue"
import PlateGrid from "@/pages/experiment/PlateGrid.vue"

import PlateView from '@/pages/plate/PlateView.vue'
import PlateLayout from "@/pages/plate/PlateLayout.vue"
import PlateHeatmap from "@/pages/plate/PlateHeatmap.vue"
import WellList from "@/pages/plate/WellList.vue"
import MeasList from "@/pages/plate/MeasList.vue"

import PlateTemplateView from "./pages/platelayout/PlateTemplateView";
import NewPlateTemplateView from "./pages/platelayout/NewPlateTemplateView";
import BrowseTemplates from "./pages/platelayout/BrowseTemplates";

const routes = [
    { name: "dashboard", path: "/", component: Dashboard },
    { name: 'browseProjects', path: "/projects", component: BrowseProjects},
    { name: "project", path: "/project/:id", component: ProjectView },
    { name: "newProject", path: "/project/new", component: NewProjectView },
    { name: "experiment", path: "/experiment/:id", component: ExperimentView,
        children: [
            { path: '', component: PlateList, name: "plateList" },
            { path: 'statistics', component: PlateStatsList },
            { path: 'heatmaps', component: PlateGrid }
        ]
    },
    { name: "plate", path: "/plate/:id", component: PlateView,
        children: [
            { path: '', component: PlateLayout, name: "plateLayout" },
            { path: 'measurements', component: MeasList },
            { path: 'heatmap', component: PlateHeatmap },
            { path: 'wells', component: WellList }
        ]
    },
    { name: "browseProtocols", path: "/protocols", component: BrowseProtocols },
    { name: "protocol", path: "/protocol/:id", component: ProtocolView },
    { name: "newProtocol", path: "/protocol/new", component: NewProtocolView },
    { name: "importProtocol", path: "/protocol/import", component: ImportProtocolView},
    { name: "feature", path: "/feature/:id", component: FeatureView,
        children: [
            { path: '', component: FormulaTab, name: "featureFormula" },
        ]
    },

    { name: "browseTemplates", path: "/templates", component: BrowseTemplates},
    { name: "template", path: "/template/:id", component: PlateTemplateView},
    { name: "newPlateTemplate", path: "/template/new", component: NewPlateTemplateView},

    { name: "calcFormulas", path: "/calc/formulas", component: FormulasView },
    { name: "calcFormula", path: "/calc/formula/:id", component: FormulaView },

    { name: "dataCaptureJobs", path: "/datacapture/jobs", component: CaptureJobsView },
    { name: "measurements", path: "/datacapture/meas", component: MeasurementsView},
    { name: "measurementDetails", path: "/datacapture/meas/:id", component: MeasurementDetailsView},
]
const router = createRouter({
    history: createWebHistory(publicPath),
    routes
});

// Vuex State management
// --------------------------------------------------------------------

import store from '@/store/index.js'

// Quasar UI with Material Icons and SplitPanes
// --------------------------------------------------------------------

import "quasar/dist/quasar.css"
import Quasar from "quasar/dist/quasar.umd.js"
import 'material-icons/iconfont/material-icons.css';
import 'splitpanes/dist/splitpanes.css'

// Create Vue App
// --------------------------------------------------------------------
import { createApp } from "vue"
import { createPinia, setActivePinia } from "pinia"
import App from "./App.vue"

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
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
