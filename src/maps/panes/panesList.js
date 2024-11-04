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
      updated: () => selectionStore.fetchProjects(),
      groupBy: "list",
    },
    {
      component: ProjectDetails,
      id: "project-details-pane",
      title: "Project Details",
      label: `Project Details (${selectionStore.selectedProjectDetails?.name || "none selected"})`,
      icon: "details",
      closable: true,
      props: {
        project: selectionStore.selectedProjectDetails,
      },
      groupBy: "details",
      updated: () =>
        selectionStore.fetchProject(selectionStore.selectedProjectDetails.id),
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
      updated: () => selectionStore.loadProjects(),
      groupBy: "list",
    },
    {
      component: ExperimentDetails,
      id: "experiment-details-pane",
      title: "Experiment Details",
      label: `Experiment Details (${selectionStore.selectedExperimentDetails?.name || "none selected"})`,
      icon: "details",
      closable: true,
      props: {
        experiment: selectionStore.selectedExperimentDetails,
      },
      groupBy: "details",
      updated: () =>
        selectionStore.fetchExperiment(
          selectionStore.selectedExperimentDetails.id
        ),
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
      updated: () => selectionStore.loadExperiment(),
      groupBy: "list",
    },
    {
      component: PlateDetails,
      id: "plate-details-pane",
      title: "Plate Details",
      label: `Plate Details (${selectionStore.selectedPlateDetails?.barcode || "none selected"})`,
      icon: "details",
      closable: true,
      props: {
        plate: selectionStore.selectedPlateDetails,
        activeMeasurement: selectionStore.activeMeasurement,
      },
      groupBy: "details",
      updated: () =>
        selectionStore.fetchPlate(selectionStore.selectedPlateDetails.id),
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
      component: WellDetails,
      id: "well-details-pane",
      title: "Well Details",
      label: `Well Details (${selectionStore.selectedWellDetails?.pos || "none selected"})`,
      icon: "details",
      closable: true,
      props: {
        well: selectionStore.selectedWellDetails,
      },
      groupBy: "details",
      updated: () =>
        selectionStore.fetchWell(selectionStore.selectedWellDetails.id),
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
