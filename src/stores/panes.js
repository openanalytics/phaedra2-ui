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

  function createArray(
    array,
    items,
    itemsId,
    arrayId,
    firstItem,
    secondItem,
    direction
  ) {
    let itemsBefore = [];
    let itemsAfter = [];

    if (arrayId == -1) {
      itemsBefore = items;
      itemsAfter = [];
    } else {
      itemsBefore = items.slice(0, arrayId);
      itemsAfter = items.slice(arrayId + 1);
    }

    const arrayBefore = array.slice(0, itemsId);
    const arrayAfter = array.slice(itemsId + 1);

    let tmpItem = [];
    let tmpArray = [];

    if (itemsBefore.length > 0) {
      tmpItem.push(...itemsBefore);
    }

    if (secondItem) {
      if (direction) {
        tmpItem.push([direction, [firstItem], [secondItem]]);
      } else {
        tmpItem.push([firstItem]);
        tmpItem.push([secondItem]);
      }
      if (itemsAfter.length > 0) {
        tmpItem.push(...itemsAfter);
      }
    } else {
      tmpItem.push([firstItem, ...itemsAfter]);
    }

    if (arrayBefore.length > 0) {
      tmpArray.push(...arrayBefore);
    }

    if (tmpItem[0] == "V" || tmpItem[0] == "H") {
      tmpArray.push(tmpItem);
    } else {
      tmpArray.push(...tmpItem);
    }
    if (arrayAfter.length > 0) {
      tmpArray.push(...arrayAfter);
    }
    return tmpArray;
  }

  function insertItem(id, toId, array, position = "center") {
    let ifFounds = false;
    let direction = array[0];
    array.forEach((items, i) => {
      direction =
        array[i][0] == "H" || array[i][0] == "V" ? array[i][0] : direction;
      if (!ifFounds && Array.isArray(items)) {
        items.forEach((item, j) => {
          if (Array.isArray(item) && item.length == 1) {
            item = item[0];
          }

          let condition = item == toId;

          if (Array.isArray(items) && items.length > 1) {
            condition = items.find((elem) => elem == toId);
            // j = -1;
          }

          if (condition) {
            ifFounds = true;
            switch (direction) {
              case "V": {
                switch (position) {
                  case "top": {
                    array = createArray(array, items, i, j, id, item, "H");
                    break;
                  }
                  case "bottom": {
                    array = createArray(array, items, i, j, item, id, "H");
                    break;
                  }
                  case "right": {
                    array = createArray(array, items, i, j, item, id);
                    break;
                  }
                  case "left": {
                    array = createArray(array, items, i, j, id, item);
                    break;
                  }
                  default: {
                    break;
                  }
                }
                break;
              }

              case "H": {
                switch (position) {
                  case "left": {
                    array = createArray(array, items, i, j, id, item, "V");
                    break;
                  }
                  case "right": {
                    array = createArray(array, items, i, j, item, id, "V");
                    break;
                  }
                  case "top": {
                    array = createArray(array, items, i, j, id, item);
                    break;
                  }
                  case "bottom": {
                    array = createArray(array, items, i, j, item, id);
                    break;
                  }
                  default: {
                    break;
                  }
                }
                break;
              }
              default: {
                break;
              }
            }
            if (position == "center") {
              array = createArray(array, [...items, id], i, j, item);
            }
          }
        });
      }
    });
    if (ifFounds) {
      return array;
    }
    return insertItem(id, toId, array.slice(1)[0]);
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
