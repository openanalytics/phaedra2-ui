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

  function createArray(
    array,
    firstItem,
    items,
    toItemIdx,
    itemsId,
    secondItem,
    direction
  ) {
    const itemsBefore = items.slice(0, toItemIdx);
    const itemsAfter = items.slice(toItemIdx + 1);

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
      console.log(ifFounds);
      if (!ifFounds && Array.isArray(items)) {
        items.forEach((item, j) => {
          if (Array.isArray(item) && item.length == 1) {
            item = item[0];
          }
          if (item == toId) {
            ifFounds = true;
            if (direction == "V") {
              if (position == "top") {
                array = createArray(array, id, items, j, i, item, "H");
              }
              if (position == "bottom") {
                array = createArray(array, item, items, j, i, id, "H");
              }
              if (position == "right") {
                array = createArray(array, item, items, j, i, id);
              }
              if (position == "left") {
                array = createArray(array, id, items, j, i, item);
              }
            }

            if (direction == "H") {
              if (position == "left") {
                array = createArray(array, id, items, j, i, item, "V");
              }
              if (position == "right") {
                array = createArray(array, item, items, j, i, id, "V");
              }
              if (position == "top") {
                array = createArray(array, id, items, j, item, i);
              }
              if (position == "bottom") {
                array = createArray(array, item, items, j, i, id);
              }
            }

            if (position == "center") {
              array = createArray(array, item, [...items, id], j, i);
            }
          }
        });
      }
    });
    if (ifFounds) {
      return array;
    }
    return insertItem(id, toId, array.slice(1));
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
