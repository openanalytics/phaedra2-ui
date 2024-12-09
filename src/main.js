// Create Vue App
// --------------------------------------------------------------------
import axios from "axios";
import "material-icons/iconfont/material-icons.css";
import "splitpanes/dist/splitpanes.css";

import { createWebHistory, createRouter } from "vue-router";
import { publicPath } from "../vue.config";

import store from "@/store/index.js";

import { createApp } from "vue";
import { Splitpanes, Pane } from "splitpanes";
import { Loading, Notify, Quasar } from "quasar";
import "quasar/dist/quasar.css";

import { createPinia } from "pinia";

import App from "@/App.vue";

// Create Vue app
// --------------------------------------------------------------------
const app = createApp(App);

// Pinia State Management
const pinia = createPinia();
app.use(pinia);

// Vuex State management (to be replaced fully by Pinia)
// --------------------------------------------------------------------
app.use(store);

const token = process.env.VUE_APP_API_BEARER_TOKEN;
if (token) {
  console.log("DEV: Bearer token found, using it for all API calls");
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}

app.component("Splitpanes", Splitpanes);
app.component("Pane", Pane);

// Quasar UI with Material Icons and SplitPanes
// --------------------------------------------------------------------
app.use(Quasar, {
  plugins: {
    Notify,
    Loading,
  },
  config: {
    brand: {
      primary: "#32a6d3",
      secondary: "#e6e6e6",
      accent: "#e52323",

      dark: "#222222",

      positive: "#21ba45",
      negative: "#C10015",
      info: "#31CCEC",
      warning: "#F2C037",
    },
  },
});

// Routing
// --------------------------------------------------------------------
import Dashboard from "@/pages/dashboard/Dashboard.vue";

import ManageFeatureStats from "@/pages/admin/ManageFeatureStats.vue";

import BrowseProjects from "@/pages/project/BrowseProjects.vue";
import ProjectView from "@/pages/project/ProjectView.vue";
import NewProjectView from "@/pages/project/NewProjectView.vue";

import BrowseProtocols from "@/pages/calculation/protocol/BrowseProtocols.vue";
import ProtocolView from "@/pages/calculation/protocol/ProtocolView.vue";
import NewProtocolView from "@/pages/calculation/protocol/NewProtocolView.vue";
import ImportProtocolView from "@/pages/calculation/protocol/ImportProtocolView.vue";

import BrowseFormulas from "@/pages/calculation/formula/BrowseFormulas.vue";
import FormulaView from "@/pages/calculation/formula/FormulaView.vue";

import BrowseCaptureJobs from "@/pages/datacapture/BrowseCaptureJobs.vue";
import BrowseCaptureScripts from "@/pages/datacapture/BrowseCaptureScripts.vue";
import CaptureScriptView from "@/pages/datacapture/CaptureScriptView.vue";
import BrowseCaptureConfigs from "@/pages/datacapture/BrowseCaptureConfigs.vue";
import CaptureConfigView from "@/pages/datacapture/CaptureConfigView.vue";
import BrowseMeasurements from "@/pages/datacapture/BrowseMeasurements.vue";
import MeasurementDetailsView from "@/pages/datacapture/MeasurementDetailsView.vue";
import BrowseImageRenderConfigs from "@/pages/datacapture/BrowseImageRenderConfigs.vue";
import ImageRenderConfigDetails from "@/pages/datacapture/ImageRenderConfigDetails.vue";

import ExperimentView from "@/pages/experiment/ExperimentView.vue";
import PlateList from "@/components/plate/PlateList.vue";
import PlateStatsList from "@/pages/experiment/PlateStatsList.vue";
import PlateGrid from "@/pages/experiment/PlateGrid.vue";

import PlateView from "@/pages/plate/PlateView.vue";
import PlateLayout from "@/pages/plate/PlateLayout.vue";
import PlateHeatmap from "@/pages/plate/PlateHeatmap.vue";
import WellList from "@/pages/plate/WellList.vue";
import MeasList from "@/pages/plate/MeasList.vue";

import PlateTemplateView from "@/pages/platelayout/PlateTemplateView.vue";
import NewPlateTemplateView from "@/pages/platelayout/NewPlateTemplateView.vue";
import ImportPlateTemplateFromFile from "@/pages/platelayout/ImportPlateTemplateFromFile.vue";
import BrowseTemplates from "@/pages/platelayout/BrowseTemplates.vue";

import BrowsePipelines from "@/pages/pipeline/BrowsePipelines.vue";
import PipelineDetails from "@/pages/pipeline/PipelineDetails.vue";
import NewPipeline from "@/pages/pipeline/NewPipeline.vue";
import BrowsePipelineExecutions from "@/pages/pipeline/BrowsePipelineExecutions.vue";
import PipelineExecutionDetails from "@/pages/pipeline/PipelineExecutionDetails.vue";
import PipelineAdmin from "@/pages/pipeline/PipelineAdmin.vue";
import WellView from "@/pages/well/WellView.vue";
import Workbench from "@/pages/workbench/Workbench.vue";
import { prepareWorkbench } from "@/composable/router/prepareViews";
import BrowseQueries from "@/pages/query/BrowseQueries.vue";
import CreateQuery from "@/pages/query/CreateQuery.vue";
import NewFormulaView from "@/pages/calculation/formula/NewFormulaView.vue";
import NewCaptureConfigView from "@/pages/datacapture/NewCaptureConfigView.vue";

