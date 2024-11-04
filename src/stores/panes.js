import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { shallowRef } from "vue";
import { usePanesList } from "../maps/panes/panesList";

export const usePanesStore = defineStore("panes", () => {
  const { panesList } = usePanesList();
  const panes = shallowRef(panesList);

  const draggedElement = ref();

  const dynamicPanes = ref([
    "H",
    ["recent-calculations-pane"],
    ["recent-projects-pane"],
    ["recent-experiments-pane"],
  ]);

  const activePanes = computed(() => {
    return dynamicPanes.value
      .flat(Infinity)
      .map((pane) => {
        const result = panesList.value.find((item) => item.id == pane);
        if (result) {
          return result;
        }
        return;
      })
      .filter((pane) => pane != null);
  });
  function mapComponents(idMap) {
    return idMap.map((id) => panes.value.filter((pane) => pane.id == id)[0]);
  }

  function removeItem(id) {
    dynamicPanes.value = removeItemRecursive(id, dynamicPanes.value);
    dynamicPanes.value = removeEmptyArrays(dynamicPanes.value);
  }

  function removeItemRecursive(id, array) {
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
      return removeItemRecursive(id, pane);
    });
  }

  function removeEmptyArrays(array, nestedIdx = 0) {
    if (array.length > 1) {
      ++nestedIdx;
      if (Array.isArray(array)) {
        for (let i = 0; i < array.length; i++) {
          array[i] = removeEmptyArrays(array[i], nestedIdx);
        }
      }
    }

    if (Array.isArray(array)) {
      array = array.filter((pane) => pane.length != 0);
    }

    if (Array.isArray(array)) {
      if (array.length == 2 && nestedIdx > 1) {
        if (array[0] == "H" || array[0] == "V") {
          array = array[1];
        }
      }
    }

    return array;
  }

  function insertItem(id, toId, array, position) {
    return array.map((pane) => {
      if (pane == "V" || pane == "H" || typeof pane == "string") {
        return pane;
      }
      //TODO test for panes refreshing
      // if (pane.length > 1) {
      //   if (
      //     (pane[0] == "V" || pane[0] == "H") &&
      //     pane[1].find(
      //       (component) => component == toId && typeof component != "object"
      //     )
      //   ) {
      //     const paneDirection = pane[0];
      //     const panes = pane[1];
      //     if (position == "center") {
      //       return [pane[0], ...pane[1], id];
      //     }
      //     if (position == "left" && pane[0] == "V") {
      //       return [pane[0], [id], ...pane[1]];
      //     }
      //     if (position == "right" && pane[0] == "V") {
      //       return [pane[0], ...pane[1], [id]];
      //     }
      //     if (position == "top" && pane[0] == "H") {
      //       return [pane[0], [id], ...pane[1]];
      //     }
      //     if (position == "bottom" && pane[0] == "H") {
      //       return [pane[0], ...pane[1], [id]];
      //     }
      //   }
      // }
      if (
        pane.find(
          (component) => component == toId && typeof component != "object"
        )
      ) {
        // const paneDirection = pane[0]
        // const panes = pane.slice
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
    if (!activePanes.value.find((pane) => pane.id == id) && id != toId) {
      dynamicPanes.value = insertItem(id, toId, dynamicPanes.value, position);
    }
  }

  function addMenuItem(id) {
    if (dynamicPanes.value.length < 2) {
      dynamicPanes.value = ["V", [id]];
    } else {
      dynamicPanes.value = insertItem(
        id,
        activePanes.value[0].id,
        dynamicPanes.value,
        "right"
      );
    }
  }

  function moveItem(id, toId, position) {
    if (id != toId) {
      if (activePanes.value.find((pane) => pane.id == id)) {
        removeItem(id);
      }
      dynamicPanes.value = insertItem(id, toId, dynamicPanes.value, position);
    }
  }

  function setDynamicPanesStartValue(value) {
    dynamicPanes.value = value;
  }

  function openTab(tabId) {
    const newTab = panesList.value.find((pane) => pane.id == tabId);
    const panes = activePanes.value.filter((pane) => {
      return pane.groupBy && pane.groupBy == newTab.groupBy;
    });
    if (panes.length > 0) {
      addItem(tabId, panes[0].id, "center");
    } else {
      addMenuItem(tabId);
    }
  }

  function closeAllTabs() {
    dynamicPanes.value = [];
  }

  return {
    dynamicPanes,
    draggedElement,
    removeItem,
    addItem,
    addMenuItem,
    mapComponents,
    panes,
    activePanes,
    setDynamicPanesStartValue,
    moveItem,
    openTab,
    closeAllTabs,
  };
});
