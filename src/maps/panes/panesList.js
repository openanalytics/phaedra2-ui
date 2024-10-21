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
import { usePanesStore } from "@/stores/panes";
import TrendChart from "@/components/chart/TrendChart.vue";
import Chart from "@/components/chart/Chart.vue";

export function usePanesList() {
  const selectionStore = useSelectionStore();
  const panesStore = usePanesStore();

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
    },
    {
      component: RecentProjects,
      id: "recent-projects-pane",
      title: "Recent Projects",
      icon: "folder",
      closable: false,
    },
    {
      component: RecentExperiments,
      id: "recent-experiments-pane",
      title: "Recent Experiments",
      icon: "science",
      closable: true,
    },
    {
      component: CreateProjectForm,
      id: "create-project-form-pane",
      title: "New Project",
      icon: "add",
      closable: true,
    },
    {
      component: ProjectsList,
      id: "project-list-pane",
      title: "Browse Projects",
      icon: "folder_open",
      closable: true,
      props: {
        projects: selectionStore.projects,
        selected: selectionStore.selectedProjects,
      },
      selection: (e) => (selectionStore.selectedProjects = e),
      open: (e) => {
        switch (e.resource) {
          case "project":
            panesStore.openTab("project-details-pane", "project-list-pane");
            break
          case "experiment":
            panesStore.openTab("experiment-list-pane", "project-list-pane");
            break
          default:
            break
        }
      },
      groupBy: "list",
    },
    {
      component: ProjectDetails,
      id: "project-details-pane",
      title: "Project Details",
      label: `Project Details (${selectionStore.selectedProjects[0]?.name || "none selected"})`,
      icon: "details",
      closable: true,
      props: {
        project:
          selectionStore.selectedProjects.length > 0
            ? selectionStore.selectedProjects[0]
            : undefined,
      },
      groupBy: "details",
    },
    {
      component: ExperimentList,
      id: "experiment-list-pane",
      title: "Browse Experiments",
      label: "Experiments",
      icon: "science",
      closable: true,
      props: {
        experiments: selectionStore.experiments,
        projects: selectionStore.selectedProjects,
        selected: selectionStore.selectedExperiments,
      },
      selection: (e) => (selectionStore.selectedExperiments = e),
      open: (e) => {
        switch (e.resource) {
          case "plates":
            panesStore.openTab("plates-list-pane", "experiment-list-pane");
            break
          case "experiment":
            panesStore.openTab("experiment-chart-pane", "experiment-list-pane");
            break
          default:
            break
        }
      },
      groupBy: "list",
    },
    {
      component: TrendChart,
      id: "experiment-chart-pane",
      title: "Experiment's Plate Trend",
      label: `Experiment's Plate Trend (${selectionStore.chart?.experiment?.name || "none selected"})`,
      icon: "view_stream",
      closable: true,
      props: {
        update: Date.now(),
        chartId: selectionStore.chart.id,
        selectedExperiments: selectionStore.chart.experiment
          ? [selectionStore.chart.experiment]
          : [],
      },
      selection: (e) => (selectionStore.selectedExperiments = e),
      groupBy: "chart",
    },
    {
      component: PlateList,
      id: "plates-list-pane",
      title: "Browse Plates",
      label: "Plates",
      icon: "science",
      closable: true,
      props: {
        plates: selectionStore.plates,
        selected: selectionStore.selectedPlates,
        experiments: selectionStore.selectedExperiments,
      },
      selection: (e) => (selectionStore.selectedPlates = e),
      open: (e) => { 
        switch (e.resource) {
          case 'wells':
            panesStore.openTab(`${e.resource}-list-pane`, "panes-list-pane")
            break
          case 'scatterplot':
            panesStore.openTab("scatterplot-chart-pane", "plates-list-pane");
            break
          case 'boxplot':
            panesStore.openTab("boxplot-chart-pane", "plates-list-pane");
            break
          case 'histogram':
            panesStore.openTab("histogram-chart-pane", "plates-list-pane");
            break
          case 'heatmap':
            panesStore.openTab("heatmap-chart-pane", "plates-list-pane");
            break
          case 'experiment':
            panesStore.openTab("experiment-chart-pane", "plates-list-pane");
            break
          default:
            break
        }
      },
      groupBy: "list",
    },
    {
      component: Chart,
      id: "scatterplot-chart-pane",
      title: "Scatterplot 2D",
      label: `Scatterplot 2D (${selectionStore.plateChart?.plate?.barcode || "none selected"})`,
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
      selection: (e) => (selectionStore.selectedWells = e),
      groupBy: "chart",
    },
    {
      component: Chart,
      id: "boxplot-chart-pane",
      title: "Boxplot",
      label: `Boxplot (${selectionStore.plateChart?.plate?.barcode || "none selected"})`,
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
      selection: (e) => (selectionStore.selectedWells = e),
      groupBy: "chart",
    },
    {
      component: Chart,
      id: "histogram-chart-pane",
      title: "1D Histogram",
      label: `1D Histogram (${selectionStore.plateChart?.plate?.barcode || "none selected"} )`,
      icon: "bar_chart",
      closable: true,
      props: {
        update: Date.now(),
        chartView: { ...selectionStore.plateChart, type: "histogram" },
        chartId: selectionStore.chart.id,
        selectedPlate: selectionStore.plateChart.plate,
        protocols: selectionStore.plateChart.protocols,
        selectedWells: selectionStore.selectedWells,
      },
      selection: (e) => (selectionStore.selectedWells = e),
      groupBy: "chart",
    },
    {
      component: WellList,
      id: "wells-list-pane",
      title: "Wells",
      icon: "science",
      closable: true,
      props: {
        plates: selectionStore.plates,
        wells: selectionStore.wells,
      },
      selection: (e) => (selectionStore.selectedWells = e),
      groupBy: "list",
    },
    {
      component: PlateHeatmap,
      id: "heatmap-chart-pane",
      title: "Heatmap",
      label: `Heatmap (${selectionStore.plateChart?.plate?.barcode || "none selected"})`,
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
      // selection: (e) => (selectionStore.selectedWells = e),
      groupBy: "chart",
    },
  ]);

  return { panesList };
}
