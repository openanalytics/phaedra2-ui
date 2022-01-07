<template>
  <div v-if="plate" ref="rootElement" style="width: 100%;" class="gridContainer oa-section relative-position"
      @mousedown="selectionBoxSupport.dragStart"
      @mousemove="selectionBoxSupport.dragMove"
      @mouseup="selectionBoxSupport.dragEnd">

    <div class="loadingAnimation" v-if="loading">
      <q-spinner-pie color="info" size="10em"/>
    </div>
    
    <WellSlot :ref="refWellSlot" v-for="well in plate.wells" :key="well.nr"
              :well="well"
              :wellColorFunction="wellColorFunction"
              :wellLabelFunctions="wellLabelFunctions"
              @wellSelection="handleWellSelection"
              :selectedWells="selectedWells"
              class="wellSlot"
    ></WellSlot>
  </div>
</template>

<style scoped>
.loadingAnimation {
  position: absolute;
  z-index: 10;
  justify-self: center;
  align-self: center;
}

.gridContainer {
  display: grid;
  grid-template-columns: v-bind(gridColumnStyle);
  min-height: 400px;
}

.wellSlot {
  min-height: v-bind(wellSlotHeight);
}
</style>

<script>
import {ref, computed} from 'vue'
import WellUtils from "@/lib/WellUtils.js"
import SelectionBoxHelper from "@/lib/SelectionBoxHelper.js"
import WellSlot from "@/components/widgets/WellSlot.vue"

export default {
  props: {
    plate: Object,
    loading: Boolean,
    wellColorFunction: Function,
    wellLabelFunctions: Array
  },
  components: {
    WellSlot
  },
  emits: ['wellSelection'],
  setup(props, {emit}) {
    const onKeyNav = function (event) {
      if (selectedWells.value.length == 0) return
      let currentWell = selectedWells.value[0]
      switch (event.key) {
        case "ArrowUp":
          handleWellSelection(WellUtils.getWell(props.plate, currentWell.row - 1, currentWell.column))
          break
        case "ArrowDown":
          handleWellSelection(WellUtils.getWell(props.plate, currentWell.row + 1, currentWell.column))
          break
        case "ArrowLeft":
          handleWellSelection(WellUtils.getWell(props.plate, currentWell.row, currentWell.column - 1))
          break
        case "ArrowRight":
          handleWellSelection(WellUtils.getWell(props.plate, currentWell.row, currentWell.column + 1))
          break
      }
    }
    window.addEventListener('keyup', onKeyNav)

    // Single well selection handling
    const selectedWells = ref([])
    const handleWellSelection = function (well) {
      if (!well) return
      selectedWells.value.splice(0)
      selectedWells.value.push(well)
      emit('wellSelection', selectedWells.value);
    }

    // Multi well selection handling
    const rootElement = ref(null)
    const wellSlots = ref([])
    const refWellSlot = function (slot) {
      wellSlots.value.push(slot)
    }
    const selectionBoxSupport = SelectionBoxHelper.addSelectionBoxSupport(rootElement, wellSlots, wells => {
      selectedWells.value.splice(0)
      wells.forEach(well => {
        selectedWells.value.push(well)
      })
      emit('wellSelection', selectedWells.value);
    });

    const gridColumnStyle = computed(() => { return "repeat(" + props.plate.columns + ", 1fr)" })
    const wellSlotHeight = (props.wellLabelFunctions.length * 15) + "px";

    return {
      selectedWells,
      handleWellSelection,
      onKeyNav,
      rootElement,
      refWellSlot,
      selectionBoxSupport,
      gridColumnStyle,
      wellSlotHeight
    }
  },
}
</script>
