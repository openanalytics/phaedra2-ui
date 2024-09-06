import { ref } from "vue";
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
    console.log(id);
    console.log(toId);
    if (id != toId) {
      removeItem(id);
      dynamicPanes.value = insertItem(id, toId, dynamicPanes.value, position);
    }
  }

  function addMenuItem(id) {
    console.log(id);
    removeItem(id);
    dynamicPanes.value = insertMenuItem(id, dynamicPanes.value);
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
    setDynamicPanesStartValue,
  };
});
