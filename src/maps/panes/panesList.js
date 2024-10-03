import CreateProjectForm from "@/components/project/forms/CreateProjectForm.vue";
import RecentCalculations from "@/components/dashboard/panes/RecentCalculations";
import RecentProjects from "@/components/dashboard/panes/RecentProjects";
import RecentExperiments from "@/components/dashboard/panes/RecentExperiments";
import ProjectDetails from "@/components/project/ProjectDetails.vue";
import ExperimentList from "@/components/experiment/ExperimentList.vue";
import PlateList from "@/components/plate/PlateList";
import ProjectsList from "@/components/project/ProjectsList.vue";
import WellList from "@/pages/plate/WellList.vue";
import { computed } from "vue";
import { useSelectionStore } from "@/stores/selection";
import TrendChart from "@/components/chart/TrendChart.vue";
import Chart from "@/components/chart/Chart.vue";

export function usePanesList() {
  const selectionStore = useSelectionStore();

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
      title: "Browse projects",
      icon: "folder_open",
      closable: true,
      props: {
        projects: selectionStore.projects,
        selected: selectionStore.selectedProjects,
      },
      selection: (e) => (selectionStore.selectedProjects = e),
    },
    {
      component: ProjectDetails,
      id: "project-details-pane",
      title: "Project Details",
      icon: "details",
      closable: true,
      props: {
        project: selectionStore.selectedProjects[0],
      },
    },
    {
      component: ExperimentList,
      id: "experiment-list-pane",
      title: "Experiments",
      icon: "science",
      closable: true,
      props: {
        experiments: selectionStore.experiments,
        projects: selectionStore.selectedProjects,
        selected: selectionStore.selectedExperiments,
      },
      selection: (e) => (selectionStore.selectedExperiments = e),
    },
    {
      component: TrendChart,
      id: "experiment-chart-pane",
      title: "Experiment's Plate Trend",
      icon: "view_stream",
      closable: true,
      props: {
        update: Date.now(),
        chartId: selectionStore.chart.id,
        selectedExperiments: [selectionStore.chart.experiment],
      },
      selection: (e) => (selectionStore.selectedExperiments = e),
    },
    {
      component: PlateList,
      id: "plates-list-pane",
      title: "Plates",
      icon: "science",
      closable: true,
      props: {
        plates: selectionStore.plates,
        selected: selectionStore.selectedPlates,
        experiments: selectionStore.selectedExperiments,
      },
      selection: (e) => (selectionStore.selectedPlates = e),
    },
    {
      component: Chart,
      id: "scatterplot-chart-pane",
      title: "Scatterplot 2D",
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
    },
    {
      component: Chart,
      id: "boxplot-chart-pane",
      title: "Boxplot",
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
    },
    {
      component: Chart,
      id: "histogram-chart-pane",
      title: "1D Histogram",
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
    },
    {
      component: WellList,
      id: "wells-list-pane",
      title: "Wells",
      icon: "science",
      closable: true,
      props: {
        plate: selectionStore.plates ? selectionStore.plates[0] : [],
        wells: selectionStore.wells,
      },
      selection: (e) => (selectionStore.selectedWells = e),
    },
  ]);

  return { panesList };
}