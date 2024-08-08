import { ref } from "vue";
import { defineStore } from "pinia";
import RecentCalculations from "@/components/dashboard/panes/RecentCalculations";
import RecentProjects from "@/components/dashboard/panes/RecentProjects";
import RecentExperiments from "@/components/dashboard/panes/RecentExperiments";
import { shallowRef } from "vue";

export const usePanesStore = defineStore("panes", () => {
  const panes = shallowRef([
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
  ]);

  const draggedElement = ref();

  const dynamicPanes = ref([
    "V",
    [
      "H",
      ["recent-calculations-pane"],
      ["recent-projects-pane"],
      ["recent-experiments-pane"],
    ],
  ]);

  function mapComponents(idMap) {
    return idMap.map((id) => panes.value.filter((pane) => pane.id == id)[0]);
  }

  function removeItem(id, array) {
    return array.map((pane) => {
      if (pane == "V" || pane == "H" || typeof pane == "string") {
        return pane;
      }
      if (
        pane.find(
          (component) => component == id && typeof component != "object"
        )
      ) {
        pane = pane.filter(
          (component) => component != id && typeof component != "object"
        );
        return pane;
      }
      return removeItem(id, pane);
    });
  }

  function removeEmptyArrays(array) {
    if (typeof array == "object") {
      if (array.length == 2) {
        if (array[0] == "H" || array[0] == "V") {
          array = array[1];
        }
      }

      for (let i = 0; i < array.length; i++) {
        array[i] = removeEmptyArrays(array[i]);
      }
    }
    if (typeof array == "object") {
      return array.filter((pane) => pane.length != 0);
    }
    return array;
  }

  function insertItem(id, toId, array, position) {
    return array.map((pane) => {
      if (pane == "V" || pane == "H" || typeof pane == "string") {
        return pane;
      }
      if (
        pane.find(
          (component) => component == toId && typeof component != "object"
        )
      ) {
        if (position == "center") {
          return [...pane, id];
        }
        if (position == "left") {
          return ["V", [id], pane];
        }
        if (position == "right") {
          return ["V", pane, [id]];
        }
        if (position == "top") {
          return ["H", [id], pane];
        }
        if (position == "bottom") {
          return ["H", pane, [id]];
        }
        return [...pane, id];
      }
      return insertItem(id, toId, pane, position);
    });
  }

  function addItem(id, toId, position) {
    if (id != toId) {
      dynamicPanes.value = removeItem(id, dynamicPanes.value);
      dynamicPanes.value = removeEmptyArrays(dynamicPanes.value);
      dynamicPanes.value = insertItem(id, toId, dynamicPanes.value, position);
    }
  }

  return {
    dynamicPanes,
    draggedElement,
    removeItem,
    addItem,
    mapComponents,
    panes,
  };
});
