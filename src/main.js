// Create Vue App
// --------------------------------------------------------------------
import axios from "axios";
import "quasar/dist/quasar.css"
import Quasar from "quasar/dist/quasar.umd.js"
import 'material-icons/iconfont/material-icons.css';
import 'splitpanes/dist/splitpanes.css'

import { createWebHistory, createRouter } from "vue-router"
import { publicPath } from '../vue.config'

import store from '@/store/index.js'

import {createApp, provide, h} from "vue"
import {createPinia} from "pinia"

import App from "@/App.vue"
import Dashboard from '@/pages/dashboard/Dashboard.vue'

import BrowseProjects from '@/pages/project/BrowseProjects.vue'
import ProjectView from '@/pages/project/ProjectView.vue'
import NewProjectView from '@/pages/project/NewProjectView.vue'

import BrowseProtocols from '@/pages/protocol/BrowseProtocols.vue'
import ProtocolView from '@/pages/protocol/ProtocolView.vue'
import NewProtocolView from "@/pages/protocol/NewProtocolView.vue"
import ImportProtocolView from "@/pages/protocol/ImportProtocolView.vue"
import FeatureView from "@/pages/feature/FeatureView.vue"
import FormulaTab  from "@/pages/feature/FormulaTab.vue"

import BrowseFormulas from "@/pages/calculation/formula/BrowseFormulas.vue"
import FormulaView from "@/pages/calculation/formula/FormulaView.vue"

import CaptureJobsView from '@/pages/datacapture/CaptureJobsView.vue'
import CaptureScriptsView from '@/pages/datacapture/CaptureScriptsView.vue'
import CaptureScriptView from '@/pages/datacapture/CaptureScriptView.vue'
import CaptureConfigsView from '@/pages/datacapture/CaptureConfigsView.vue'
import CaptureConfigView from '@/pages/datacapture/CaptureConfigView.vue'
import MeasurementsView from "@/pages/datacapture/MeasurementsView.vue"
import MeasurementDetailsView from "@/pages/datacapture/MeasurementDetailsView.vue"
import BrowseImageRenderConfigs from "@/pages/datacapture/BrowseImageRenderConfigs.vue"
import ImageRenderConfigDetails from "@/pages/datacapture/ImageRenderConfigDetails.vue"

import ExperimentView from '@/pages/experiment/ExperimentView.vue'
import PlateList from "@/pages/experiment/PlateList.vue"
import PlateStatsList from "@/pages/experiment/PlateStatsList.vue"
import PlateGrid from "@/pages/experiment/PlateGrid.vue"

import PlateView from '@/pages/plate/PlateView.vue'
import PlateLayout from "@/pages/plate/PlateLayout.vue"
import PlateHeatmap from "@/pages/plate/PlateHeatmap.vue"
import WellList from "@/pages/plate/WellList.vue"
import MeasList from "@/pages/plate/MeasList.vue"

import PlateTemplateView from "@/pages/platelayout/PlateTemplateView.vue"
import NewPlateTemplateView from "@/pages/platelayout/NewPlateTemplateView.vue"
import ImportPlateTemplateFromFile from "@/pages/platelayout/ImportPlateTemplateFromFile.vue"
import BrowseTemplates from "@/pages/platelayout/BrowseTemplates.vue"

import BrowsePipelines from "@/pages/pipeline/BrowsePipelines.vue"
import PipelineDetails from "@/pages/pipeline/PipelineDetails.vue"
import NewPipeline from "@/pages/pipeline/NewPipeline.vue"
import BrowsePipelineExecutions from "@/pages/pipeline/BrowsePipelineExecutions.vue"
import PipelineExecutionDetails from "@/pages/pipeline/PipelineExecutionDetails.vue"

// Create Vue app
// --------------------------------------------------------------------
const app = createApp(App)

// Pinia State Management
const pinia = createPinia()
app.use(pinia)

// Vuex State management (to be replaced fully by Pinia)
// --------------------------------------------------------------------
app.use(store)

