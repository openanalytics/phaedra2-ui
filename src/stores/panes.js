import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { shallowRef } from "vue";
import { usePanesList } from "../maps/panes/panesList";

export const usePanesStore = defineStore("panes", () => {
  const { panesList } = usePanesList();
  const panes = shallowRef(panesList);

  const draggedElement = ref();
  const key = ref(0);

  const dynamicPanes = ref([
    "H",
    ["recent-calculations-pane"],
    ["recent-projects-pane"],
    ["recent-experiments-pane"],
  ]);

  const activePanes = computed(() => {
    return dynamicPanes.value.flat(Infinity);
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
    if (Array.isArray(array)) {
      if (array.length == 2 && nestedIdx > 0) {
        if (array[0] == "H" || array[0] == "V") {
          array = array[1];
        }
      }

      for (let i = 0; i < array.length; i++) {
        array[i] = removeEmptyArrays(array[i], ++nestedIdx);
      }
      if (Array.isArray(array)) {
        return array.filter((pane) => pane.length != 0);
      }
    }
    return array;
  }

  function insertItemIfElementIsOnTheFirstLevel(id, toId, array, position) {
    if (array.length < 2) {
      return false;
    }
    if (
      (array[0] == "V" || array[0] == "H") &&
      array[1].find(
        (component) => component == toId && typeof component != "object"
      )
    ) {
      if (position == "center") {
        return [array[0], array[1], id];
      }
      if (position == "left" && array[0] == "V") {
        return [array[0], [id], array[1]];
      }
      if (position == "right" && array[0] == "V") {
        return [array[0], array[1], [id]];
      }
      if (position == "top" && array[0] == "H") {
        return [array[0], [id], array[1]];
      }
      if (position == "bottom" && array[0] == "H") {
        return [array[0], array[1], [id]];
      }
    }
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

  function insertMenuItem(id, array) {
    return array.map((pane) => {
      if (pane == "V" || pane == "H" || typeof pane == "string") {
        return pane;
      }
      if (pane.find((component) => typeof component != "object")) {
        return [...pane, id];
      }
      return insertItem(id, pane);
    });
  }

  function addItem(id, toId, position) {
    if (!activePanes.value.includes(id) && id != toId) {
      let checkPanes = insertItemIfElementIsOnTheFirstLevel(
        id,
        toId,
        dynamicPanes.value,
        position
      );
      console.log(checkPanes);
      if (checkPanes) {
        dynamicPanes.value = checkPanes;
      } else {
        dynamicPanes.value = insertItem(id, toId, dynamicPanes.value, position);
      }
    }
  }

  function addMenuItem(id) {
    if (!activePanes.value.includes(id) && id != toId) {
      dynamicPanes.value = insertMenuItem(id, dynamicPanes.value);
    }
  }

  function updateKey() {
    key.value = ++key.value % 100;
  }

  function setDynamicPanesStartValue(value) {
    dynamicPanes.value = value;
    updateKey();
  }

  return {
    key,
    dynamicPanes,
    draggedElement,
    removeItem,
    addItem,
    addMenuItem,
    mapComponents,
    panes,
    activePanes,
    setDynamicPanesStartValue,
  };
});