const routes = createRouter({
  history: createWebHistory(publicPath),
  routes: [
    { name: "dashboard", path: "/", redirect: "/workbench" },
    {
      name: "workbench",
      path: "/workbench",
      component: Workbench,
      beforeEnter: () => {
        prepareWorkbench();
      },
    },
    { name: "browseProjects", path: "/projects", component: BrowseProjects },
    { name: "project", path: "/project/:id", component: ProjectView },
    { name: "newProject", path: "/project/new", component: NewProjectView },
    {
      name: "experiment",
      path: "/experiment/:experimentId",
      component: ExperimentView,
      children: [
        { path: "", component: PlateList, name: "plateList" },
        { path: "statistics", component: PlateStatsList },
        { path: "heatmaps", component: PlateGrid },
      ],
    },
    {
      name: "plate",
      path: "/plate/:plateId",
      component: PlateView,
      children: [
        { path: "", component: PlateLayout, name: "plateLayout" },
        { path: "measurements", component: MeasList },
        { path: "heatmap", component: PlateHeatmap },
        { path: "wells", component: WellList },
      ],
    },
    {
      name: "well",
      path: "/well/:wellId",
      component: WellView,
    },
    { name: "browseProtocols", path: "/protocols", component: BrowseProtocols },
    { name: "protocol", path: "/protocol/:id", component: ProtocolView },
    { name: "newProtocol", path: "/protocol/new", component: NewProtocolView },
    {
      name: "importProtocol",
      path: "/protocol/import",
      component: ImportProtocolView,
    },

    { name: "browseTemplates", path: "/templates", component: BrowseTemplates },
    { name: "template", path: "/template/:id", component: PlateTemplateView },
    { name: "newPlateTemplate", path: "/template/new", component: NewPlateTemplateView, props: true},

    { name: "calcFormulas", path: "/calc/formulas", component: BrowseFormulas },
    { name: "calcFormula", path: "/calc/formula/:id", component: FormulaView },
    { name: "newCalcFormula", path: "/calc/formula/new", component: NewFormulaView, props: true },

    {
      name: "manageFeatureStats",
      path: "/admin/feature-stats",
      component: ManageFeatureStats,
    },

    {
      name: "dataCaptureJobs",
      path: "/datacapture/jobs",
      component: BrowseCaptureJobs,
    },
    {
      name: "dataCaptureScripts",
      path: "/datacapture/scripts",
      component: BrowseCaptureScripts,
    },
    {
      name: "dataCaptureScript",
      path: "/datacapture/script/:id",
      component: CaptureScriptView,
    },
    { name: "dataCaptureConfigs", path: "/datacapture/configs", component: BrowseCaptureConfigs },
    { name: "dataCaptureConfig", path: "/datacapture/config/:id", component: CaptureConfigView },
    { name: "newDataCaptureConfig", path: "/datacapture/config/new", component: NewCaptureConfigView },
    {
      name: "measurements",
      path: "/datacapture/meas",
      component: BrowseMeasurements,
    },
    {
      name: "measurementDetails",
      path: "/datacapture/meas/:id",
      component: MeasurementDetailsView,
    },
    {
      name: "imageRenderConfigs",
      path: "/datacapture/render-configs",
      component: BrowseImageRenderConfigs,
    },
    {
      name: "imageRenderConfigDetails",
      path: "/datacapture/render-config/:id",
      component: ImageRenderConfigDetails,
    },

    { name: "browsePipelines", path: "/pipelines", component: BrowsePipelines },
    {
      name: "pipelineDetails",
      path: "/pipeline/:id",
      component: PipelineDetails,
    },
    { name: "newPipeline", path: "/pipeline/new", component: NewPipeline },
    {
      name: "browsePipelineExecutions",
      path: "/pipeline-executions",
      component: BrowsePipelineExecutions,
    },
    {
      name: "pipelineExecutionDetails",
      path: "/pipeline-execution/:id",
      component: PipelineExecutionDetails,
    },
    { name: "browseQueries", path: "/queries", component: BrowseQueries },
    { name: "newQuery", path: "/queries/new", component: CreateQuery },
    {
      name: "pipelineAdmin",
      path: "/pipeline-admin",
      component: PipelineAdmin,
    },
  ],
});
app.use(routes);

app.mixin({
  methods: {
    /**
     * Modifies the minHeight property of the q-page to take the breadcrumbs into account.
     * See: https://quasar.dev/layout/page#style-fn
     */
    pageStyleFnForBreadcrumbs(offset) {
      return {
        minHeight: offset ? `calc(100vh - ${offset}px - 50px)` : "100vh",
      };
    },
  },
  computed: {
    console: () => console,
  },
});

app.mount("#app");
