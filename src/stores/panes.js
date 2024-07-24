import { computed, ref } from "vue";
import { defineStore } from "pinia";
import RecentCalculations from "@/components/dashboard/panes/RecentCalculations";
import RecentProjects from "@/components/dashboard/panes/RecentProjects";
import RecentExperiments from "@/components/dashboard/panes/RecentExperiments";
export const usePanesStore = defineStore("panes", () => {
  const draggedElement = ref();

  const panes = ref([
    {
      component: RecentCalculations,
      id: "recent-calculations-pane",
      title: "Recent Calculations",
      icon: "calculate",
      pane: "right",
      closable: false,
    },
    {
      component: RecentProjects,
      id: "recent-projects-pane",
      title: "Recent Projects",
      icon: "folder",
      pane: "center",
      closable: false,
    },
    {
      component: RecentExperiments,
      id: "recent-experiments-pane",
      title: "Recent Experiments",
      icon: "science",
      pane: "left",
      closable: true,
    },
  ]);

  const leftPaneComponents = computed(() =>
    panes.value.filter((pane) => pane.pane == "left")
  );
  const centerPaneComponents = computed(() =>
    panes.value.filter((pane) => pane.pane == "center")
  );
  const bottomPaneComponents = computed(() =>
    panes.value.filter((pane) => pane.pane == "bottom")
  );
  const rightPaneComponents = computed(() =>
    panes.value.filter((pane) => pane.pane == "right")
  );

  function removeItem(component) {
    var pane = panes.value.find((pane) => {
      return pane.component == component;
    });
    if (pane.closable) {
      pane.pane = undefined;
    }
  }

  function addItem(component, list) {
    console.log("yupi yey");
    console.log(component);
    console.log(list);
    var pane = panes.value.find((pane) => {
      return pane.component == component;
    });
    pane.pane = list;
  }

  return {
    leftPaneComponents,
    rightPaneComponents,
    bottomPaneComponents,
    centerPaneComponents,
    draggedElement,
    removeItem,
    addItem,
    panes,
  };
});
