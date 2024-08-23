import { computed } from "vue";

export default function usePanes() {
  const dashboardPanes = computed(() => [
    "H",
    ["recent-calculations-pane"],
    ["recent-projects-pane"],
    ["recent-experiments-pane"],
  ]);

  const workbenchPanes = computed(() => [
    "H",
    ["browse-projects-pane"],
    ["create-project-form-pane"],
  ]);

  return { dashboardPanes, workbenchPanes };
}
