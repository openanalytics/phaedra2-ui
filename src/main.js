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

import Dashboard from '@/pages/dashboard/Dashboard.vue'

import BrowseProjects from "./pages/project/BrowseProjects";
import ProjectView from '@/pages/project/ProjectView.vue'
import NewProjectView from '@/pages/project/NewProjectView.vue'

import BrowseProtocols from '@/pages/protocol/BrowseProtocols.vue'
import ProtocolView from '@/pages/protocol/ProtocolView.vue'
import NewProtocolView from "@/pages/protocol/NewProtocolView";
import ImportProtocolView from "./pages/protocol/ImportProtocolView";
import FeatureView from "@/pages/feature/FeatureView";
import FormulaTab  from "@/pages/feature/FormulaTab.vue";

import BrowseFormulas from "@/pages/calculation/formula/BrowseFormulas";
import FormulaView from "@/pages/calculation/formula/FormulaView";

import CaptureJobsView from '@/pages/datacapture/CaptureJobsView'
import CaptureScriptsView from '@/pages/datacapture/CaptureScriptsView'
import CaptureScriptView from '@/pages/datacapture/CaptureScriptView'
import CaptureConfigsView from '@/pages/datacapture/CaptureConfigsView'
import CaptureConfigView from '@/pages/datacapture/CaptureConfigView'
import MeasurementsView from "@/pages/datacapture/MeasurementsView"
import MeasurementDetailsView from "@/pages/datacapture/MeasurementDetailsView"
import BrowseImageRenderConfigs from "@/pages/datacapture/BrowseImageRenderConfigs"
import ImageRenderConfigDetails from "@/pages/datacapture/ImageRenderConfigDetails"

import ExperimentView from '@/pages/experiment/ExperimentView.vue'
import PlateList from "@/pages/experiment/PlateList.vue"
import PlateStatsList from "@/pages/experiment/PlateStatsList.vue"
import PlateGrid from "@/pages/experiment/PlateGrid.vue"

import PlateView from '@/pages/plate/PlateView.vue'
import PlateLayout from "@/pages/plate/PlateLayout.vue"
import PlateHeatmap from "@/pages/plate/PlateHeatmap.vue"
import WellList from "@/pages/plate/WellList.vue"
import MeasList from "@/pages/plate/MeasList.vue"

import PlateTemplateView from "@/pages/platelayout/PlateTemplateView";
import NewPlateTemplateView from "@/pages/platelayout/NewPlateTemplateView";
import ImportPlateTemplateFromFile from "@/pages/platelayout/ImportPlateTemplateFromFile"
import BrowseTemplates from "@/pages/platelayout/BrowseTemplates";

import BrowsePipelines from "@/pages/pipeline/BrowsePipelines";
import PipelineDetails from "@/pages/pipeline/PipelineDetails";
import NewPipeline from "@/pages/pipeline/NewPipeline";
import BrowsePipelineExecutions from "@/pages/pipeline/BrowsePipelineExecutions";
import PipelineExecutionDetails from "@/pages/pipeline/PipelineExecutionDetails";

const routes = [
    { name: "dashboard", path: "/", component: Dashboard },

    { name: 'browseProjects', path: "/projects", component: BrowseProjects},
    { name: "project", path: "/project/:id", component: ProjectView },
    { name: "newProject", path: "/project/new", component: NewProjectView },
    { name: "experiment", path: "/experiment/:experimentId", component: ExperimentView,
        children: [
            { path: '', component: PlateList, name: "plateList" },
            { path: 'statistics', component: PlateStatsList },
            { path: 'heatmaps', component: PlateGrid }
        ]
    },
    { name: "plate", path: "/plate/:plateId", component: PlateView,
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

    { name: "browseTemplates", path: "/templates", component: BrowseTemplates },
    { name: "template", path: "/template/:id", component: PlateTemplateView },
    { name: "newPlateTemplate", path: "/template/new", component: NewPlateTemplateView, props: true },
    { name: "newPlateTemplateFromFile", path: "/template/new", component: ImportPlateTemplateFromFile },

    { name: "calcFormulas", path: "/calc/formulas", component: BrowseFormulas },
    { name: "calcFormula", path: "/calc/formula/:id", component: FormulaView },

    { name: "dataCaptureJobs", path: "/datacapture/jobs", component: CaptureJobsView },
    { name: "dataCaptureScripts", path: "/datacapture/scripts", component: CaptureScriptsView },
    { name: "dataCaptureScript", path: "/datacapture/script/:id", component: CaptureScriptView },
    { name: "dataCaptureConfigs", path: "/datacapture/configs", component: CaptureConfigsView },
    { name: "dataCaptureConfig", path: "/datacapture/config/:id", component: CaptureConfigView },
    { name: "measurements", path: "/datacapture/meas", component: MeasurementsView},
    { name: "measurementDetails", path: "/datacapture/meas/:id", component: MeasurementDetailsView},
    { name: "imageRenderConfigs", path: "/datacapture/render-configs", component: BrowseImageRenderConfigs},
    { name: "imageRenderConfigDetails", path: "/datacapture/render-config/:id", component: ImageRenderConfigDetails},

    { name: "browsePipelines", path: "/pipelines", component: BrowsePipelines},
    { name: "pipelineDetails", path: "/pipeline/:id", component: PipelineDetails },
    { name: "newPipeline", path: "/pipeline/new", component: NewPipeline },
    { name: "browsePipelineExecutions", path: "/pipeline-executions", component: BrowsePipelineExecutions},
    { name: "pipelineExecutionDetails", path: "/pipeline-execution/:id", component: PipelineExecutionDetails },
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
import {createApp, provide, h} from "vue"
import Plotly from "plotly.js-dist-min"

import { createPinia, setActivePinia } from "pinia"
import App from "./App.vue"

import { apolloResultDataClient, apolloPlatesClient, apolloChartsClient } from '@/graphql/apollo.clients';
import {ApolloClients} from "@vue/apollo-composable";

const pinia = createPinia()

const app = createApp({
    setup() {
        provide(ApolloClients, {
            resultDataClient: apolloResultDataClient,
            platesClient: apolloPlatesClient,
            chartsClient: apolloChartsClient
        })
    },
    render: () => h(App)
})

app.use(pinia)
app.use(router)
app.use(store)
app.use(Plotly)
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
    },
    computed: {
        console: () => console
    }
})

app.mount("#app")
