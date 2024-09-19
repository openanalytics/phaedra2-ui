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

  function insertItem(id, toId, array, position = "center") {
    let ifFounds = false;
    let direction = array[0];
    if (direction == "V" || direction == "H") {
      array.forEach((items, idx) => {
        console.log(items);
        if (!ifFounds && Array.isArray(items)) {
          ifFounds =
            items.find((item) => item == toId) && typeof component != "object";
          if (ifFounds) {
            direction =
              array[idx][0] == "H" || array[idx][0] == "H"
                ? array[idx][0]
                : direction;
            if (position == "center") {
              array[idx] = [...array[idx], id];
            }
            if (direction == "V") {
              if (position == "top") {
                array[idx] = ["H", [id], array[idx]];
              }
              if (position == "bottom") {
                array[idx] = ["H", array[idx], [id]];
              }
            }
            if (direction == "H") {
              if (position == "left") {
                array[idx] = ["V", [id], array[idx]];
              }
              if (position == "right") {
                console.log("right");
                console.log(items);
                console.log(array[idx]);
                array[idx] = ["V", array[idx], [id]];
              }
            }
          }
        }
      });
    }
    if (ifFounds) {
      return insertItemIntoPosition(id, array, position);
    }
    return insertItem(id, toId, array.slice(1));
  }

  function insertItemIntoPosition(id, array, position) {
    if (
      (position == "left" && array[0] == "V") ||
      (position == "top" && array[0] == "H")
    ) {
      return [array[0], [id], ...array.slice(1)];
    }
    if (
      (position == "right" && array[0] == "V") ||
      (position == "bottom" && array[0] == "H")
    ) {
      return [array[0], ...array.slice(1), [id]];
    }
    // if (position == "top" && array[0] == "V") {
    //   return ["H", [[id], ...array]];
    // }
    // if (position == "bottom" && array[0] == "V") {
    //   return ["H", [...array, [id]]];
    // }
    // if (position == "left" && array[0] == "H") {
    //   return ["V", [[id], ...array]];
    // }
    // if (position == "right" && array[0] == "H") {
    //   return ["V", [...array, [id]]];
    // }
    return array;
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
      dynamicPanes.value = insertItem(id, toId, dynamicPanes.value, position);
    }
  }

  function moveItem(id, toId, position) {
    if (id != toId) {
      if (activePanes.value.includes(id)) {
        removeItem(id);
      }
      dynamicPanes.value = insertItem(id, toId, dynamicPanes.value, position);
    }
  }

  function addMenuItem(id) {
    if (!activePanes.value.includes(id) && id != toId) {
      dynamicPanes.value = insertMenuItem(id, dynamicPanes.value);
    }
  }

  function setDynamicPanesStartValue(value) {
    dynamicPanes.value = value;
  }

  return {
    moveItem,
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
