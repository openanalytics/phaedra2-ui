import { usePanesStore } from "@/stores/panes";
import { panesMap } from "@/maps/panes/panesMap";

export function prepareDashboard() {
  const panesStore = usePanesStore();
  panesStore.setDynamicPanesStartValue(panesMap.get("dashboard").value);
}
export function prepareWorkbench() {
  const panesStore = usePanesStore();
  panesStore.setDynamicPanesStartValue(panesMap.get("workbench").value);
}
