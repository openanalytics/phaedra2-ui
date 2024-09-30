import usePanes from "@/composable/panes/dashboardPanes";

const { dashboardPanes, workbenchPanes } = usePanes();

export const panesMap = new Map([
  ["dashboard", dashboardPanes],
  ["workbench", workbenchPanes],
]);
