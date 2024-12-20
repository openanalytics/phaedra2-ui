import CreateProjectForm from "@/components/project/forms/CreateProjectForm.vue";
import RecentCalculations from "@/components/dashboard/panes/RecentCalculations";
import RecentProjects from "@/components/dashboard/panes/RecentProjects";
import RecentExperiments from "@/components/dashboard/panes/RecentExperiments";
import ProjectDetails from "@/components/project/ProjectDetails.vue";
import ExperimentList from "@/components/experiment/ExperimentList.vue";
import PlateList from "@/components/plate/PlateList";
import ProjectsList from "@/components/project/ProjectsList.vue";
import WellList from "../../pages/plate/WellList.vue";
import PlateHeatmap from "@/pages/plate/PlateHeatmap.vue";
import { computed } from "vue";
import { useSelectionStore } from "@/stores/selection";
import TrendChart from "@/components/chart/TrendChart.vue";
import Chart from "@/components/chart/Chart.vue";
import ExperimentDetails from "@/components/experiment/ExperimentDetails.vue";
import PlateDetails from "@/pages/plate/PlateDetails.vue";
import WellDetails from "@/pages/well/WellDetails.vue";

export function usePanesList() {
  const selectionStore = useSelectionStore();

  /**
   * Configuration object for a Vue component tab in the workbench.
   *
   * @property {string} component - The name of the Vue component to be rendered in this tab.
   * @property {string} id - A unique identifier for the tab, used to track open components.
   * @property {string} title - The static title of the tab, displayed in the Add Pane menu.
   * @property {string} label - A descriptive name for the tab that can depend on variable data (if declared, title is not used as a tab name).
   * @property {string} icon - The icon displayed next to the tab name.
   * @property {boolean} closable - Indicates if the tab can be closed by the user.
   * @property {Object} props - Properties required by the Vue component to function.
   * @property {function} selection - Callback function reacting to emitted 'selection' events.
   * @property {string} [groupBy] - Optional property to group related tabs together.
   */

  const panesList = computed(() => [
    {
      component: RecentCalculations,
      id: "recent-calculations-pane",
      title: "Recent Calculations",
      icon: "calculate",
      closable: false,
      events: {},
    },
    {
      component: RecentProjects,
      id: "recent-projects-pane",
      title: "Recent Projects",
      icon: "folder",
      closable: false,
      events: {},
    },
    {
      component: RecentExperiments,
      id: "recent-experiments-pane",
      title: "Recent Experiments",
      icon: "science",
      closable: true,
      events: {},
    },
    {
      component: CreateProjectForm,
      id: "create-project-form-pane",
      title: "New Project",
      icon: "add",
      closable: true,
      events: {},
    },
    {
      component: ProjectsList,
      id: "project-list-pane",
      title: "Browse Projects",
      icon: "folder_open",
      groupBy: "list",
      closable: true,
      props: {
        projects: selectionStore.projects,
        selected: selectionStore.selectedProjects,
      },
      events: {
        selection: (e) => (selectionStore.selectedProjects = e),
        updated: async () => await selectionStore.fetchProjects(),
      },
    },
    {
      component: ProjectDetails,
      id: "project-details-pane",
      title: "Project Details",
      groupBy: "details",
      label: `Project Details (${
        selectionStore.selectedProjectDetails?.name || "none selected"
      })`,
      icon: "details",
      closable: true,
      props: {
        project: selectionStore.selectedProjectDetails,
        collapsible: false
      },
      events: {
        updated: async () =>
          await selectionStore.fetchProject(
            selectionStore.selectedProjectDetails.id
          ),
      },
    },
    {
      component: ExperimentList,
      id: "experiment-list-pane",
      title: "Browse Experiments",
      label: "Experiments",
      icon: "science",
      groupBy: "list",
      closable: true,
      props: {
        experiments: selectionStore.experiments,
        projects: selectionStore.selectedProjects,
        selected: selectionStore.selectedExperiments,
      },
      events: {
        selection: (e) => (selectionStore.selectedExperiments = e),
        updated: async () => await selectionStore.loadProjects(),
      },
    },
    {
      component: ExperimentDetails,
      id: "experiment-details-pane",
      title: "Experiment Details",
      groupBy: "details",
      label: `Experiment Details (${
        selectionStore.selectedExperimentDetails?.name || "none selected"
      })`,
      icon: "details",
      closable: true,
      props: {
        experiment: selectionStore.selectedExperimentDetails,
        collapsible: false
      },
      events: {
        updated: async () =>
          await selectionStore.fetchExperiment(
            selectionStore.selectedExperimentDetails.id
          ),
      },
    },
    {
      component: TrendChart,
      id: "experiment-chart-pane",
      groupBy: "chart",
      title: "Experiment's Plate Trend",
      label: `Experiment's Plate Trend (${
        selectionStore.chart?.experiment?.name || "none selected"
      })`,
      icon: "view_stream",
      closable: true,
      props: {
        update: Date.now(),
        chartId: selectionStore.chart.id,
        selectedExperiments: selectionStore.chart.experiment
          ? [selectionStore.chart.experiment]
          : [],
      },
      events: {
        selection: (e) => (selectionStore.selectedExperiments = e),
      },
    },
    {
      component: PlateList,
      id: "plates-list-pane",
      title: "Browse Plates",
      label: "Plates",
      icon: "science",
      groupBy: "list",
      closable: true,
      props: {
        plates: selectionStore.plates,
        selected: selectionStore.selectedPlates,
        experiments: selectionStore.selectedExperiments,
      },
      events: {
        selection: (e) => (selectionStore.selectedPlates = e),
        updated: async () => await selectionStore.loadExperiment(),
      },
    },
    {
      component: PlateDetails,
      id: "plate-details-pane",
      title: "Plate Details",
      label: `Plate Details (${
        selectionStore.selectedPlateDetails?.barcode || "none selected"
      })`,
      icon: "details",
      groupBy: "details",
      closable: true,
      props: {
        plate: selectionStore.selectedPlateDetails,
        activeMeasurement: selectionStore.activeMeasurement,
        collapsible: false
      },
      events: {
        updated: async () => {
          await selectionStore.fetchPlate(
            selectionStore.selectedPlateDetails.id
          );
        },
        deleted: async () => await selectionStore.loadExperiment(),
      },
    },
    {
      component: Chart,
      id: "scatterplot-chart-pane",
      title: "Scatterplot 2D",
      groupBy: "chart",
      label: `Scatterplot 2D (${
        selectionStore.plateChart?.plate?.barcode || "none selected"
      })`,
      icon: "scatter_plot",
      closable: true,
      props: {
        update: Date.now(),
        chartView: { ...selectionStore.plateChart, type: "scatter" },
        chartId: selectionStore.chart.id,
        selectedPlate: selectionStore.plateChart.plate,
        protocols: selectionStore.plateChart.protocols,
        selectedWells: selectionStore.selectedWells,
      },
      events: {
        selection: (e) => (selectionStore.selectedWells = e),
      },
    },
    {
      component: Chart,
      id: "boxplot-chart-pane",
      title: "Boxplot",
      groupBy: "chart",
      label: `Boxplot (${
        selectionStore.plateChart?.plate?.barcode || "none selected"
      })`,
      icon: "candlestick_chart",
      closable: true,
      props: {
        update: Date.now(),
        chartView: { ...selectionStore.plateChart, type: "box" },
        chartId: selectionStore.chart.id,
        selectedPlate: selectionStore.plateChart.plate,
        protocols: selectionStore.plateChart.protocols,
        selectedWells: selectionStore.selectedWells,
      },
      events: {
        selection: (e) => (selectionStore.selectedWells = e),
      },
    },
    {
      component: Chart,
      id: "histogram-chart-pane",
      title: "1D Histogram",
      label: `1D Histogram (${
        selectionStore.plateChart?.plate?.barcode || "none selected"
      } )`,
      icon: "bar_chart",
      groupBy: "chart",
      closable: true,
      props: {
        update: Date.now(),
        chartView: { ...selectionStore.plateChart, type: "histogram" },
        chartId: selectionStore.chart.id,
        selectedPlate: selectionStore.plateChart.plate,
        protocols: selectionStore.plateChart.protocols,
        selectedWells: selectionStore.selectedWells,
      },
      events: {
        selection: (e) => (selectionStore.selectedWells = e),
      },
    },
    {
      component: WellList,
      id: "wells-list-pane",
      title: "Wells",
      icon: "science",
      groupBy: "list",
      closable: true,
      props: {
        plates: selectionStore.plates,
        wells: selectionStore.wells,
      },
      events: {
        selection: (e) => (selectionStore.selectedWells = e),
      },
    },
    {
      component: WellDetails,
      id: "well-details-pane",
      title: "Well Details",
      groupBy: "details",
      label: `Well Details (${
        selectionStore.selectedWellDetails?.pos || "none selected"
      })`,
      icon: "details",
      closable: true,
      props: {
        well: selectionStore.selectedWellDetails,
        collapsible: false
      },
      events: {
        updated: async () =>
          await selectionStore.fetchWell(selectionStore.selectedWellDetails.id),
      },
    },
    {
      component: PlateHeatmap,
      id: "heatmap-chart-pane",
      title: "Heatmap",
      label: `Heatmap (${
        selectionStore.plateChart?.plate?.barcode || "none selected"
      })`,
      groupBy: "chart",
      icon: "view_module",
      closable: true,
      props: {
        plate: selectionStore.plateChart.plate,
        wells: selectionStore.heatmapWells,
        measurements:
          selectionStore.activeMeasurement !== null
            ? [selectionStore.activeMeasurement]
            : [],
        protocols: selectionStore.plateChart.protocols,
      },
      events: {
        // selection: (e) => (selectionStore.selectedWells = e),
      },
    },
  ]);

  return { panesList };
}