const token = process.env.VUE_APP_API_BEARER_TOKEN;
if (token) {
    console.log("DEV: Bearer token found, using it for all API calls");
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

// Quasar UI with Material Icons and SplitPanes
// --------------------------------------------------------------------
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

// Routing
// --------------------------------------------------------------------
const routes = createRouter({
    history: createWebHistory(publicPath),
    routes: [
        {name: "dashboard", path: "/", component: Dashboard},

        {name: 'browseProjects', path: "/projects", component: BrowseProjects},
        {name: "project", path: "/project/:id", component: ProjectView},
        {name: "newProject", path: "/project/new", component: NewProjectView},
        {
            name: "experiment", path: "/experiment/:experimentId", component: ExperimentView,
            children: [
                {path: '', component: PlateList, name: "plateList"},
                {path: 'statistics', component: PlateStatsList},
                {path: 'heatmaps', component: PlateGrid}
            ]
        },
        {
            name: "plate", path: "/plate/:plateId", component: PlateView,
            children: [
                {path: '', component: PlateLayout, name: "plateLayout"},
                {path: 'measurements', component: MeasList},
                {path: 'heatmap', component: PlateHeatmap},
                {path: 'wells', component: WellList}
            ]
        },

        {name: "browseProtocols", path: "/protocols", component: BrowseProtocols},
        {name: "protocol", path: "/protocol/:id", component: ProtocolView},
        {name: "newProtocol", path: "/protocol/new", component: NewProtocolView},
        {name: "importProtocol", path: "/protocol/import", component: ImportProtocolView},
        {
            name: "feature", path: "/feature/:id", component: FeatureView,
            children: [
                {path: '', component: FormulaTab, name: "featureFormula"},
            ]
        },

        {name: "browseTemplates", path: "/templates", component: BrowseTemplates},
        {name: "template", path: "/template/:id", component: PlateTemplateView},
        {name: "newPlateTemplate", path: "/template/new", component: NewPlateTemplateView, props: true},
        {name: "newPlateTemplateFromFile", path: "/template/new", component: ImportPlateTemplateFromFile},

        {name: "calcFormulas", path: "/calc/formulas", component: BrowseFormulas},
        {name: "calcFormula", path: "/calc/formula/:id", component: FormulaView},

        {name: "dataCaptureJobs", path: "/datacapture/jobs", component: CaptureJobsView},
        {name: "dataCaptureScripts", path: "/datacapture/scripts", component: CaptureScriptsView},
        {name: "dataCaptureScript", path: "/datacapture/script/:id", component: CaptureScriptView},
        {name: "dataCaptureConfigs", path: "/datacapture/configs", component: CaptureConfigsView},
        {name: "dataCaptureConfig", path: "/datacapture/config/:id", component: CaptureConfigView},
        {name: "measurements", path: "/datacapture/meas", component: MeasurementsView},
        {name: "measurementDetails", path: "/datacapture/meas/:id", component: MeasurementDetailsView},
        {name: "imageRenderConfigs", path: "/datacapture/render-configs", component: BrowseImageRenderConfigs},
        {
            name: "imageRenderConfigDetails",
            path: "/datacapture/render-config/:id",
            component: ImageRenderConfigDetails
        },

        {name: "browsePipelines", path: "/pipelines", component: BrowsePipelines},
        {name: "pipelineDetails", path: "/pipeline/:id", component: PipelineDetails},
        {name: "newPipeline", path: "/pipeline/new", component: NewPipeline},
        {name: "browsePipelineExecutions", path: "/pipeline-executions", component: BrowsePipelineExecutions},
        {
            name: "pipelineExecutionDetails",
            path: "/pipeline-execution/:id",
            component: PipelineExecutionDetails
        }
    ]
})
app.use(routes)

// Use Plotly.js for charts
// --------------------------------------------------------------------
// app.use(Plotly)

app.mixin({
    methods: {
        /**
         * Modifies the minHeight property of the q-page to take the breadcrumbs into account.
         * See: https://quasar.dev/layout/page#style-fn
         */
        pageStyleFnForBreadcrumbs(offset) {
            return {minHeight: offset ? `calc(100vh - ${offset}px - 50px)` : '100vh'}
        }
    },
    computed: {
        console: () => console
    }
})

app.mount("#app")
// }
// })
