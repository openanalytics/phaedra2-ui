import CreateProjectForm from "@/components/project/forms/CreateProjectForm.vue";
import RecentCalculations from "@/components/dashboard/panes/RecentCalculations";
import RecentProjects from "@/components/dashboard/panes/RecentProjects";
import RecentExperiments from "@/components/dashboard/panes/RecentExperiments";
import ProjectBrowser from "@/components/project/browser/ProjectBrowser.vue";
import ProjectDetails from "@/components/project/ProjectDetails.vue";
import ExperimentList from "@/components/experiment/ExperimentList.vue";
import PlateList from "@/components/plate/PlateList";

export const panesList = [
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
    component: ProjectBrowser,
    id: "browse-projects-pane",
    title: "Browse projects",
    icon: "folder_open",
    closable: true,
  },
  {
    component: ProjectDetails,
    id: "project-details-pane",
    title: "Project Details",
    icon: "details",
    closable: true,
  },
  {
    component: ExperimentList,
    id: "experiment-list-pane",
    title: "Experiments",
    icon: "science",
    closable: true,
  },
  {
    component: PlateList,
    id: "plates-list-pane",
    title: "Plates",
    icon: "science",
    closable: true,
  },
];
