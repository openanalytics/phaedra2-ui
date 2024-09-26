import CreateProjectForm from "@/components/project/forms/CreateProjectForm.vue";
import RecentCalculations from "@/components/dashboard/panes/RecentCalculations";
import RecentProjects from "@/components/dashboard/panes/RecentProjects";
import RecentExperiments from "@/components/dashboard/panes/RecentExperiments";
import ProjectDetails from "@/components/project/ProjectDetails.vue";
import ExperimentList from "@/components/experiment/ExperimentList.vue";
import PlateList from "@/components/plate/PlateList";
import { useSelectionStore } from "@/stores/selection";
import { computed } from "vue";
import ProjectsList from "@/components/project/ProjectsList.vue";
import WellList from "@/pages/plate/WellList.vue";

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
        project: selectionStore.projects[0],
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
      },
      selection: (e) => (selectionStore.selectedPanes = e),
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
