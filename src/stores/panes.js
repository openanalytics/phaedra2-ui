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
    array, //array to update
    items, //items - a specific part of array in which the `toId` was found
    arrayId, //id of items in array
    itemsId, //id of `toId` in items
    firstItem, //first elemnet that should be inserted into items
    secondItem, //second item that should be inserted (one of them is `id` one of them is `toId`, the name is first and second because sometimes `'id` will be first, sometimes `toId)
    direction //direction if the direction had to be changed, it should be declared here
  ) {
    let itemsBefore = [];
    let itemsAfter = [];

    if (arrayId == -1) {
      //some modifications to check our current issue with multicomponent - this one shouldnt work yet
      itemsBefore = items;
      itemsAfter = [];
    } else {
      itemsBefore = items.slice(0, itemsId); //normally I divide items into itemsBefore and itemsAfter `toId`
      itemsAfter = items.slice(itemsId + 1);
    }

    const arrayBefore = array.slice(0, arrayId); //divide array into array elements before items and after items
    const arrayAfter = array.slice(arrayId + 1);

    let tmpItem = []; //new items (updated with item that should be inserted)
    let tmpArray = []; //new array (updated)

    if (itemsBefore.length > 0) {
      //if items before are not empty - push them   (spread them because they were already a part of array)
      tmpItem.push(...itemsBefore);
    }

    if (secondItem) {
      //if there ius second item - lets consider it - if there is no second item - it means that user chose position as a center and the logic is different
      if (direction) {
        //if direction is going ot change we need to insert `id` and `toId` with a proper direction
        tmpItem.push([direction, [firstItem], [secondItem]]);
      } else {
        //if direction is not going to change - just push them as a separate arrays with one items
        tmpItem.push([firstItem]);
        tmpItem.push([secondItem]);
      }
      if (itemsAfter.length > 0) {
        //if items after are not empty, lets push them (spread them because they were already a part of array)
        tmpItem.push(...itemsAfter);
      }
    } else {
      //if center position is chosen - we should merge the new item with the items array
      tmpItem.push([firstItem, ...itemsAfter]);
    }

    if (arrayBefore.length > 0) {
      //lets create a final array - at first if array before is not empty - lets spread it
      tmpArray.push(...arrayBefore);
    }

    if (tmpItem[0] == "V" || tmpItem[0] == "H") {
      //if there is a new direction - lets put a whole tmpItem as a next
      tmpArray.push(tmpItem);
    } else {
      // if a direction is still the same - lets spread the items, because they didnt need to be in a separate construction
      tmpArray.push(...tmpItem);
    }
    if (arrayAfter.length > 0) {
      //if array after is not empty - lets spread it
      tmpArray.push(...arrayAfter);
    }
    return tmpArray; //return the updated with `id` array
  }

  /*
  insert new element with `id` as id next to the `toId` element
  array is the array into which we should insert element 
  position - right/left/top/bottom/center determines the position of `id` element towards `toId` 

  method is recursive - if the `toId` is not found in the first iteration, it will call the same method with reduced array
  */
  function insertItem(id, toId, array, position = "center") {
    let ifFounds = false; // flag - checks if `toId` element is already found
    let direction = array[0]; //direction - H || V, all the arrays has a direction as a first element
    array.forEach((items, i) => {
      //lets iterate through array elements to find the `toId`
      direction =
        array[i][0] == "H" || array[i][0] == "V" ? array[i][0] : direction; // direction can change in nested array -> so reassign it if that happen
      if (!ifFounds && Array.isArray(items)) {
        //if `toId` is not found yet and the items are the array we can try to locate the `toId` (example: ['v', ['projects], ['h', ['experiments', 'plates']]])
        items.forEach((item, j) => {
          if (Array.isArray(item) && item.length == 1) {
            item = item[0]; //here there is some magic, the ['projects'] sometimes was read as ['projects'] and sometimes as 'projects', so if there is an array with one elements, I just simplify it to always have the same representation
          }

          let condition = item == toId; // the base condition to find the `toId` element - it should work almost always - the only exception is when there is single pane with a few components and one of those components want to open a new pane - then it doesnt work

          if (Array.isArray(items) && items.length > 1) {
            condition = items.find((elem) => elem == toId); //here Im trying to find a solution for this specific situation, the logic is the following: if `toId` is found as a part of an array that doesnt start with the direction and have more than one element it means that the situation when element from multicomponent pane want to open a new pane (['projects'. 'toId'])
            // j = -1; //I dont have a proper way to handle it- I mean actually I have but it destroyed another logic point so I resigned from it (but probably I will work with that again) - if you are interested its here: https://notes.openanalytics.eu/2HRs2FrjSNea5BaNiAfagQ
          }

          if (condition) {
            //if `toId` is located - lets insert `id`
            ifFounds = true; //reassign the flag
            switch (
              direction //different way to insert it is when the direction is h (horizontally) and v (vertically)
            ) {
              case "V": {
                switch (
                  position //different way is for each type of position (the center is considered below everything, because center is completely different)
                ) {
                  case "top": {
                    array = createArray(array, items, i, j, id, item, "H"); //if its vertical and we want to put something on top - we need to add an `id` element before `toId` and new direction
                    break;
                  }
                  case "bottom": {
                    array = createArray(array, items, i, j, item, id, "H"); //if its vertical and we want to put something on bottom - we need to add an `toId` element before `id` and new direction
                    break;
                  }
                  case "right": {
                    array = createArray(array, items, i, j, item, id); //if its vertical and we want to put something on right - we need to add an `id` element before `toId` and dont change the direction
                    break;
                  }
                  case "left": {
                    array = createArray(array, items, i, j, id, item); //if its vertical and we want to put something on left - we need to add an `toId` element before `id` and dont change the direction
                    break;
                  }
                  default: {
                    break;
                  }
                }
                break;
              }

              case "H": {
                //here is the same logic as in the 'V' but with reversed directions
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
              //if position is center - then we dont need to add any element, it means that we just want to `extend` already existed array that contains `toId` with an `id`
              array = createArray(array, [...items, id], i, j, item);
            }
          }
        });
      }
    });
    if (ifFounds) {
      return array; //if we found element it means we updated the array and we can finish algorithm
    }
    return insertItem(id, toId, array.slice(1)[0]); //if we didn't then letrs iterate with a reduced part of array ([0] is needed to 'unpack' nested array, otherwise we would have array with an array inside and then the data, we dont need two nested arrays for this algorithm )
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
